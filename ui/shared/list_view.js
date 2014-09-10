Alto.ListView = Alto.View.extend ({

    tag: "ul",

    cell: Alto.View.extend ({
        tag: "li"
    }),

    /*
     Gets the template and passes html elements to viewDidLoad().

     We dont know anything about the html elements nor should
     we make that assumption.
     */
    viewWillLoad: function() {
        var node = this.get("tag");
        node = document.createElement(node);
        this.viewDidLoad(node);
    },

    /*
     Has the html elements and passes them to viewWillAppear().

     We know about the html elements and can do some setup in here.
     Example: add disabled, hidden, etc className / adds alto object ids (maybe) / setup dynamic data and more...
     */
    viewDidLoad: function(node) {
        node ? node : node = document.createElement(this.get("tag"));
        if (node) {

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
    viewCreateSubViews: function() {

        var n = 0,
            children = this.get('childViews'),
            Class = this.cell;
        while (n < children.length) {

            this.set(children[n], Class.create({parentView:  this, indexRow: n}));

            this.node.appendChild(this[children[n]].node)
            n++;
        }
    },

    dataDidChange: function () {
        if (this.data == "") {return}

        Alto.DomUtil.removeAllChildren(this.node);

        var childViews = [];
        for (var i = 0, len = this.data.length; i < len; i++) {
            childViews.push(i);
        }

        this.set('childViews', childViews);
        this.viewCreateSubViews();
    }.observes('this.data')

})