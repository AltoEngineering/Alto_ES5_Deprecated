// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2014 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC
// ==========================================================================

/**
 Gives logging to your console some color.

 @module UI
 @class Alto.CoreView
 @extends Alto.Object
 @since Alto 0.0.1
 @author Chad Eubanks
 */

Alto.CoreView = Alto.Object.extend({

    classNames: [],

    childViews: [],

    parentView: "",

    tag: "",

    node: "",

    layerId: '',

    isVisible: true,

    attachToNode: "",

    attachBeforeNode: "",

    init: function () {
        this.viewWillLoad();
    },

    /*
     Gets the template and passes html elements to viewDidLoad().

     We dont know anything about the html elements nor should
     we make that assumption.
     */
    viewWillLoad: function () {
        if (this.get("tag") == '') {
            Alto.Console.log('View class: ' + this + ' can not have an empty tag.', Alto.Console.errorColor);
            return;
        }

        var node = this.get("tag");
        node = document.createElement(node);
        this.viewDidLoad(node);
    },

    /*
     Has the html elements and passes them to viewWillAppear().

     We know about the html elements and can do some setup in here.
     Example: add disabled, hidden, etc className / adds alto object ids (maybe) / setup dynamic data and more...
     */
    viewDidLoad: function (node) {
        node ? node : node = document.createElement(this.get("tag"));
        if (node) {

            var n = 0,
                classNames = this.get('classNames');
            while (n < classNames.length) {
                node.className += node.className ? ' ' + classNames[n] : classNames[n];
                n++;
            }

            if (this.get('layerId') != '') {
                node.id = this.get('layerId');
            }

            if (!this.get('isVisible')) {
                node.style.visibility = 'hidden';
            }

            this.viewWillAppear(node);
        }
    },

    /*
     With our html elements all setup and ready to go.
     We add them to the dom and invokes viewDidAppear().
     */
    viewWillAppear: function (node) {

        if (this.get('attachToNode') != "" && this.get('attachBeforeNode') === "") {
            Alto.DomUtil.addElementToNode(node, this.get('attachToNode'));
        } else if (this.get('attachToNode') != "" && this.get('attachBeforeNode') != "") {
            Alto.DomUtil.addElementToNodeBeforeNode(node, this.get('attachToNode'), this.get('attachBeforeNode'))
        }

        this.viewDidAppear(node);
    },

    /*
     Our html is now on the dom and can be queried.
     */
    viewDidAppear: function (html) {
        this.set("node", html);
        this.viewCreateSubViews();
    },

    /*
     Removes elements from the dom.
     */
    viewWillDisappear: function () {
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
    viewDidDisappear: function () {
    },

    /*
     Create the views subviews

     */
    viewCreateSubViews: function () {
        var n = 0,
            children = this.get('childViews');
        while (n < children.length) {

            if (!Alto.Object.detectInstance(this[children[n]])) {
                if (!this[children[n]]) {
                    Alto.Logger.error('Can not find child view: ',children[n])
                    return;
                } else {
                    this.set([children[n]], this[children[n]].create({parentView: this}));
                }
            }

            this.node.appendChild(this[children[n]].node)
            n++;
        }
    },

    /*
     Removes self from dom
     */
    remove: function () {
        this.viewWillDisappear();
    },


    //todo move this into view class
    isVisibleDidChange: function () {
        if (this.get('isVisible')) {
            this.node.style.visibility = 'visible';
        } else {
            this.node.style.visibility = 'hidden';
        }
    }.observes('this.isVisible')

});