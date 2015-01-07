var precompile = require('./ember-template-compiler').precompile;

module.exports = function(source) {
  this.cacheable && this.cacheable();
  var done = this.async();
  var templateSpec = precompile(source, false);
  done(
    null,
    'module.exports = Ember.Handlebars.template(' + templateSpec + ');'
  );
}
module.exports.seperable = true;
