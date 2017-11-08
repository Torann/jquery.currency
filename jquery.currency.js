/* ========================================================================
 * jQuery Currency Formatter
 * ========================================================================
 * Copyright 2017 Daniel Stainback
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */

;(function ($) {

    var globalOptions = {
        defaultFormat: '$1,0.00',
        onlyNumbers: false
    };

    function strrchr(haystack, needle) {
        var pos = 0;

        if (typeof needle !== 'string') {
            needle = String.fromCharCode(parseInt(needle, 10))
        }

        needle = needle.charAt(0);
        pos = haystack.lastIndexOf(needle);

        if (pos === -1) {
            return false
        }

        return haystack.substr(pos)
    }

    function number_format(number, decimals, decPoint, thousandsSep) {
        number = (number + '').replace(/[^0-9+\-Ee.]/g, '');

        var n = !isFinite(+number) ? 0 : +number,
            prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
            sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep,
            dec = (typeof decPoint === 'undefined') ? '.' : decPoint,
            s = '';

        var toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return '' + (Math.round(n * k) / k)
                    .toFixed(prec)
        };

        s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');

        if (s[0].length > 3) {
            s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
        }

        if ((s[1] || '').length < prec) {
            s[1] = s[1] || '';
            s[1] += new Array(prec - s[1].length + 1).join('0');
        }

        return s.join(dec)
    }

    // CLASS DEFINITION
    // ================

    $.formatCurrency = function(value, format, onlyNumbers) {
        var thousand = '',
            negative = '';

        // Get options
        format = format || globalOptions.defaultFormat;
        onlyNumbers = typeof(onlyNumbers) !== 'undefined' ? onlyNumbers : globalOptions.onlyNumbers;

        // Match decimal and thousand separators
        var separators = format.match(/[\s\',.!]/g);

        // Get the thousand
        if (typeof separators[0] !== 'undefined' && separators[0] !== '!') {
            thousand = separators[0];
        }

        // Get the decimal
        var decimal = separators[1] || '';

        // Match format for decimals count
        var valFormat = format.match(/([0-9].*|)[0-9]/);
        valFormat = valFormat[0] || 0;

        // Count decimals length
        var decimals = decimal ? strrchr(valFormat, decimal).substr(1).length : 0;

        // Do we have a negative value?
        if (value < 0 ? '-' : '') {
            value = value * -1;
            negative = '-';
        }

        // Format the value
        value = number_format(value, decimals, decimal, thousand);

        // Apply the formatted measurement
        value = negative + format.replace(/([0-9].*|)[0-9]/g, value);

        // Only numbers
        if (onlyNumbers === true) {
            value = value.replace(/[^0-9\s\.,-]/g, '');
        }

        return value;
    };

    $.setCurrencyOptions = function(options) {
        globalOptions = $.extend({}, globalOptions, options);
    };


    // PLUGIN DEFINITION
    // =================

    var Plugin = function (element) {
        // Prevent duplicates
        if (element.getAttribute('data-currency-formatting')) return;

        var $element = $(element),
            format = $element.data('currency-formatting');

        element.setAttribute('data-currency-formatting', true);

        $element.on('blur.currency', function (ev) {
            this.value = $.formatCurrency(this.value, format, true);
        });

        return $element;
    };

    // DATA-API
    // ========

    $(document).on('touchstart click', '[data-format-currency]', function (ev) {
        if (!ev.target.getAttribute('data-currency-formatting')) {
            Plugin(ev.target);
        }
    });

})(jQuery);