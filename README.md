# jQuery Currency

Quick and dirty currency formatter that ties into the currency format features in Laravel Currency.

## Default Format 

Overriding the default currency format:

```javascript
$.setCurrencyOptions({
    defaultFormat: '1.0,00 €'
});
```

## Formatting

```
$.formatCurrency(:value, :format, :onlyNumbers)
```

**Arguments**

 - `:value` - the float amount to convert
 - `:format` - the currency format (if empty the default value will be used)
 - `:onlyNumbers` - when _true_ it will return formatted value without the currency symbol

## Data-API

For real-time formatting of during a blur event trigger, use the `data-format-currency` attribute.

Format the input using the default currency format:

```html
<input type="text" name="price" placeholder="0.00" data-format-currency>
```

Override the default currency format:

```html
<input type="text" name="price" placeholder="0.00" data-format-currency="₱1,0.00">
```