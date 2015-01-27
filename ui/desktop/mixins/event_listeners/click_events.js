// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2014 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC
// ==========================================================================

/**
 Gives logging to your console some color.

 @module UI
 @class Alto.ClickEvents
 @extends Alto.Mixin
 @since Alto 0.0.1
 @author Chad Eubanks
 */

Alto.ClickEvents = Alto.Mixin.create ({

    /*
     Action is the method to be called when a click event is fired.
     */
    clickAction: '',

    /*
     Has the html elements and passes them to viewWillAppear().

     We know about the html elements and can do some setup in here.
     Example: add disabled, hidden, etc className / adds alto object ids / setup dynamic data and more...
     */
    addClickHandler: function(node) {
        var that = this

        node.addEventListener("click", function(){that.click(that) }, false);
    },

    click: function(view) {
        var APP = Alto.applicationName;
        window[APP].statechart.dispatchEvent(view.action, this);
    },

    /*
     Has the html elements and passes them to viewWillAppear().

     We know about the html elements and can do some setup in here.
     Example: add disabled, hidden, etc className / adds alto object ids (maybe) / setup dynamic data and more...
     */
    viewDidLoad: function(node) {
        if (node) {
            this.addClickHandler(node);
        }

        this._super(node);
    }

});