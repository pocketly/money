"use strict";
const fs = require('fs');
const numeral = require('numeral');
const _ = require('lodash');

class Money {
  constructor(locale) {
    this.locale(locale);
  }

  locale(locale) {
    // Load Locale Info
    this.locale = locale;
    this.loadLocale(locale);

    return this;
  }

  /**
   * Set the format of the string
   *
   * @see http://numeraljs.com/
   * @param format Should be a Numeral JS format in US style
   *
   * @returns {Money}
   */
  format(format) {
    this.formatString = format;

    return this;
  }

  /**
   *
   * @param value
   * @returns {*}
   */
  toString(value) {
    // If no format, lets load locale default
    if (!this.formatString) {
      this.format(this.localeInfo.format);
    }

    // Get Locale String
    let str = numeral(value).format(this.formatString);

    // Replace symbols with placeholders
    str = str.replace(/,/g, '{c}').replace(/\./g, '{d}');

    // lets replace all decimals
    str = str.replace(/\{d\}/g, this.localeInfo.decimal);

    // Lets replace all commas
    str = str.replace(/\{c}/g, this.localeInfo.comma);

    // Lets replace the symbol

    return str.replace('$', this.localeInfo.symbol);
  }

  loadLocale(locale) {
    let defaultLocale = Money.getLocale(Money.DEFAULT_LOCALE);
    let localeInfo = Money.getLocale(locale);
    if (!localeInfo) {
      localeInfo = defaultLocale;
    }

    this.localeInfo = _.defaults(localeInfo, defaultLocale);
  }

  static getLocale(locale) {
    if (_.isPlainObject(Money.LOCALES[locale])) {
      return Money.LOCALES[locale];
    }

    return null;
  }

  static localize(value, locale) {
    return new Money(locale).toString(value);
  }

  static setDefaultLocale(locale) {
    if (Money.LOCALES[locale]) {
      Money.DEFAULT_LOCALE = locale;
    }
  }

  static loadLocales(path) {
    Money.useLocales(require(path));
  }

  static useLocales(locales) {
    Money.LOCALES = locales;
  }

  static middleware(locale) {
    return function(req, res, next) {
      req.Money = new Money(locale);
      req.money = req.Money.toString;
      next();
    }
  }
}

Money.DEFAULT_LOCALE = 'en_US';
Money.loadLocales('./locales.json');
Money.setDefaultLocale('en_US');

module.exports = Money;