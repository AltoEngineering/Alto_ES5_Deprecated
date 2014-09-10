Alto.Request = Alto.Object.extend ({

    url: "",

    httpMethod: "",

    requestHeaders: {},

    data: "",

    send: function() {
        this._xhr.send(this.get('data'));
    },

    /*
        Do not override this method.
    */
    init: function() {
        this._super();
        this._open();
    },

    /**  Internal Use Only  **/

    _xhr: new XMLHttpRequest(),

    _open: function () {
        this._xhr.open(this.get('httpMethod'), this.get('url'));

        this._setRequestHeaders()
    },

    _setRequestHeaders: function () {
        var obj = this.get('requestHeaders');
        for (var key in obj) {
            this._xhr.setRequestHeader(key, obj[key]);
        }

        this.send();
    }

});