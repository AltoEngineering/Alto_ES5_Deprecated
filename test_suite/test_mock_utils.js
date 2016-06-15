Alto.testUtils = Alto.Object.create({

    mockCreateSession: function(target) {
        target.createSession((Math.random() * (Math.random().toString(36).slice(2), 30)));
    },

    mockEndSession: function (target) {
        var expirationDate = new Date(),
            cookie;

        expirationDate.setDate(expirationDate.getDate() - 30000);

        cookie = Alto.Cookie.create({
            name: target.get('COOKIENAME'),
            value: '',
            domain: target.get('CookieDomain'),
            path: '/',
            expires: expirationDate,
            secure: false
        });
        cookie.write();
    }

});