// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2014 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC
// ==========================================================================

/**
 Gives logging to your console some color.

 @module UI
 @class Alto.DialoguePane
 @extends Alto.CoreView
 @since Alto 0.0.1
 @author Chad Eubanks and Anthony Alviz
 */

Alto.DialoguePane = Alto.CoreView.extend({

    childViews: ['contentView'],

    classNames: [],

    cancelAction: null,

    contentView: null,

    /*
     Gets the template and passes html elements to viewDidLoad().

     We dont know anything about the html elements nor should
     we make that assumption.
     */
    viewWillLoad: function () {
        var pane = document.createElement('div');

        this.viewDidLoad(pane);
    },

    /*
     Has the html elements and passes them to viewWillAppear().

     We know about the html elements and can do some setup in here.
     Example: add disabled, hidden, etc className / adds alto object ids (maybe) / setup dynamic data and more...
     */
    viewDidLoad: function (pane) {
        if (pane) {
            pane.className += "alto-dialogue-pane ";

            var n = 0,
                classNames = this.get('classNames');
            while (n < classNames.length) {
                pane.className += pane.className ? ' ' + classNames[n] : classNames[n];
                n++;
            }

            this.viewWillAppear(pane);
        }
    },

    contentViewDidChange: function() {
        Alto.DomUtil.removeAllChildren(this.node);
        this.viewCreateSubViews();
    }.observes('this.contentView')

});