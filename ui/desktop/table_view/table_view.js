// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2014 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC
// ==========================================================================

Alto.TableView = Alto.View.extend ({
    tag: 'table'
});

Alto.TableHeaderView = Alto.View.extend ({
    tag: 'thead'
});

Alto.TableRowView = Alto.View.extend ({
    tag: 'tr'
});

Alto.TableCellView = Alto.View.extend ({
    tag: 'td',

    title: '',

    /*
     Has the html elements and passes them to viewWillAppear().

     We know about the html elements and can do some setup in here.
     Example: add disabled, hidden, etc className / adds alto object ids (maybe) / setup dynamic data and more...
     */
    viewDidLoad: function(node) {
        if (node) {
            if (this.getPath('title')) {
                node.innerHTML = this.getPath("title");
            }

        }

        this._super(node);
    }

});

Alto.TableBodyView = Alto.View.extend ({
    tag: 'tbody',

    row: '',

    data: '',

    dataDidChange: function () {
        if (this.data == "") {return}

        Alto.DomUtil.removeAllChildren(this.node);

        var rowViewInstances = [],
            rowViewInstance;

        for (var i = 0, len = this.data.length; i < len; i++) {
            var RowViewClass = this.row;
            rowViewInstance = RowViewClass.create({parentView:  this, indexRow: i, data: this.data[i]})
            Alto.DomUtil.removeAllChildren(rowViewInstance.node);
            rowViewInstances.addObject(rowViewInstance);

            for (var k = 0, klen = rowViewInstance.childViews.length; k < klen; k++) {
                var currentChildViewInstance = rowViewInstance[rowViewInstance.childViews[k]];

                currentChildViewInstance.node.innerHTML =
                    currentChildViewInstance.parentView.data[currentChildViewInstance.contentValueKey] ?
                        currentChildViewInstance.parentView.data[currentChildViewInstance.contentValueKey] :
                        'n/a';
                rowViewInstance.node.appendChild(currentChildViewInstance.node);
                this.node.appendChild(rowViewInstance.node);
            }

            debugger;
        }

    }.observes('this.data')

});