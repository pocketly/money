"use strict";
const fs = require('fs');
const numeral = require('numeral');
const _ = require('lodash');

class Money {
  constructor(locale) {
    this.locale(locale);
  }

  /**
   * Set the Locale for this instance
   *
   * @param {String} locale - the locale to set
   *
   * @returns {Money}
   */
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

  /**
   * Parse a currency value as a decimal.
   *
   * @param {string} value
   * @return {Number}
   */
  parse(value) {
    let decimal = this.localeInfo.decimal.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // make decimal regex-safe
    let re = new RegExp(decimal + '\\d*');
    let dollars;
    let cents = value.match(re);

    if (cents) {
      cents = cents[0];
      re = new RegExp('.*(?=' + decimal + ')');
      dollars = value.match(re);
      dollars = dollars ? dollars[0] : 0;
    } else {
      cents = 0;
      dollars = value;
    }

    dollars = dollars ? parseInt(dollars.replace(/\D/g, '')) : 0;
    dollars = dollars ? dollars : 0;

    cents = cents ? parseInt(cents.replace(/\D/g, '')) / 100 : 0;
    cents = cents ? cents : 0;

    return parseFloat(dollars + cents);
  }

  /**
   * Load the locale information or fall back to default if
   * it doesn't exist.
   *
   * @param locale
   */
  loadLocale(locale) {
    let defaultLocale = Money.getLocale(Money.DEFAULT_LOCALE);
    let localeInfo = Money.getLocale(locale);
    if (!localeInfo) {
      localeInfo = defaultLocale;
    }

    this.localeInfo = _.defaults(localeInfo, defaultLocale);
  }

  /**
   * Get the locale from Loaded Locales
   *
   * @param {String} locale
   * @returns {*}
   */
  static getLocale(locale) {
    if (_.isPlainObject(Money.LOCALES[locale])) {
      return Money.LOCALES[locale];
    } else if (_.isPlainObject(Money.CURRENCIES[locale])) {
      return Money.CURRENCIES[locale];
    }

    return null;
  }

  /**
   * Localize the currency
   *
   * @param {String|Number} value - The currency value
   * @param {String} locale - The Locale
   *
   * @returns {String}
   */
  static localize(value, locale) {
    return new Money(locale).toString(value);
  }

  /**
   * Set Default Locale to use
   *
   * @param {String} locale - the locale
   */
  static setDefaultLocale(locale) {
    if (Money.LOCALES[locale]) {
      Money.DEFAULT_LOCALE = locale;
    }
  }

  /**
   * Load locales from a path
   *
   * @param {String} path - The Path to JSON file
   */
  static loadLocales(path) {
    Money.useLocales(require(path));
  }

  /**
   * Use these Locales
   *
   * @param {Object} locales - the JSON Object of Locales
   */
  static useLocales(locales) {
    Money.LOCALES = locales;
  }

  /**
   * Load Currencies from a path
   *
   * @param {String} path - The Path to JSON file
   */
  static loadCurrencies(path) {
    Money.useCurrencies(require(path));
  }

  /**
   * Use these Locales
   *
   * @param {Object} locales - the JSON Object of Locales
   */
  static useCurrencies(locales) {
    Money.CURRENCIES = locales;
  }

  /**
   * Set locale for current request and
   * add convenience function
   *
   * @param req
   * @param locale
   */
  static setLocale(req, locale) {
    req.Money = new Money(locale);
    req.money = req.Money.toString;
  }
}

Money.DEFAULT_LOCALE = 'en_US';
Money.DEFAULT_CURRENCY = 'USD';
Money.loadLocales('./locales.json');
Money.loadCurrencies('./currencies.json');
Money.setDefaultLocale('en_US');

module.exports = Money;