// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Author: Chad Eubanks
// Copyright: @2014 The Code Boutique, LLC
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

Alto.CoreView = Alto.Object.extend( {

    classNames: [],

    childViews: [],

    parentView: "",

    tag: "",

    node: "",

    attachToNode: "",

    init: function() {
        this.viewWillLoad();
    },

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
            node.id = Alto.guidFor(this);
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
     With our html elements all setup and ready to go.
     We add them to the dom and invokes viewDidAppear().
     */
    viewWillAppear: function(node) {
        if (this.get('attachToNode') != "")
        Alto.DomUtil.addElementToNode(node, this.get('attachToNode'));
        this.viewDidAppear(node);
    },

    /*
     Our html is now on the dom and can be queried.
     */
    viewDidAppear: function(html) {
        this.set("node", html);
        this.viewCreateSubViews();
    },

    /*
     Removes elements from the dom.
     */
    viewWillDisappear: function() {
        var n = 0,
            children = this.get('childViews');

        while (n < children.length) {
            document.getElementById(Alto.guidFor(this[children[n]])).remove();
            n++;
        }

        if (n == children.length) {
            document.getElementById(Alto.guidFor(this)).remove();
        }

        this.viewDidDisappear();
    },

    /*
     Nothing is left on the dom.
     */
    viewDidDisappear: function() {},

    /*
     Create the views subviews

     */
    viewCreateSubViews: function() {
        var n = 0,
            children = this.get('childViews');
        while (n < children.length) {

            if (!Alto.Object.detectInstance(this[children[n]])) {
                this.set([children[n]], this[children[n]].create({parentView:  this}));
            }

            this.node.appendChild(this[children[n]].node)
            n++;
        }
    },

    /*
        Removes self from dom
    */
    remove: function() {
        this.viewWillDisappear();
    }

});