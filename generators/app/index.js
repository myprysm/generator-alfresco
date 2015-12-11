'use strict';
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.props = this.config.getAll() || {};
  },
  prompting: function () {
    var done = this.async();
    var defaultAppBaseName = /^[a-zA-Z0-9_-]+$/.test(path.basename(process.cwd())) ? path.basename(process.cwd()) : 'sample-aio';
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the solid ' + chalk.red('generator-alfresco') + ' generator!'
    ));

    var prompts = [{
      type: 'input',
      name: 'name',
      message: 'Name of the project',
      default: defaultAppBaseName
    }, {
      type: 'input',
      name: 'description',
      message: 'Description of the project'
    }, {
      type: 'input',
      name: 'groupId',
      message: 'Enter the groupId',
      default: 'com.example'
    }, {
      type: 'input',
      name: 'artifactId',
      message: 'Enter the artifactId',
      default: function (answers) {
        return answers.name;
      }
    }, {
      type: 'input',
      name: 'package',
      message: 'Enter the package',
      default: function (answers) {
        return answers.groupId + '.' + _.camelCase(answers.name);
      },
      validate: function (input) {
        return (input.match(/[a-zA-Z\.]+/g) || []).length > 0 || 'Doesn\'t match a package name...';
      }
    }, {
      type: 'input',
      name: 'version',
      message: 'Version number',
      default: '1.0-SNAPSHOT'
    }];

    this.prompt(prompts, function (props) {
      this.props = props;
      this.appname = props.name;
      done();
    }.bind(this));
  },
  configuring: function () {
    this.config.set(this.props);
    this.config.save();
  },

  writing: function () {
    var parent = {
      groupId: this.props.groupId,
      artifactId: this.props.artifactId,
      version: this.props.version
    };

    var pkg = {
      package: this.props.package
    };

    var shareAmp = this.props.artifactId + '-share-amp';
    var shareModule = {moduleId: shareAmp};
    var sharePom = _.assign({}, parent, shareModule);
    var sharePkg = _.assign({}, pkg, shareModule);
    var sharePath = shareAmp + '/';

    var repoAmp = this.props.artifactId + '-repo-amp';
    var repoModule = {moduleId: repoAmp};
    var repoPom = _.assign({}, parent, repoModule);
    var repoPkg = _.assign({}, pkg, repoModule);
    var repoPath = repoAmp + '/';

    this.fs.copy(
      this.templatePath('dummyfile.txt'),
      this.destinationPath('dummyfile.txt')
    );

    this.fs.copy(
      this.templatePath('.gitignore'),
      this.destinationPath('.gitignore')
    );
    this.fs.copy(
      this.templatePath('run.bat'),
      this.destinationPath('run.bat')
    );
    this.fs.copy(
      this.templatePath('run.sh'),
      this.destinationPath('run.sh')
    );

    // SolR 4 Config
    this.fs.copyTpl(
      this.templatePath('solr-config/pom.xml'),
      this.destinationPath('solr-config/pom.xml'),
      parent
    );


    // Share config
    this.fs.copy(
      this.templatePath('share/src'),
      this.destinationPath('share/src')
    );

    this.fs.copyTpl(
      this.templatePath('share/pom.xml'),
      this.destinationPath('share/pom.xml'),
      sharePom
    );

    // Alfresco config
    this.fs.copy(
      this.templatePath('repo/src'),
      this.destinationPath('repo/src')
    );

    this.fs.copyTpl(
      this.templatePath('repo/pom.xml'),
      this.destinationPath('repo/pom.xml'),
      repoPom
    );

    // Runner
    this.fs.copy(
      this.templatePath('runner/src'),
      this.destinationPath('runner/src'));
    this.fs.copy(
      this.templatePath('runner/test-ng'),
      this.destinationPath('runner/test-ng')
    );
    this.fs.copy(
      this.templatePath('runner/tomcat/context-solr.xml'),
      this.destinationPath('runner/tomcat/context-solr.xml')
    );
    this.fs.copyTpl(
      this.templatePath('runner/tomcat/context-share.xml'),
      this.destinationPath('runner/tomcat/context-share.xml'),
      shareModule
    );
    this.fs.copyTpl(
      this.templatePath('runner/tomcat/context-repo.xml'),
      this.destinationPath('runner/tomcat/context-repo.xml'),
      repoModule
    );

    this.fs.copyTpl(
      this.templatePath('runner/pom.xml'),
      this.destinationPath('runner/pom.xml'),
      parent
    );

    // Share amp module
    // TODO extract this part to a share amp subgenerator
    this.fs.copyTpl(
      this.templatePath('share-amp/pom.xml'),
      this.destinationPath(sharePath + 'pom.xml'),
      sharePom);

    // tests
    this.fs.copyTpl(
      this.templatePath('share-amp/src/test/resources/testng.xml'),
      this.destinationPath(sharePath + 'src/test/resources/testng.xml'),
      pkg
    );
    this.fs.copyTpl(
      this.templatePath('share-amp/src/test/java/demoamp/DemoPageTestIT.java'),
      this.destinationPath(sharePath + 'src/test/java/' + this.props.package.replace(/\./ig, '/') + '/DemoPageTestIT.java'),
      pkg
    );
    this.fs.copyTpl(
      this.templatePath('share-amp/src/test/java/demoamp/po/DemoPage.java'),
      this.destinationPath(sharePath + 'src/test/java/' + this.props.package.replace(/\./ig, '/') + '/po/DemoPage.java'),
      pkg
    );

    // Main resources
    this.fs.copy(
      this.templatePath('share-amp/src/main/resources'),
      this.destinationPath(sharePath + 'src/main/resources')
    );
    this.fs.copy(
      this.templatePath('share-amp/src/main/amp/file-mapping.properties'),
      this.destinationPath(sharePath + 'src/main/amp/file-mapping.properties')
    );
    this.fs.copy(
      this.templatePath('share-amp/src/main/amp/module.properties'),
      this.destinationPath(sharePath + 'src/main/amp/module.properties')
    );

    // Spring context
    this.fs.copyTpl(
      this.templatePath('share-amp/src/main/amp/config/alfresco/web-extension/slingshot-application-context.xml'),
      this.destinationPath(sharePath + 'src/main/amp/config/alfresco/web-extension/' + shareAmp + '-slingshot-application-context.xml'),
      sharePkg
    );

    // Messages
    this.fs.copy(
      this.templatePath('share-amp/src/main/amp/config/alfresco/web-extension/messages/messages.properties'),
      this.destinationPath(sharePath + 'src/main/amp/config/alfresco/web-extension/messages/' + shareAmp + '.properties')
    );

    // Extensions
    this.fs.copyTpl(
      this.templatePath('share-amp/src/main/amp/config/alfresco/web-extension/site-data/extensions/example-widgets.xml'),
      this.destinationPath(sharePath + 'src/main/amp/config/alfresco/web-extension/site-data/extensions/' + shareAmp + '-example-widgets.xml'),
      sharePkg
    );

    // Site webscripts
    this.fs.copy(
      this.templatePath('share-amp/src/main/amp/config/alfresco/web-extension/site-webscripts/org'),
      this.destinationPath(sharePath + 'src/main/amp/config/alfresco/web-extension/site-webscripts/org')
    );

    // Composition with Webscript generator
    this.composeWith(
      'alfresco:webscript', {
        options: { // Full options.
          id: 'simple-page',
          shortname: 'Simple Page',
          description: 'Simple Page definition',
          family: 'Share',
          url: '/simple-page',
          method: 'get',
          format: 'html',
          authentication: 'user',
          path: sharePath + 'src/main/amp/config/alfresco/web-extension/site-webscripts' + this.props.package.replace(/\./ig, '/') + '/pages',
          container: false,
          nested: true
        },
        args: []
      }, {
        //local: '../webscript/index.js', // Local subgenerator...
        link: 'strong' // Must apply when scaffolding the main project
      }
    );
    this.fs.copy(
      this.templatePath('share-amp/src/main/amp/config/alfresco/web-extension/site-webscripts/com/example'),
      this.destinationPath(sharePath + 'src/main/amp/config/alfresco/web-extension/site-webscripts/' + this.props.package.replace(/\./ig, '/'))
    );

    // Web assets
    this.fs.copy(
      this.templatePath('share-amp/src/main/amp/web'),
      this.destinationPath(sharePath + 'src/main/amp/web')
    );

    // Repo amp module
    // TODO extract this part to a repo amp subgenerator
    this.fs.copyTpl(
      this.templatePath('repo-amp/pom.xml'),
      this.destinationPath(repoPath + 'pom.xml'),
      repoPom
    );

    // tests
    this.fs.copy(
      this.templatePath('repo-amp/src/test/properties'),
      this.destinationPath(repoPath + 'src/test/properties')
    );
    this.fs.copy(
      this.templatePath('repo-amp/src/test/resources'),
      this.destinationPath(repoPath + 'src/test/resources')
    );

    this.fs.copyTpl(
      this.templatePath('repo-amp/src/test/java/demoamp/test/DemoComponentTest.java'),
      this.destinationPath(repoPath + 'src/test/java/' + this.props.package.replace(/\./ig, '/') + 'demoamp/test/DemoComponentTest.java'),
      pkg
    );

    // Java
    this.fs.copyTpl(
      this.templatePath('repo-amp/src/main/java/demoamp/Demo.java'),
      this.destinationPath(repoPath + 'src/main/java/' + this.props.package.replace(/\./ig, '/') + '/demoamp/Demo.java'),
      pkg
    );
    this.fs.copyTpl(
      this.templatePath('repo-amp/src/main/java/demoamp/DemoComponent.java'),
      this.destinationPath(repoPath + 'src/main/java/' + this.props.package.replace(/\./ig, '/') + '/demoamp/DemoComponent.java'),
      pkg
    );
    this.fs.copyTpl(
      this.templatePath('repo-amp/src/main/java/demoamp/HelloWorldWebScript.java'),
      this.destinationPath(repoPath + 'src/main/java/' + this.props.package.replace(/\./ig, '/') + '/demoamp/HelloWorldWebScript.java'),
      pkg
    );

    // Main resources
    this.fs.copy(
      this.templatePath('repo-amp/src/main/amp/module.properties'),
      this.destinationPath(repoPath + 'src/main/amp/module.properties')
    );

    // Amp Module Config
    this.fs.copy(
      this.templatePath('repo-amp/src/main/amp/config/alfresco/module/repo-amp/alfresco-global.properties'),
      this.destinationPath(repoPath + 'src/main/amp/config/alfresco/module/' + repoAmp + '/alfresco-global.properties')
    );
    this.fs.copy(
      this.templatePath('repo-amp/src/main/amp/config/alfresco/module/repo-amp/model'),
      this.destinationPath(repoPath + 'src/main/amp/config/alfresco/module/' + repoAmp + '/model')
    );

    // Spring context
    this.fs.copyTpl(
      this.templatePath('repo-amp/src/main/amp/config/alfresco/module/repo-amp/module-context.xml'),
      this.destinationPath(repoPath + 'src/main/amp/config/alfresco/module/' + repoAmp + '/module-context.xml'),
      repoPkg
    );
    this.fs.copyTpl(
      this.templatePath('repo-amp/src/main/amp/config/alfresco/module/repo-amp/context/bootstrap-context.xml'),
      this.destinationPath(repoPath + 'src/main/amp/config/alfresco/module/' + repoAmp + '/context/bootstrap-context.xml'),
      repoPkg
    );
    this.fs.copyTpl(
      this.templatePath('repo-amp/src/main/amp/config/alfresco/module/repo-amp/context/service-context.xml'),
      this.destinationPath(repoPath + 'src/main/amp/config/alfresco/module/' + repoAmp + '/context/service-context.xml'),
      repoPkg
    );
    this.fs.copyTpl(
      this.templatePath('repo-amp/src/main/amp/config/alfresco/module/repo-amp/context/webscript-context.xml'),
      this.destinationPath(repoPath + 'src/main/amp/config/alfresco/module/' + repoAmp + '/context/webscript-context.xml'),
      repoPkg
    );

    // Repo webscripts
    this.fs.copy(
      this.templatePath('repo-amp/src/main/amp/config/alfresco/extension'),
      this.destinationPath(repoPath + 'src/main/amp/config/alfresco/extension')
    );

    // Web assets (\o/)
    this.fs.copy(
      this.templatePath('repo-amp/src/main/amp/web'),
      this.destinationPath(repoPath + 'src/main/amp/web')
    );

    // Glob project pom.xml
    this.fs.copyTpl(
      this.templatePath('pom.xml'),
      this.destinationPath('pom.xml'), {
        groupId: this.props.groupId,
        artifactId: this.props.artifactId,
        version: this.props.version,
        name: this.props.name,
        description: this.props.description
      }
    );
  },

  install: function () {
    this.log('You can either ' + chalk.bgBlack.white('mvn package') + ', ' + chalk.bgBlack.white('./run.sh') + ' or ' + chalk.bgBlack.white('.\\run.bat'));
  }
});
