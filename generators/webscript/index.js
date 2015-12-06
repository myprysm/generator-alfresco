'use strict';

var yeoman = require('yeoman-generator');
//var chalk = require('chalk');
//var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async();

    var prompts = [{
      type: 'input',
      name: 'id',
      message: 'ID or name of the webscript'
    }, {
      type: 'input',
      name: 'shortname',
      message: 'Shortname of the webscript (if different of ID)',
      default: function (inputs) {
        return inputs.id;
      }
    }, {
      type: 'input',
      name: 'description',
      message: 'Description of the webscript'
    }, {
      type: 'input',
      name: 'family',
      message: 'Family of the webscript'
    }, {
      type: 'input',
      name: 'url',
      message: 'URL of the webscript',
      default: this.appname
    }, {
      type: 'list',
      name: 'method',
      message: 'HTTP Method applied for the webscript',
      choices: ['GET', 'POST', 'PUT', 'DELETE'],
      default: 'GET',
      filter: function (input) {
        return input.toLowerCase();
      }
    }, {
      type: 'list',
      name: 'format',
      message: 'Default format used for response rendering',
      choices: ['JSON', 'HTML', 'XML', 'Atom'],
      default: 'JSON',
      filter: function (input) {
        return input.toLowerCase();
      }
    }, {
      type: 'list',
      name: 'authentication',
      message: 'Authentication type for the webscript',
      choices: ['none', 'guest', 'user', 'admin'],
      default: 'user'
    }];

    this.prompt(prompts, function (props) {
      props.format = props.format.toLowerCase();
      props.method = props.method.toLowerCase();
      this.props = props;
      done();
    }.bind(this));
  },
  writing: function () {
    var baseScript = this.props.id + '.' + this.props.method + '.';
    this.fs.copyTpl(
      this.templatePath('webscript.method.desc.xml'),
      this.destinationPath(baseScript + 'desc.xml'), {
        shortname: this.props.shortname,
        description: this.props.description,
        family: this.props.family,
        url: this.props.url,
        authentication: this.props.authentication,
        format: this.props.format
      }
    );

    this.fs.copy(
      this.templatePath('webscript.method.format.ftl'),
      this.destinationPath(baseScript + this.props.format + '.ftl')
    );
    this.fs.copy(
      this.templatePath('webscript.method.js.tpl'),
      this.destinationPath(baseScript + 'js')
    );
  }
});
