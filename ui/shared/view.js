// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2014 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC
// ==========================================================================

/**
 `Alto.View` creates a node that has a fullscreen property to set as the root view.

 @module UI
 @class Alto.View
 @extends Alto.CoreView
 @since Alto 0.0.1
 @author Chad Eubanks
 */

Alto.View = Alto.CoreView.extend ({

    tag: "div",

    /**
     * Sets the view to be fullscreen.
     * @property isFullScreen
     * @type boolean
     */
    isFullScreen: false,

    data: '',

    /*
     Has the html elements and passes them to viewWillAppear().

     We know about the html elements and can do some setup in here.
     Example: add disabled, hidden, etc className / adds alto object ids (maybe) / setup dynamic data and more...
     */
    viewDidLoad: function(node) {
        if (this.isFullScreen) {
            node.className += " alto-view-full-screen"
        }

        this._super(node);
    }

});