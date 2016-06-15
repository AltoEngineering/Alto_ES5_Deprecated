alto_require('frameworks/shared/altojs/ui/core_view.js');

// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2015 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC
// ==========================================================================

/**
 Description of table view

 @module UI
 @class Alto.TableView
 @extends Alto.CoreView
 @since Alto 0.0.1
 @author Chad Eubanks
 */

Alto.TableView = Alto.CoreView.extend ({

    classNames: [],

    Row: null,

    headers: [],

    data: [],

    /**
     Get the views tag type, create the html element(s) and passes html element(s) to viewDidLoad().

     We dont know anything about the html elements nor should we make that assumption.

     @method viewWillLoad
     */
    viewWillLoad: function () {
        var table, thead, headerRow, tbody, html;

        table = document.createElement('table');
        thead = document.createElement('thead');
        headerRow = document.createElement('tr');
        tbody = document.createElement('tbody');

        html = table;

        // let the html element know about the view //
        html.__alto_object__ = this;

        this.viewDidLoad(table, thead, headerRow , tbody);
    },

    viewDidLoad: function (table, thead, headerRow, tbody) {
        var header, classNames = this.get('classNames');

        if (Alto.isPresent(this.get('headers'))) {
            this.get('headers').forEach(function (headerText) {
                header = document.createElement('th');
                header.innerText = headerText;
                headerRow.appendChild(header);
            })
        }

        if (Alto.isPresent(classNames)) {
            classNames.forEach(function (className) {
                table.classList.add(className);
            })
        }

        thead.appendChild(headerRow);
        table.appendChild(thead);
        table.appendChild(tbody);

        this.viewWillAppear(table);
    },

    /*
     Create the views subviews

     */
    viewCreateSubViews: function (skipAnimation) {
        var tbody = this.node.tBodies[0];

        if (Alto.isEmpty(this.get('data'))) {
            return
        }

        var dataCollection = this.get('data'),
            Row = this.get('Row'), that = this;

        dataCollection.forEach(function (data, idx) {
            var row = Row.createWithMixins({parentView: that, data: data, indexRow: idx});

            if (data.get('isSelected')) {
                that.set('selectedCell', row);
                row.set('selection', data);
            }
            tbody.appendChild(row.node)
        })

        if (skipAnimation) {
            // do nothing
        } else {
            Alto.run.later(function () {
                that.viewAnimateIn();
            }, 200);
        }

    }

});