const Money = require('../lib/Money');

describe('Money', function() {
  "use strict";

  describe('should localize currencies', function() {
    it('should localize en_US', function() {
      Money.localize(10.99, 'en_US').should.equal('$10.99');
      Money.localize(1010.99, 'en_US').should.equal('$1,010.99');
    });

    it('should localize en_GB', function() {
      Money.localize(10.99, 'en_GB').should.equal('£10.99');
      Money.localize(1010.99, 'en_GB').should.equal('£1,010.99');
    });

    it('should localize fr_FR', function() {
      Money.localize(10.99, 'fr_FR').should.equal('10,99€');
      Money.localize(1010.99, 'fr_FR').should.equal('1.010,99€');
    });
  });
});