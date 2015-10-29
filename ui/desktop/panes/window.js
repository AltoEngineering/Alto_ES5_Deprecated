// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2015 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC
// ==========================================================================

/**
 Base pane class.

 @module UI
 @class Alto.Window
 @extends Alto.CoreView
 @since Alto 0.0.2
 @internal-version 0.0.1
 @author Chad Eubanks and Miguel Chateloin
 */

Alto.Window = Alto.CoreView.extend({
    classNames: ['alto-window'],

    isWindow: true,

    tag: 'div',

    attachToNode: 'body',

    viewWillLoad: function () {
        var that = this,
            window = document.createElement('div');

        // let the html element know about the view //
        window.__alto_object__ = this;

        // register client handler
        window.addEventListener("click", function (event) {
            event.target.__alto_object__.click()
        }, true);

        this.viewDidLoad(window);
    },

    click: function (event) {

        if (Alto.isNone(this.get('cancelAction'))) {
            Alto.Console.log('BAD WARNING: Missing cancel action', Alto.Console.errorColor);
            return
        }

        var APP = Alto.applicationName
        window[APP].statechart.dispatchViewEvent(this.get('cancelAction'));
    }

});