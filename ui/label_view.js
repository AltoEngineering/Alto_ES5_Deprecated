alto_require('frameworks/shared/altojs/ui/core_view.js');

// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2014 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC
// ==========================================================================

/**
 `Alto.Label` is a view component for placing text in a container. A label displays a single line of read-only text.
 The text can be changed by the application, but a user cannot edit it directly.

 @module UI
 @class Alto.LabelView
 @extends Alto.CoreView
 @since Alto 0.0.1
 @version 1.0.0
 @author Chad Eubanks
 */

Alto.LabelView = Alto.CoreView.extend({

    tag: "div",

    /**
     * The value of the label.
     * @property title
     * @type String
     */
    title: null,

    escapeHtml: true,

    /*
     Has the html elements and passes them to viewWillAppear().

     We know about the html elements and can do some setup in here.
     Example: add disabled, hidden, etc className / adds alto object ids (maybe) / setup dynamic data and more...
     */
    viewDidLoad: function (node) {
        this.updateElementTitle(node);

        this._super(node);
    },

    titleDidChange: Alto.observer('title', function () {
        this.updateElementTitle(this.node);
    }),

    updateElementTitle: function (element) {
        var escapeHtml = this.get('escapeHtml');

        if (Alto.isEmpty(this.get("title"))) {
            element.textContent = '';
        } else if (escapeHtml) {
            element.textContent = this.get("title");
        } else {
            element.innerHTML = this.get("title");
        }
    }

});