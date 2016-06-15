alto_require('frameworks/shared/altojs/ui/core_view.js');

// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2015 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC
// ==========================================================================

/**
 Gives logging to your console some color.

 @module UI
 @class Alto.ContainerView
 @extends Alto.CoreView
 @since Alto 0.0.1
 @author Chad Eubanks
 */


Alto.ContainerView = Alto.CoreView.extend({

    tag: 'div',

    nowShowing: '',

    childView: '',

    /**
     Create the views subviews.
     @method viewCreateSubViews
     */
    viewCreateSubViews: function () {
        var nowShowing = this.get('nowShowing'),
            child, that = this;

        if (Alto.isPresent(nowShowing)) {
            child = nowShowing.createWithMixins({parentView: this});
            this.set('childView', child);
            this.node.appendChild(child.node);
        }

        Alto.run.later(function () {
            that.viewAnimateIn();
        }, 200);
    },

    nowShowingDidChange: Alto.observer('nowShowing', function () {
        if (Alto.isPresent(this.get('childView'))) {
            this.get('childView').remove();
        }

        this.viewCreateSubViews();
    })

});