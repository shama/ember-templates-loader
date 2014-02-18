var should = require('should');

describe('basic', function() {
  it('should compile hbs', function() {
    var hbs = require('raw!../!./fixtures/basic.hbs');
    hbs.should.containEql('Ember.Handlebars.template');
    hbs.should.containEql('data.buffer.push("hi");');
  });
});