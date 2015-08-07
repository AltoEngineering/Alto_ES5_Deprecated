// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2014 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC
// ==========================================================================

/**
 `Alto.HoverEvents` is a mixin that listens for any mouse action. Alto objects on hover will start the
 `mouseDidEnterAction` and `mouseDidExitAction` when the mouse leaves the object region.

 One example of usage:

 ```javascript
showDeleteOnHover: Alto.View.extend(Alto.HoverEvents, ({
    mouseDidEnterAction: 'foo',                         //run foo function when mouse is hovered on object
    mouseDidExitAction: 'bar',                          //run bar function when mouse is not hovered on object
})
 ```

 @module UI
 @class Alto.HoverEvents
 @extends Alto.Mixin
 @since Alto 0.0.1
 @author Chad Eubanks
 */


Alto.HoverEvents = Alto.Mixin.create ({

    target: 'this',

    /**
     Behavior function when mouse enters region.

     @method mouseDidEnterAction
     @param function
     */
    mouseDidEnterAction: 'mouseDidEnter',

    /**
     Behavior function when mouse leaves the region.

     @method mouseDidExitAction
     @param function
     */
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
            window[APP].statechart.dispatchEvent(view.mouseDidEnterAction, this);
        }

    },

    mouseleave: function(view) {
        var APP = Alto.applicationName;

        if (view.target == 'this') {
            this[this.mouseDidExitAction]()
        } else {
            window[APP].statechart.dispatchEvent(view.mouseDidExitAction, this);
        }

    },

    /*
     Has the html elements and passes them to viewWillAppear().

     We know about the html elements and can do some setup in here.
     Example: add disabled, hidden, etc className / adds alto object ids (maybe) / setup dynamic data and more...
     */
    viewDidLoad: function(node) {
        if (node) {
            this.addHoverHandler(node);
        }

        this._super(node);
    }

});