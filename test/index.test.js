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

    it('should parse float from en_US', function() {
      let money = new Money('en_US');
      money.parse('$1,234').should.equal(1234);
      money.parse('$1,234.01').should.equal(1234.01);
      money.parse('$12.50').should.equal(12.5);
      money.parse('$12').should.equal(12);
      money.parse('$.50').should.equal(.50);
      money.parse('$0.05').should.equal(.05);
    });

    it('should parse float from en_GB', function() {
      let money = new Money('en_GB');
      money.parse('£1,234').should.equal(1234);
      money.parse('£1,234.01').should.equal(1234.01);
      money.parse('£12.50').should.equal(12.5);
      money.parse('£12').should.equal(12);
      money.parse('£.50').should.equal(.50);
      money.parse('£0.05').should.equal(.05);
    });

    it('should parse float from fr_FR', function() {
      let money = new Money('fr_FR');
      money.parse('1.234€').should.equal(1234);
      money.parse('1.234,01€').should.equal(1234.01);
      money.parse('12,50€').should.equal(12.5);
      money.parse('12€').should.equal(12);
      money.parse(',50€').should.equal(.50);
      money.parse('0,05€').should.equal(.05);
    });
  });
});