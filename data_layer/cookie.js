// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2014 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC
// ==========================================================================

/**
 Allows for easier handling of the document.cookie object. To create a cookie, simply call Alto.Cookie.create(). To
 retrieve a cookie, use Alto.Cookie.find. Cookies are not added to document.cookie, which Alto.Cookie.find uses, until
 you have called Alto.Cookie#write.

 @module Data
 @class Alto.Cookie
 @extends Alto.Object
 @since Alto 0.0.1
 @author Chad Eubanks
 */

Alto.Cookie = Alto.Object.extend({

    name: null,

    value: '',

    expries: null,

    path: null,

    domain: null,

    secure: '',

    isCookie: true,

    destroy: function () {
        this.set('expires', -1);
        this.write();

        this._super();
    },

    write: function () {
        var name = this.get('name'),
            value = this.get('value'),
            expires = this.get('expires'),
            path = this.get('path'),
            domain = this.get('domain'),
            secure = this.get('secure'),
            output = '',
            date;

        if (expires) {
            if (typeof expires === 'number') {
                date = new Date();
                date.setTime(date.getTime() + (expires * 24 * 60 * 60 * 1000));
            } else if (expires.toUTCString && expires.toUTCString.apply) {
                date = expires;
            }

            if (date) output = "; expires=" + date.toUTCString();
        }

        if (!Alto.none(path)) output += '; path=' + path;
        if (!Alto.none(domain)) output += '; domain=' + domain;
        if (secure === YES) output += '; secure';

        document.cookie = name + "=" + encodeURIComponent(value) + output;

        return this;
    }

});

Alto.Cookie.reopenClass ({

    /**
     Finds a cookie that has been stored

     @param {String} name The name of the cookie
     @returns Alto.Cookie object containing name and value of cookie
     */
    find: function (name) {
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie =String(cookies[i]).trim();
                if (cookie.substring(0, name.length + 1) === (name + "=")) {
                    return Alto.Cookie.create({
                        name: name,
                        value: decodeURIComponent(cookie.substring(name.length + 1))
                    });
                }
            }
        }
        return null;
    }

});