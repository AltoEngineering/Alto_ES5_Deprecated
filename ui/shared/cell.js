// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2014 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC
// ==========================================================================

/**
 Gives logging to your console some color.

 @module UI
 @class Alto.Cell
 @extends Alto.CoreView
 @since Alto 0.0.1
 @author Chad Eubanks
 */

Alto.Cell = Alto.CoreView.extend ({

    tag: 'li',

    /**
     Index of cell at a particular row in a list.
     @property indexRow
     */
    indexRow: "",

    isSelected: false,

    /*
     Has the html elements and passes them to viewWillAppear().

     We know about the html elements and can do some setup in here.
     Example: add disabled, hidden, etc className / adds alto object ids (maybe) / setup dynamic data and more...
     */
    viewDidLoad: function(node) {
        if (node) {
            var recordAtIndex =  this.parentView.data[this.indexRow];
            this.set('data', recordAtIndex);
        }

        if (this.get('isSelected') || (this.data && this.data.get('isSelected'))) {
            node.style.backgroundColor = '#eaf4ff'
        } else {
            node.removeAttribute('style');
        }

        this._super(node);
    },

    isSelectedDidChange: function () {
        if (this.get('isSelected') || (this.data && this.data.get('isSelected'))) {
            this.node.style.backgroundColor = '#eaf4ff'
        } else {
            this.node.removeAttribute('style');
        }
    }.observes('isSelected').on('init')

});