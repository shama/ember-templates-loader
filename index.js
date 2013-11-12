var path = require('path');
//var loaderUtils = require('loader-utils');

module.exports = function(source) {
  this.cacheable && this.cacheable();
  var done = this.async();
  // TODO: Add precompile option
  var output = 'module.exports = Ember.Handlebars.compile(' + JSON.stringify(source) + ');';
  done(null, output);
}
module.exports.seperable = true;
