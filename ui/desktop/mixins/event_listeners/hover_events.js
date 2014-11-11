// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2014 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC
// ==========================================================================

/**
 Gives logging to your console some color.

 @module UI
 @class Alto.HoverEvents
 @extends Alto.Mixin
 @since Alto 0.0.1
 @author Chad Eubanks
 */


Alto.HoverEvents = Alto.Mixin.create ({

    mouseDidEnterAction: 'mouseDidEnter',

    mouseDidExitAction: 'mouseDidExit',

    /*
     Has the html elements and passes them to viewWillAppear().

     We know about the html elements and can do some setup in here.
     Example: add disabled, hidden, etc className / adds alto object ids / setup dynamic data and more...
     */
    addHoverHandler: function(node) {
        var that = this

        node.addEventListener("mouseover", function(){that.mouseover(that) }, false);
        node.addEventListener("mouseleave", function(){that.mouseleave(that) }, false);
    },

    mouseover: function(view) {
        var APP = Alto.applicationName;

        if (view.target == 'this') {
            this[this.mouseDidEnterAction]()
        } else {
            window[APP].Statechart.dispatchEvent(view.mouseDidEnterAction, this);
        }

    },

    mouseleave: function(view) {
        var APP = Alto.applicationName;

        if (view.target == 'this') {
            this[this.mouseDidExitAction]()
        } else {
            window[APP].Statechart.dispatchEvent(view.mouseDidExitAction, this);
        }

    },

    _nodeListeningToMouseOverDidChange: function () {
        this.addHoverHandler(this.node);
    }.observes('this.node')

});