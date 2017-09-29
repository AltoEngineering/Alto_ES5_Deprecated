import Alto from '../../core.js';
import CoreView from './core_view.js';

// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2017 The Code Boutique, LLC
// License:   MIT License (see license for details)
// Author: Chad Eubanks
// ==========================================================================

let ListView = CoreView.extend({

    isListView: true,

    tag: 'ul',

    selectedCell: null,

    cell: null,

    data: null,

    viewCreateSubViews: function () {
        if (Alto.isEmpty(this.get('data'))) {
            return
        }

        let dataCollection = this.get('data'), that = this;

        dataCollection.forEach(function (data, idx) {
            var cell = that.get('cell').create({parentView: that, data: data, indexRow: idx});

            if (data.get ? data.get('isSelected') : data.isSelected) {
                that.set('selectedCell', cell);
                cell.set('selection', data);
            }
            that.node.appendChild(cell.node);
        });

        this.viewAnimateIn();
    },

    dataDidChange: function () {
        if (!this.node) {return};

        Alto.DomUtil.removeAllChildren(this.node);

        this.viewCreateSubViews();
    }

});

export default ListView;