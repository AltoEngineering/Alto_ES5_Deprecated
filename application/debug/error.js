// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Author: Chad Eubanks
// Copyright: @2014 The Code Boutique, LLC
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

Alto.console = Alto.Object.create ({

    warnColor: '#FFA500',

    errorColor: '#ff0000',

    messageColor: '#0099FF',

    log: function (msg, color) {
        console.log("%c" + msg, "color:" + color + ";");
    }

});