'use strict';

var Located = require('../app/located');

module.exports = Located.extend({
  constructor: function () {
    Located.apply(this, arguments);

    this.option('id', {
      desc: 'ID or name of the webscript',
      alias: 'i',
      type: String,
      defaults: ''
    });

    this.option('shortname', {
      desc: 'Shortname of the webscript (if different of ID)',
      alias: 's',
      type: String,
      defaults: ''
    });

    this.option('description', {
      desc: 'Description of the webscript',
      alias: 'd',
      type: String,
      defaults: ''
    });

    this.option('family', {
      desc: 'Family of the webscript',
      alias: 'f',
      type: String,
      defaults: ''
    });

    this.option('url', {
      desc: 'URL of the webscript',
      alias: 'u',
      type: String,
      defaults: ''
    });

    this.option('method', {
      desc: 'HTTP Method applied for the webscript (get, post, put, delete)',
      alias: 'm',
      type: String,
      defaults: 'get'
    });

    this.option('format', {
      desc: 'Default format used for response rendering (json, html, xml, atom)',
      alias: 'o',
      type: String,
      defaults: 'json'
    });

    this.option('authentication', {
      desc: 'Authentication type for the webscript',
      alias: 'a',
      type: String,
      defaults: 'user'
    });

  },
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

    this._optionalPrompt(prompts, function (props) {
      this.log('Got:');
      Object.keys(props).forEach(function (opt) {
        this.log('- ' + opt + ': ' + props[opt]);
      }, this);

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
