// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2014 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC
// ==========================================================================

/**
 `Alto.KeyLabelView` is a component for creating a label with an associated key.

 @module UI
 @class Alto.KeyFormView
 @extends Alto.CoreView
 @since Alto 0.0.1
 @author Chad Eubanks
 */


Alto.KeyLabelView = Alto.CoreView.extend({

    /**
     Generic title name for the key.
     @property keyTitleClassNames
     @type array
     */
    keyTitleClassNames: [],

    /**
     Generic title name for the label.
     @property labelTitleClassNames
     @type array
     */
    labelTitleClassNames: [],

    /**
     Value for the key.
     @property keyTitle
     @type String
     */
    keyTitle: null,

    /**
     Value for the label.
     @property labelTitle
     @type String
     */
    labelTitle: null,

    /**
     @property _keyTitleNode
     */
    _keyTitleNode: null,

    /**
     @property _labelTitleNode
     */
    _labelTitleNode: null,

    /*
     Gets the template and passes html elements to viewDidLoad().

     We dont know anything about the html elements nor should
     we make that assumption.
     */
    viewWillLoad: function () {
        var node = document.createElement('div'),
            keyTitleNode = document.createElement('div'),
            labelTitleNode = document.createElement('div');

        this.set('_keyTitleNode', keyTitleNode);
        this.set('_labelTitleNode', labelTitleNode);

        this.viewDidLoad(node, keyTitleNode, labelTitleNode);
    },

    /*
     Has the html elements and passes them to viewWillAppear().

     We know about the html elements and can do some setup in here.
     Example: add disabled, hidden, etc className / adds alto object ids (maybe) / setup dynamic data and more...
     */
    viewDidLoad: function (node, keyTitleNode, labelTitleNode) {
        var that = this,
            n = 0,
            classNames = this.get('keyTitleClassNames');

        node.className = "alto-key-label-view ";
        keyTitleNode.className = "key-title ";
        labelTitleNode.className = "label-title ";

        while (n < classNames.length) {
            keyTitleNode.className += keyTitleNode.className ? ' ' + classNames[n] : classNames[n];
            n++;
        }

        n = 0;
        classNames = this.get('labelTitleClassNames');
        while (n < classNames.length) {
            labelTitleNode.className += labelTitleNode.className ? ' ' + classNames[n] : classNames[n];
            n++;
        }

        n = 0;
        classNames = this.get('classNames');
        while (n < classNames.length) {
            node.className += node.className ? ' ' + classNames[n] : classNames[n];
            n++;
        }

        if (!this.get('keyTitle')) {
            keyTitleNode.textContent = '';
        } else {
            keyTitleNode.textContent = this.get('keyTitle');
        }

        if (!this.get('labelTitle')) {
            labelTitleNode.textContent = '';
        } else {
            labelTitleNode.textContent = this.get('labelTitle');
        }

        node.appendChild(keyTitleNode);
        node.appendChild(labelTitleNode);

        this.viewWillAppear(node);
    },

    labelTitleDidChange: function () {
        var labelTitleNode = this.get('_labelTitleNode');
        labelTitleNode.textContent = this.get('labelTitle');
    }.observes('this.labelTitle')

});