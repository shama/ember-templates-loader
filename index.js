var precompile = require('ember/ember-template-compiler').precompile;
module.exports = function(source) {
  this.cacheable && this.cacheable();
  return 'module.exports = ' + precompile(source) + ';';
}
module.exports.seperable = true;
