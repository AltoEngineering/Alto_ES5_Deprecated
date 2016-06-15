alto_require('frameworks/shared/altojs/ui/core_view.js');

// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2015 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC
// ==========================================================================

/**
 Description of button view

 @module UI
 @class Alto.ButtonView
 @extends Alto.CoreView
 @since Alto 1.0.0
 @author Chad Eubanks
 */

Alto.ButtonView = Alto.CoreView.extend ({

    tag: 'button',

    title: '',

    action: '',

    viewDidLoad: function (html) {
        var title = this.get('title'),
            action = this.get('action');

        if (Alto.isPresent(title)) {
            html.innerText = title;
        } else {
            Alto.Logger.error('Alto.Button requires a title.  Make sure you provide a value.  Button can not be created.');
            return;
        }

        if (Alto.isEmpty(action)) {
            Alto.Logger.error('Alto.Button requires an action.  Make sure you provide a value.  Button can not be created.');
            return;
        }

        this._super(html)
    },

    titleDidChange: Alto.observer('title', function () {
        this.node.innerText = this.get('title');
    })


});