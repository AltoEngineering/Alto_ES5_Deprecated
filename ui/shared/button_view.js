// ==========================================================================
// Project: Alto
// Author: Chad Eubanks
// Copyright: @2014 The Code Boutique, LLC
// ==========================================================================

Alto.ButtonView = Alto.View.extend ({

    concatenatedProperties: ['childViews'],

    childViews: ['_buttonLabel'],

    tag: "button",

    title: "",

    action: "",

    /*
     Has the html elements and passes them to viewWillAppear().

     We know about the html elements and can do some setup in here.
     Example: add disabled, hidden, etc className / adds alto object ids / setup dynamic data and more...
     */
    viewDidLoad: function(node) {
        var that = this
        node ? node : node = document.createElement(this.get("tag"));
        if (node) {

            var n = 0,
                classNames = this.get('classNames');

            while (n < classNames.length) {
                node.className += node.className ? ' ' + classNames[n] : classNames[n];
                n++;
            }

            node.addEventListener("click", function(){that.click(that) }, false);

            this.viewWillAppear(node);
        }
    },

    click: function(buttonView) {
        var APP = Alto.applicationName

        window[APP].Statechart.dispatchEvent(buttonView.action);
    },

    _buttonLabel: Alto.LabelView.extend ({

        classNames: ["alto-button-label"],

        titleBinding: "this.parentView.title",

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

                if (this.getPath("this.parentView.title")) {
                    node.innerHTML = this.getPath("this.parentView.title");
                }

                this.viewWillAppear(node);
            }
        },

        titleDidChange: function() {
            this.node.innerHTML = this.getPath("this.parentView.title");
        }.observes('this.parentView.title')

    })

});