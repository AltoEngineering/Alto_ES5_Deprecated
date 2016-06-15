alto_require('frameworks/shared/altojs/ui/core_view.js');
alto_require('frameworks/shared/altojs/ui/view.js');

// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2014 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC
// ==========================================================================

/**
 Gives logging to your console some color.

 @module UI
 @class Alto.LoadingPane
 @extends Alto.CoreView
 @since Alto 0.0.1
 @author Chad Eubanks
 */

Alto.LoadingPane = Alto.CoreView.extend({

    childViews: ['contentView'],

    cancelAction: null,

    contentView: Alto.View.extend({
        classNames: ['loader']
    }),

    /*
     Gets the template and passes html elements to viewDidLoad().

     We dont know anything about the html elements nor should
     we make that assumption.
     */
    viewWillLoad: function () {
        var that = this;

        node = document.createElement('div');
        this.viewDidLoad(node);
    },

    /*
     Has the html elements and passes them to viewWillAppear().

     We know about the html elements and can do some setup in here.
     Example: add disabled, hidden, etc className / adds alto object ids (maybe) / setup dynamic data and more...
     */
    viewDidLoad: function (node) {
        var that = this;

        if (node) {
            node.className += "alto-view-full-screen alto-panel-pane ";

            var n = 0,
                classNames = this.get('classNames');
            while (n < classNames.length) {
                node.className += node.className ? ' ' + classNames[n] : classNames[n];
                n++;
            }

            this.viewWillAppear(node);
        }
    },

    /*
     Create the views subviews

     */
    viewCreateSubViews: function () {
        var children = this.get('childViews');

        this.set([children[0]], this[children[0]].create({parentView: this}));
        this.node.appendChild(this[this.childViews[0]].node);

        this.viewAnimateIn();
    }

});