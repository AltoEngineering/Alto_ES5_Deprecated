// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2014 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC
// ==========================================================================

/**
 Gives logging to your console some color.

 @module UI
 @class Alto.TextField
 @extends Alto.CoreView
 @since Alto 0.0.1
 @author Chad Eubanks
 */

Alto.TextField = Alto.CoreView.extend({

    tag: 'input',

    hint: "",

    isPassword: false,

    value: null,

    /*
     Has the html elements and passes them to viewWillAppear().

     We know about the html elements and can do some setup in here.
     Example: add disabled, hidden, etc className / adds alto object ids (maybe) / setup dynamic data and more...
     */
    viewDidLoad: function (node) {
        var that = this;
        if (node) {
            node.addEventListener("input", function () {
                that.inputDidChange(that)
            }, false);

            if (this.get('isPassword')) {
                node.type = "password";
            }

            if (this.get('type')) {
                node.type = this.get('type');
            }

            if (!Alto.isEmpty(this.get("value"))) {
                node.value = this.get('value');
            }

            node.placeholder = this.get('hint');
        }

        this._super(node);
    },

    inputDidChange: function (textField) {
        this.set('value', textField.node.value);
    },

    valueDidChange: function () {

        if (this.node.value === this.get('value')) {return}

        if (Alto.isEmpty(this.get("value"))) {
            this.node.value = '';
            return
        }

        this.node.value = this.get('value');
    }.observes('this.value')

})