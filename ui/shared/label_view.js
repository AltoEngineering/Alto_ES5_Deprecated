// ==========================================================================
// Project: Alto
// Author: Chad Eubanks
// Copyright: @2014 The Code Boutique, LLC
// ==========================================================================

Alto.LabelView = Alto.CoreView.extend ({

    tag: "label",

    title: "",

    /*
     Has the html elements and passes them to viewWillAppear().

     We know about the html elements and can do some setup in here.
     Example: add disabled, hidden, etc className / adds alto object ids (maybe) / setup dynamic data and more...
     */
    viewDidLoad: function(node) {
        node ? node : node = document.createElement(this.get("tag"));
        if (node) {
            node.id = Alto.guidFor(this);
            var n = 0,
                classNames = this.get('classNames');
            while (n < classNames.length) {
                node.className += node.className ? ' ' + classNames[n] : classNames[n];
                n++;
            }

            if (this.getPath('title')) {
                node.innerHTML = this.getPath("title");
            }

            this.viewWillAppear(node);
        }
    },

    titleDidChange: function() {
        this.node.innerHTML = this.getPath("title");
    }.observes('this.title')

})