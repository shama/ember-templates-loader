var precompile = require('./ember-template-compiler').precompile;
module.exports = function(source) {
  this.cacheable && this.cacheable();
  return 'module.exports = Ember.HTMLBars.template(' + precompile(source) + ');';
}
module.exports.seperable = true;
