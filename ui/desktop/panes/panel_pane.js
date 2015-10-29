// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2014 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC
// ==========================================================================

/**
 Panel Pane

 @module UI
 @class Alto.PanelPane
 @extends Alto.Window
 @since Alto 0.0.1
 @internal-version 0.0.2
 @author Chad Eubanks and Miguel Chateloin
 */

Alto.PanelPane = Alto.Window.extend({
    childViews: ['pane'],
    isPanelPane: true,

    tag: 'div',

    contentView: null,

    pane: Alto.CoreView.extend({
        classNames: ['alto-panel-pane'],
        childViews: ['contentView'],

        contentViewBinding: 'this.parentView.contentView',

        viewWillLoad: function () {
            var pane = document.createElement('div');

            // let the html element know about the view //
            pane.__alto_object__ = this;

            this.viewDidLoad(pane);
        },

        click: function () {
           debugger;
        }

    })


});