'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the solid ' + chalk.red('generator-alfresco') + ' generator!'
    ));

    var prompts = [{
      type: 'input',
      name: 'name',
      message: 'Name of the project',
      default: _.camelCase(__dirname)
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
      message: 'Enter the artifactId',
      default: function (answers) {
        return answers.groupId + '.' + _.camelCase(answers.name);
      },
      validate: function (input) {
        return (input.match(/[a-zA-Z\.]+/g) || []).length > 0;
      }
    }, {
      type: 'input',
      name: 'version',
      message: 'Version number',
      default: '1.0-SNAPSHOT'
      //}, {
      //  type: 'checkbox',
      //  name: 'supportedLanguages',
      //  message: 'Supported Languages',
      //  choices: {
      //    'English': 'en',
      //    'French': 'fr'
      //  },
      //  default: 'English'
    }];

    this.prompt(prompts, function (props) {
      this.props = props;
      this.appname = props.name;
      done();
    }.bind(this));
  },
  configuring: function () {
    this.config.save(this.props);
  },

  writing: function () {
    this.fs.copy(
      this.templatePath('dummyfile.txt'),
      this.destinationPath('dummyfile.txt')
    );

    this.fs.copy(
      this.templatePath('.gitignore'),
      this.destinationPath('.gitignore')
    );

    // SolR 4 Config
    this.fs.copyTpl(
      this.templatePath('solr-config/pom.xml'),
      this.destinationPath('solr-config/pom.xml'), {
        groupId: this.props.groupId,
        artifactId: this.props.artifactId,
        version: this.props.version
      }
    );


    // Share config
    this.fs.copy(
      this.templatePath('share/src'),
      this.destinationPath('share/src')
    );

    this.fs.copyTpl(
      this.templatePath('share/pom.xml'),
      this.destinationPath('share/pom.xml'), {
        groupId: this.props.groupId,
        artifactId: this.props.artifactId,
        version: this.props.version
      }
    );

    // Alfresco config
    this.fs.copy(
      this.templatePath('repo/src'),
      this.destinationPath('repo/src')
    );

    this.fs.copyTpl(
      this.templatePath('repo/pom.xml'),
      this.destinationPath('repo/pom.xml'), {
        groupId: this.props.groupId,
        artifactId: this.props.artifactId,
        version: this.props.version
      }
    );

    // Runner
    this.fs.copy(
      this.templatePath('runner/src'),
      this.destinationPath('runner/src')
    );
    this.fs.copy(
      this.templatePath('runner/test-ng'),
      this.destinationPath('runner/test-ng')
    );
    this.fs.copy(
      this.templatePath('runner/tomcat'),
      this.destinationPath('runner/tomcat')
    );


    this.fs.copyTpl(
      this.templatePath('runner/pom.xml'),
      this.destinationPath('runner/pom.xml'), {
        groupId: this.props.groupId,
        artifactId: this.props.artifactId,
        version: this.props.version
      }
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
    this.spawnCommand('mvn', ['dependency:resolve']);
  }
});
