# Money
Money is a Currency Localizer

## Use
```js
// First Require Money
let Money = require('@whym/money');

// To do a simple Localization just call `localize`
let str = Money.localize(10.99, 'fr_FR'); // 10,99€

// You can set the Default Locale with
Money.setDefaultLocale('en_US');

// Now if you call `localize` it will fallback to default
let str = Money.localize(10.99); // $10.99

// Want a different format? Uses http://numeraljs.com/
let money = (new Money('en_US')).format('$0,0[.]00');
let str = money.toString(10.00); // $10
```

### Middleware
To make things easier in requests there is a middle

```js
app.use(function(req, res, next) {
    Money.setLocale(req, 'en_GB');
});;

// From there you can just do:
let str = req.money(10.99); // £10.99
```

### Don't like our Locales?
```js
// Set locales to JSON object at this path
Money.loadLocales(path);

// Set Locales to JSON object
Money.useLocales(locales);
```