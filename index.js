var path = require('path');
var Handlebars = require('handlebars');

module.exports = function(source) {
  this.cacheable && this.cacheable();
  var done = this.async();
  var ast = Handlebars.parse(source);
  var options = {
    knownHelpers: {
      action: true,
      unbound: true,
      'bind-attr': true,
      template: true,
      view: true,
      _triageMustache: true
    },
    data: true,
    stringParams: true
  };
  var environment = new Compiler().compile(ast, options);
  var templateSpec = new JavaScriptCompiler().compile(environment, options, undefined, true);
  done(null, 'module.exports = Ember.Handlebars.template(' + templateSpec + '); module.exports.isMethod = false;');
}
module.exports.seperable = true;

// Below here is mostly copied from ember's ember-handlebars-compiler

// Eliminate dependency on any Ember to simplify precompilation workflow
var objectCreate = Object.create || function(parent) {
  function F() {}
  F.prototype = parent;
  return new F();
};

/**
  Override the the opcode compiler and JavaScript compiler for Handlebars.

  @class Compiler
  @namespace Ember.Handlebars
  @private
  @constructor
*/
var Compiler = function() {};
Compiler.prototype = objectCreate(Handlebars.Compiler.prototype);
Compiler.prototype.compiler = Compiler;

/**
  @class JavaScriptCompiler
  @namespace Ember.Handlebars
  @private
  @constructor
*/
var JavaScriptCompiler = function() {};
JavaScriptCompiler.prototype = objectCreate(Handlebars.JavaScriptCompiler.prototype);
JavaScriptCompiler.prototype.compiler = JavaScriptCompiler;
JavaScriptCompiler.prototype.namespace = 'Ember.Handlebars';
JavaScriptCompiler.prototype.initializeBuffer = function() {
  return "''";
};
JavaScriptCompiler.prototype.appendToBuffer = function(string) {
  return "data.buffer.push("+string+");";
};

// Hacks ahead:
// Handlebars presently has a bug where the `blockHelperMissing` hook
// doesn't get passed the name of the missing helper name, but rather
// gets passed the value of that missing helper evaluated on the current
// context, which is most likely `undefined` and totally useless.
//
// So we alter the compiled template function to pass the name of the helper
// instead, as expected.
//
// This can go away once the following is closed:
// https://github.com/wycats/handlebars.js/issues/634

var DOT_LOOKUP_REGEX = /helpers\.(.*?)\)/,
    BRACKET_STRING_LOOKUP_REGEX = /helpers\['(.*?)'/,
    INVOCATION_SPLITTING_REGEX = /(.*blockHelperMissing\.call\(.*)(stack[0-9]+)(,.*)/;

JavaScriptCompiler.stringifyLastBlockHelperMissingInvocation = function(source) {
  var helperInvocation = source[source.length - 1],
      helperName = (DOT_LOOKUP_REGEX.exec(helperInvocation) || BRACKET_STRING_LOOKUP_REGEX.exec(helperInvocation))[1],
      matches = INVOCATION_SPLITTING_REGEX.exec(helperInvocation);

  source[source.length - 1] = matches[1] + "'" + helperName + "'" + matches[3];
}
var stringifyBlockHelperMissing = JavaScriptCompiler.stringifyLastBlockHelperMissingInvocation;

var originalBlockValue = JavaScriptCompiler.prototype.blockValue;
JavaScriptCompiler.prototype.blockValue = function() {
  originalBlockValue.apply(this, arguments);
  stringifyBlockHelperMissing(this.source);
};

var originalAmbiguousBlockValue = JavaScriptCompiler.prototype.ambiguousBlockValue;
JavaScriptCompiler.prototype.ambiguousBlockValue = function() {
  originalAmbiguousBlockValue.apply(this, arguments);
  stringifyBlockHelperMissing(this.source);
};

var prefix = "ember" + (+new Date()), incr = 1;

/**
  Rewrite simple mustaches from `{{foo}}` to `{{bind "foo"}}`. This means that
  all simple mustaches in Ember's Handlebars will also set up an observer to
  keep the DOM up to date when the underlying property changes.

  @private
  @method mustache
  @for Ember.Compiler
  @param mustache
*/
Compiler.prototype.mustache = function(mustache) {
  if (mustache.isHelper && mustache.id.string === 'control') {
    mustache.hash = mustache.hash || new Handlebars.AST.HashNode([]);
    mustache.hash.pairs.push(["controlID", new Handlebars.AST.StringNode(prefix + incr++)]);
  } else if (mustache.params.length || mustache.hash) {
    // no changes required
  } else {
    var id = new Handlebars.AST.IdNode([{ part: '_triageMustache' }]);

    // Update the mustache node to include a hash value indicating whether the original node
    // was escaped. This will allow us to properly escape values when the underlying value
    // changes and we need to re-render the value.
    if (!mustache.escaped) {
      mustache.hash = mustache.hash || new Handlebars.AST.HashNode([]);
      mustache.hash.pairs.push(["unescaped", new Handlebars.AST.StringNode("true")]);
    }
    mustache = new Handlebars.AST.MustacheNode([id].concat([mustache.id]), mustache.hash, !mustache.escaped);
  }

  return Handlebars.Compiler.prototype.mustache.call(this, mustache);
};
