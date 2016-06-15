Alto.animate = Alto.Object.create({

    // general animations
    move: function (element, x, y, duration, timing) {
        if (Alto.isNone(element)) {
            Alto.Logger.error('Animation moveIn requires an html element to animate. moveIn(element, x, y, duration, timing');
        } else if (Alto.isNone(x)) {
            Alto.Logger.error('Animation moveIn requires x cordinate. moveIn(element, x, y, duration, timing');
        } else if (Alto.isNone(y)) {
            Alto.Logger.error('Animation moveIn requires y cordinate. moveIn(element, x, y, duration, timing');
        } else if (Alto.isNone(duration)) {
            Alto.Logger.error('Animation moveIn requires duration. moveIn(element, x, y, duration, timing');
        } else if (Alto.isNone(timing)) {
            timing = 'ease-in-out';
        }

        element.style.transform = 'translate(%@, %@)'.fmt(x, y);
        element.style.mozTransform = 'translate(%@, %@)'.fmt(x, y);
        element.style.webkitTransform = 'translate(%@, %@)'.fmt(x, y);
        element.style.transitionDuration = '%@s'.fmt(duration);
        element.style.transitionTimingFunction = timing
    },

    // animated hint text field animations
    textfieldModifiedState: function (element, duration) {
        if (Alto.isNone(duration)) {
            duration = 0.13209420901;
        }

        element.style.transform = 'translate3d(-6%, -70%, 0) scale(0.80)';
        element.style.webkitTransform = 'translate3d(-6%, -70%, 0) scale(0.80)';
        element.style.mozTransform = 'translate3d(-6%, -70%, 0) scale(0.80)';
        element.style.transitionDuration = '%@s'.fmt(duration);
        element.style.transitionTimingFunction = 'ease-in-out';
        element.className += ' modified-hint-state';
    },

    textfieldNormalState: function (element) {
        element.style.transform = 'translate3d(0, %, 0) scale(1)';
        element.style.webkitTransform = 'translate3d(0, 0%, 0) scale(1)';
        element.style.mozTransform = 'translate3d(0, 0%, 0) scale(1)';
        element.style.transitionDuration = '%@s'.fmt(0);
        element.style.transitionTimingFunction = 'ease-in-out';
        element.classList.remove('modified-hint-state');
    },

});