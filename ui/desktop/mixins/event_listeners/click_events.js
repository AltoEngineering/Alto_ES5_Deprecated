// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2014 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC
// ==========================================================================

/**
 `Alto.ClickEvents` gives the functionality that an object executes an action upon click selection.

 @module UI
 @class Alto.ClickEvents
 @extends Alto.Mixin
 @since Alto 0.0.1
 @author Chad Eubanks
 */

Alto.ClickEvents = Alto.Mixin.create({

    /**
     Dispatch the function to be called when a click event is fired.
     @property clickAction
     @type String
     */
    clickAction: '',

    /**
     Dispatch  function once the object has been selected.
     @property selection
     @type String
     */
    selection: '',

    /**
     Set if click events are enabled.
     @property isEnabled
     @type boolean
     */
    isEnabled: true,

    /*
     Has the html elements and passes them to viewWillAppear().

     We know about the html elements and can do some setup in here.
     Example: add disabled, hidden, etc className / adds alto object ids / setup dynamic data and more...
     */
    addClickHandler: function (node) {
        var that = this

        node.addEventListener("click", function () {
            that.click(that)
        }, false);
    },

    click: function (view) {
        var APP = Alto.applicationName;

        if (!this.get('isEnabled')) {return;}

        // we look at the selection binding since selection points to an null controller content
        if (view.get('selectionBinding')) {
            Alto.run.begin();
            view.set('selection', view.get('data'));
            Alto.run.end();
            window[APP].statechart.dispatchEvent(view.action, this);
        } else {
            window[APP].statechart.dispatchEvent(view.action, this);
        }
    },

    /*
     Has the html elements and passes them to viewWillAppear().

     We know about the html elements and can do some setup in here.
     Example: add disabled, hidden, etc className / adds alto object ids (maybe) / setup dynamic data and more...
     */
    viewDidLoad: function (node) {
        if (node) {
            this.addClickHandler(node);
        }

        this._super(node);
    }
});