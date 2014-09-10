/*
    Example: Alto.Animate.create().fadeOut(TCB.RootViewContainer.get('rootView'), 1000, function(){});
*/

Alto.Animate = Alto.Object.extend ({

    fadeOut: function(elem, interval, callback) {
        elem.className += ' fade-out'

        // Make sure the callback is a function
        if (Alto.typeOf(callback) == 'function') {
            Alto.run.later(this, function() {
                callback();
            }, interval);
        } else {

        } // todo: need to handle a non function callback
    },

    fadeIn: function(elem, interval,  callback) {
        elem.className += ' fade-in'

        // Make sure the callback is a function
        if (Alto.typeOf(callback) == 'function') {
            run.later(this, function() {
                callback();
            }, interval);
        } else {

        } // todo: need to handle a non function callback
    }

});