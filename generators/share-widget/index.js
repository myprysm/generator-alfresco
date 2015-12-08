'use strict';
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var _ = require('lodash');
var path = require('path');

module.exports = yeoman.generators.Base.extend({
  // note: arguments and options should be defined in the constructor.
  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);

    // This method adds support for a `--coffee` flag
    this.option('path', {
      desc: 'Path to create the widget',
      alias: 'p',
      type: String,
      defaults: ''
    });

    this.option('container', {
      desc: 'If set, will create the widget in a folder named upon widgetName',
      alias: 'c',
      type: Boolean,
      defaults: false
    });

    this.options.path = path.normalize(this.options.path);
  },
  prompting: function () {
    var done = this.async();

    this.log(yosay(
      'Create a new Aikau widget !'
    ));

    var prompts = [{
      type: 'input',
      name: 'widgetName',
      message: 'Name of your widget?',
      default: 'TemplateWidget'
    }];

    this.prompt(prompts, function (props) {
      this.props = props;
      done();
    }.bind(this));
  },
  writing: function () {
    var kName = _.kebabCase(this.props.widgetName);
    var cName = _.capitalize(_.camelCase(this.props.widgetName));
    var basePath = this.options.path.length > 0 ? this.options.path + '/' : '';
    basePath = this.options.container ? basePath + cName + '/' : basePath;

    this.log('Using ' + kName + ' as class name and ' + cName + ' as widget name');

    this.fs.copyTpl(
      this.templatePath('TemplateWidget.js'),
      this.destinationPath(basePath + cName + '.js'),
      {widgetName: cName}
    );

    this.fs.copyTpl(
      this.templatePath('css/TemplateWidget.css'),
      this.destinationPath(basePath + 'css/' + cName + '.css'),
      {widgetName: kName}
    );

    this.fs.copyTpl(
      this.templatePath('templates/TemplateWidget.html'),
      this.destinationPath(basePath + 'templates/' + cName + '.html'),
      {widgetName: kName}
    );

    this.fs.copy(
      this.templatePath('i18n/TemplateWidget.properties'),
      this.destinationPath(basePath + 'i18n/' + cName + '.properties')
    );
  },

  install: function () {

  }
});
