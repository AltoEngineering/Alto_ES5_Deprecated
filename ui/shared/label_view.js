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

    titleValueKey: null,

    /*
     Has the html elements and passes them to viewWillAppear().

     We know about the html elements and can do some setup in here.
     Example: add disabled, hidden, etc className / adds alto object ids (maybe) / setup dynamic data and more...
     */
    viewDidLoad: function (node) {
        if (node) {

            if (!Alto.isEmpty(this.get('title'))) {
                node.textContent = this.get("title");
            } else if (this.get('titleValueKey') != null) {
                if (this.parentView.data.get([this.get('titleValueKey')])) {
                    node.textContent = this.parentView.data.get([this.get('titleValueKey')]);
                } else {
                    node.textContent = '';
                }
            }
        }

        this._super(node);
    },

    titleDidChange: function () {
        if (Alto.isEmpty(this.get("title"))) {
            this.node.textContent = '';
            return
        }

        this.node.textContent = this.get("title");
    }.observes('title')

})