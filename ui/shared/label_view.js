// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2014 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC
// ==========================================================================

/**
 Gives logging to your console some color.

 @module UI
 @class Alto.LabelView
 @extends Alto.CoreView
 @since Alto 0.0.1
 @author Chad Eubanks
 */

Alto.LabelView = Alto.CoreView.extend ({

    tag: "label",

    title: "",

    /*
     Has the html elements and passes them to viewWillAppear().

     We know about the html elements and can do some setup in here.
     Example: add disabled, hidden, etc className / adds alto object ids (maybe) / setup dynamic data and more...
     */
    viewDidLoad: function(node) {
        if (node) {
            if (this.getPath('title')) {
                node.innerHTML = this.getPath("title");
            }
        }

        this._super(node);
    },

    titleDidChange: function() {
        this.node.innerHTML = this.getPath("title");
    }.observes('this.title')

})