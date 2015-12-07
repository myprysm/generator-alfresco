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
      message: 'URL of the webscript'
    }, {
      type: 'list',
      name: 'method',
      message: 'HTTP Method applied for the webscript',
      choices: [
        {value: 'get', name: 'GET'},
        {value: 'post', name: 'POST'},
        {value: 'put', name: 'PUT'},
        {value: 'delete', name: 'DELETE'}
      ],
      default: 0
    }, {
      type: 'list',
      name: 'format',
      message: 'Default format used for response rendering',
      choices: [
        {value: 'json', name: 'JSON'},
        {value: 'html', name: 'HTML'},
        {value: 'xml', name: 'XML'},
        {value: 'atom', name: 'Atom'}
      ],
      default: 0
    }, {
      type: 'list',
      name: 'authentication',
      message: 'Authentication type for the webscript',
      choices: ['none', 'guest', 'user', 'admin'],
      default: 2
    }];

    this.prompt(prompts, function (props) {
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
      this.templatePath('webscript.method.js'),
      this.destinationPath(baseScript + 'js')
    );
  }
});
