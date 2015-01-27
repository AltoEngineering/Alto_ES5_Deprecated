// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2014 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC
// ==========================================================================

/**
 A textfield for searching.

 @module UI
 @class Alto.SearchField
 @extends Alto.CoreView
 @since Alto 0.0.1
 @author Chad Eubanks
 */

Alto.SearchField = Alto.CoreView.extend({

    hint: '',

    value: '',

    searchIcon: '',

    /*
     Gets the template and passes html elements to viewDidLoad().

     We dont know anything about the html elements nor should
     we make that assumption.
     */
    viewWillLoad: function () {

        var node = 'div',
            searchNode = 'img',
            inputNode = 'input';

        node = document.createElement(node),
        searchNode = document.createElement(searchNode),
        inputNode = document.createElement(inputNode);

        node.appendChild(searchNode);
        node.appendChild(inputNode);

        this.viewDidLoad(node);
    },

    /*
     Has the html elements and passes them to viewWillAppear().

     We know about the html elements and can do some setup in here.
     Example: add disabled, hidden, etc className / adds alto object ids (maybe) / setup dynamic data and more...
     */
    viewDidLoad: function (node) {
        var that = this;

        if (node) {
            // div
            node.className = 'alto-search-view';
            // search input
            node.children[1].type = 'search';
            node.children[1].addEventListener("input", function () {
                that.inputDidChange(that)
            }, false);
            node.children[1].placeholder = this.get('hint');
            // img
            node.children[0].src = this.get('searchIcon');
        }

        this._super(node);
    },

    inputDidChange: function (input) {
        this.set('value', this.node.children[1].value);
    },

    valueDidChange: function () {
        this.node.children[1].value = this.get('value');
    }.observes('this.value')

});