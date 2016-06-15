alto_require('frameworks/shared/altojs/ui/core_view.js');
alto_require('frameworks/shared/altojs/ui/cell_view.js');

// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2014 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC
// ==========================================================================

/**
 `Alto.ListView` is an instance that creates an unordered list. Each list view has a cell,
 which can bind to the data property and be independet from any other cells in the list.

 One example of usage:

 ```javascript
 sampleList: Alto.ListView.extend({
        cell: Alto.Cell.extend({})
        data: "ApplicationName.ApplicationController.content"
 })
 ```

 @module UI
 @class Alto.ListView
 @extends Alto.CoreView
 @since Alto 0.0.1
 @author Chad Eubanks
 */

Alto.ListView = Alto.CoreView.extend({

    selectedCell: '',

    tag: "ul",

    /**
     Individual cell for each item in the list
     @property cell
     @type object
     */
    Cell: null,

    /**
     The information that the list will bind to.
     @property data
     @type object
     */
    data: null,

    /*
     Create the views subviews

     */
    viewCreateSubViews: function (skipAnimation) {
        if (Alto.isEmpty(this.get('data'))) {
            return
        }

        var dataCollection = this.get('data'),
            Cell = this.get('Cell'), that = this;

        dataCollection.forEach(function (data, idx) {
            var cell = Cell.createWithMixins({parentView: that, data: data, indexRow: idx});

            if (data.get ? data.get('isSelected') : data.isSelected) {
                that.set('selectedCell', cell);
                cell.set('selection', data);
            }
            that.node.appendChild(cell.node);
        })

        if (skipAnimation) {
            // do nothing
        } else {
            Alto.run.later(function () {
                that.viewAnimateIn();
            }, 200);
        }

    },

    dataDidChange: Alto.observer('data', 'data.length', function () {
        if (!this.get('data')) {
            return
        }
        Alto.DomUtil.removeAllChildren(this.node);

        Alto.run.once(this, 'viewCreateSubViews', true);
    })

});