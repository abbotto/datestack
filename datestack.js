/**
 * Datestack
 * Author: Jared Abbott
 * URL: https://github.com/o0110o/dateStack-js/
 * Copyright 2016 Jared Abbott
 * Distributed under the MIT license
 */

// Universal Module Definition (UMD)
(function(name, context, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        context[name] = factory();
    }
    // Pass this if window is not defined yet
})('DATESTACK', typeof window !== "undefined" ? window : this, function() {

    /*jslint bitwise: true */
    // Strict Mode
    'use strict';

    // DEFINE WINDOW.META
    var _dateStack = window.dateStack,
        _$DATE;

    // Only set the $DATE global if it is not being used by another library
    if (typeof window.$DATE === 'undefined') {
        window.$DATE = _$DATE = _dateStack;
    }

    var convertDate = function(date, settings){
        
        var months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var shortWeekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        var _pad = function(str, pad, width) {
            // Fallbacks
            pad = pad || '0';
            str = str + '';
            // Add the padding
            while (str.length < width) {
                str = pad + str;
            }
            return str;
        };
        
        var defaultSettings = {
            period: false,
            local: false,
        }
        
        var period = (!!settings) ? settings.period : defaultSettings.period;
        var local = (!!settings) ? settings.local : defaultSettings.local;
        var utc = 'UTC';

        // Is local time required?
        if (local === true) {
            utc = '';
        }

        var date = (!!date) ? new Date(date) : new Date();

        // Used in date object
        var epoch = date.getTime();
        var getDay = date['get' + utc + 'Day']();
        var getMS = date['get' + utc + 'Milliseconds']();
        var getDate = date['get' + utc + 'Date']();
        var getMonth = date['get' + utc + 'Month']();
        var getFullYear = date['get' + utc + 'FullYear']();
        var getHours = date['get' + utc + 'Hours']();
        var getMinutes = date['get' + utc + 'Minutes']();
        var getSeconds = date['get' + utc + 'Seconds']();
        var offset = -(date.getTimezoneOffset() / 60) || -(new Date().getTimezoneOffset() / 60);

        // Date object
        var obj = {
            'D': getDate,
            'DD': _pad(getDate, '0', 2),
            'M': getMonth + 1,
            'MM': _pad(getMonth + 1, '0', 2),
            'MMM': shortMonths[getMonth],
            'MMMM': months[getMonth],
            'YYYY': getFullYear,
            'd': (getDay + 1),
            'dd': _pad((getDay + 1), '0', 2),
            'ddd': shortWeekdays[getDay],
            'dddd': weekdays[getDay],
            'h': getHours,
            'hh': _pad(getHours, '0', 2),
            'm': getMinutes,
            'mm': _pad(getMinutes, '0', 2),
            's': getSeconds,
            'ss': _pad(getSeconds, '0', 2),
            'ms': getMS,
            'offset': offset,
            'epoch': epoch
        };

        // Divide the day
        if (period === true) {
            // AM/PM
            if (obj.h > 11 && obj.h < 24) {
                obj.PP = 'PM';
                obj.pp = 'pm';
            }
            else if (obj.h > -1 && obj.h < 12) {
                obj.PP = 'AM';
                obj.pp = 'am';
            }

            // NOON/MIDNIGHT
            if (obj.h === 12 && obj.m === 0) {
                obj.PP = 'NN';
                obj.pp = 'nn';
            }
            else if (obj.h === 0 && obj.m === 0) {
                obj.PP = 'MI';
                obj.pp = 'mi';
            }

            // 12-hour clock
            obj.hh = obj.h;
            var diff = obj.h - 12;

            if (obj.h > 12) {
                obj.h = obj.hh = diff;
            }
            else if (obj.h < 10) {
                if (obj.h === 0) {
                    obj.h = 12;
                    obj.hh = 12;
                }
                else {
                    obj.hh = _pad(obj.h, '0', 2);
                }
            }
        }
        return obj;
    }

    // HERE WE GO!
    dateStack = (function() {

        // Define a local copy of dateStack
        var dateStack = function(date, settings) {
            // Initiate dateStack
            new dateStack.fn.init(date, settings);

            // Return the chainable methods
            return dateStack.fn.output;
        };

        // Build the dateStack object
        dateStack.fn = dateStack.prototype = {
            version: 'pre-1.0.0',
            constructor: dateStack,
            output: {},
            init: function(date, settings) {
                dateStack.fn.output = convertDate(date, settings);
            }
        };

        // Pass 'init' the dateStack prototype for later instantiation
        dateStack.fn.init.prototype = dateStack.fn;

        // Return the dateStack object and set window.$DATE only if it is undefined
        return (_$DATE === window.$DATE) ? (window.dateStack = window.$DATE = dateStack) : (window.dateStack = dateStack);
    })();
});
