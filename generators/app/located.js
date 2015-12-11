/*
 * ----------------------------------------------------------------------------
 * "THE BEER-WARE LICENSE" (Revision 42):
 * <damien [dot] benon [at] myprysm [dot] fr> wrote this file on 11/12/2015.
 * As long as you retain this notice you can do whatever you want
 * with this stuff. If we meet some day, and you think this stuff is worth it,
 * you can buy me a beer in return.
 * Damien Benon
 * ----------------------------------------------------------------------------
 */

var Nestable = require('./nestable');
var path = require('path');

module.exports = Nestable.extend({
  constructor: function () {
    Nestable.apply(this, arguments);

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
  }
});
