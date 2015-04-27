// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2014 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC
// ==========================================================================

/**
 Alto.Request talks to the HTTP(s) protocol.

 @module Data
 @class Alto.Request
 @extends Alto.Object
 @since Alto 0.0.1
 @author Chad Eubanks
 */

Alto.Request = Alto.Object.extend({

    url: "",

    httpMethod: "",

    requestHeaders: {},

    data: "",

    xhr: new XMLHttpRequest(),

    success: null,

    error: null,

    /**
     @method send
     */
    send: function () {
        this.xhr.send(this.get('data'));
    },

    /*
     Do not override this method.
     */
    init: function () {
        this._open();
        this._super();
    },

    /**  Internal Use Only  **/

    _open: function () {
        this.xhr.open(this.get('httpMethod'), this.get('url'));

        this._setRequestHeaders();
        this._setHandler();
    },

    _setRequestHeaders: function () {
        var obj = this.get('requestHeaders');
        for (var key in obj) {
            this.xhr.setRequestHeader(key, obj[key]);
        }

        this.send();
    },

    _setHandler: function () {
        var self = this;
        this.xhr.onreadystatechange = function(){self._handler(self);}
    },

    _handler: function () {
        if (this.xhr.readyState == 4) {
            if (this.xhr.status === 200 || this.xhr.status === 204) {
                this.success();
            } else {
                this.error();
            }
        }
    }

});