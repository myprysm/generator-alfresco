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
var yeoman = require('yeoman-generator');

module.exports = yeoman.generators.Base.extend({
  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);

    this.option('nestable', {
      desc: 'Indicates whether the subgenerator is run manually or through a composition',
      alias: 'n',
      type: Boolean,
      default: false,
      hide: true
    });

    this.nested = this.options.nested || false;
  },

  _optionalPrompt: function (prompts, callback) {
    if (this.nested) {
      callback.call(this, this.options); // Apply directly options as the prompt to the callback.
    } else {
      this.prompt(prompts, callback); // If not nested, prompt as usual
    }
  }
});
