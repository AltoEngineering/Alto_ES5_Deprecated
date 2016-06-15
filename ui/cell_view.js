alto_require('frameworks/shared/altojs/ui/core_view.js');

// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2015 The Code Boutique, LLC
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

    isSelectedBinding: 'this.data.isSelected',

    selection: '',

    action: 'internal',

    /*
     Has the html elements and passes them to viewWillAppear().

     We know about the html elements and can do some setup in here.
     Example: add disabled, hidden, etc className / adds alto object ids (maybe) / setup dynamic data and more...
     */
    viewDidLoad: function(node) {
        this._super(node);

        if (this.get('isSelected')) {
            node.classList.add('is-selected');
        }

        if (!this.get('isVisible')) {
            node.classList.add('hidden');
        }

    },

    isSelectedDidChange: Alto.observer('isSelected', function () {
        var that = this;

        if (this.get('isSelected')) {
            this.node.classList.add('is-selected');
        } else {
            this.node.classList.remove('is-selected');
        }
        
    }),

    _mouseDown: function () {
        if (this.get('isSelected')) {
            return
        }

        this.set('isSelected', true);
        this.set('selection', this.get('data'));
    }

});