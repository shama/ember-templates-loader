var should = require('should');

describe('basic', function() {
  it('should compile hbs', function() {
    var hbs = require('raw!../!./fixtures/basic.hbs');
    hbs.should.be.eql('module.exports = Ember.Handlebars.compile("hi");');
  });
});