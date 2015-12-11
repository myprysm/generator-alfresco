'use strict';
var Located = require('../app/located');
var yosay = require('yosay');
var _ = require('lodash');
var path = require('path');

module.exports = Located.extend({
  // note: arguments and options should be defined in the constructor.
  constructor: function () {
    Located.apply(this, arguments);
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

    this._optionalPrompt(prompts, function (props) {
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
  }
});
