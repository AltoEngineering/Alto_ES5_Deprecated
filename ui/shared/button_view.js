// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2014 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC
// ==========================================================================

/**
 Gives logging to your console some color.

 @module UI
 @class Alto.ButtonView
 @extends Alto.CoreView
 @since Alto 0.0.1
 @author Chad Eubanks
 */

Alto.ButtonView = Alto.CoreView.extend ({

    tag: "button",

    title: "",

    action: "",

    /*
     Has the html elements and passes them to viewWillAppear().

     We know about the html elements and can do some setup in here.
     Example: add disabled, hidden, etc className / adds alto object ids / setup dynamic data and more...
     */
    viewDidLoad: function(node) {
        var that = this

        if (node) {
            node.addEventListener("click", function(){that.click(that) }, false);
            node.innerHTML = this.getPath("this.title");
        }

        this._super(node);
    },

    click: function(buttonView) {
        var APP = Alto.applicationName

        window[APP].Statechart.dispatchEvent(buttonView.action, this);
    },

    titleDidChange: function() {
        this.node.innerHTML = this.getPath("this.title");
    }.observes('this.title')

});