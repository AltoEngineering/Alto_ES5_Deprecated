alto_require('frameworks/altojs/ui/shared/core_view.js');

// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2015 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC
// ==========================================================================

/**
 `Alto.TextField` is a class used to create text inputs where an event handler is created to update on any changes.
 If nothing has been inputted, the default value is empty.

 One example of usage:

 ```javascript
 sampleTextField: Alto.TextField.extend({
        hint: ""                   //shows text inside the text field
        isPassword: false          //sensors any input inside the text field
        value: null                //set the value inside the text field
        isDefaultFocus: false      //will focus on the text field when first loaded
 })
 ```

 @module UI
 @class Alto.TextField
 @extends Alto.CoreView
 @since Alto 0.0.1
 @author Chad Eubanks
 */

Alto.TextField = Alto.CoreView.extend(Alto.formValidationMixin, {

    tag: 'input',

    /**
     * Walk like a duck.
     @property isTextField
     @type bool
     */
    isTextField: true,

    /**
     Provides a hint towards the content of the text field.
     @property hint
     @type String
     */
    hint: "",

    /**
     The result of the input value.
     @property value
     @type String
     */
    value: null,

    /**
     Specifies that an <input> element should automatically get focus when the view loads.
     @property isDefaultFocus
     @type boolean
     */
    isDefaultFocus: false,

    /**
     Specifies the type an <input> element should be.  Example: `type: 'email'`.  The type not only sets the type
     dom element attirbute but it also drives the forms validation.
     @property type
     @type string
     */
    type: null,

    /**
     @property type
     @type number
     */
    maxLength: 5096,

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

            if (this.get('type')) {
                var activeFormsLookup = Alto.formValidationContainer.get('activeFormsLookup');

                node.type = this.get('type');

                if (this.get('isRequired')) {
                    activeFormsLookup[Alto.guidFor(this)] = this;
                }
            }

            if (this.get('maxLength')) {
                node.maxlength = this.get('maxLength');
                node.maxLength = this.get('maxLength');
            }

            if (this.get('isDefaultFocus')) {
                node.autofocus = true;
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

        if (!Alto.isEmpty(this.get('type'))) {
            var formType = this.get('type'),
                validateMethod = '_validate' + Alto.String.capitalize(formType);

            if (this[validateMethod]) {
                this[validateMethod](this.get('value'));
            }
        }

    },

    onKeyUp: function () {


    },

    valueDidChange: function () {
        if (Alto.isEmpty(this.get("value"))) {
            this.node.value = '';
            return
        }

        if (!Alto.isEmpty(this.get('type'))) {
            var formType = this.get('type'),
                validateMethod = '_validate' + Alto.String.capitalize(formType);

            if (this[validateMethod]) {
                this[validateMethod](this.get('value'));
            }
        }

        if (this.node.value === this.get('value')) {
            return
        }

        this.node.value = this.get('value');
    }.observes('this.value').on('init')

});