var should = require('should');

describe('basic', function() {
  it('should compile hbs', function() {
    var hbs = require('raw!../!./fixtures/basic.hbs');
    hbs.should.containEql('module.exports = ');
    hbs.should.containEql('dom.createTextNode("hi");');
  });
});
