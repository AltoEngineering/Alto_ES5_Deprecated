alto_require('frameworks/shared/altojs/ui/core_view.js');

// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2014 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC
// ==========================================================================

/**
 `Alto.KeyFormView` is a component for creating a form with an associated key.

 @module UI
 @class Alto.KeyFormView
 @extends Alto.CoreView
 @since Alto 0.0.1
 @author Chad Eubanks
 */

Alto.KeyFormView = Alto.CoreView.extend({

    isRequired: true,

    /**
     * Walk like a duck.
     @property isKeyFormView
     @type bool
     */
    isKeyFormView: true,

    /**
     * Naming of the key label. Can use multiple class names.
     @property keyLabelClassNames
     @type array
     */
    keyLabelClassNames: [],

    /**
     * Naming of the form. Can use multiple class names.
     @property formViewClassNames
     @type array
     */
    formViewClassNames: [],

    /**
     * The value of the input.
     @property formValue
     */
    formValue: null,

    /**
     Specifies the type an <input> element should be.  Example: `type: 'email'`.  The type not only sets the type
     dom element attirbute but it also drives the forms validation.
     @property formType
     @type string
     */
    formType: null,

    /**
     * Value of the key.
     @property keyLabelTitle
     */
    keyLabelTitle: null,

    /**
     * Sets the form to receive input when the view is loaded.
     @property isDefaultFocus
     @type boolean
     */
    isDefaultFocus: false,

    /**
     @property _keyLabel
     */
    _keyLabel: null,

    /**
     @property _formView
     */
    _formView: null,

    /*
     Gets the template and passes html elements to viewDidLoad().

     We dont know anything about the html elements nor should
     we make that assumption.
     */
    viewWillLoad: function () {
        var node = document.createElement('div'),
            keyLabelView = document.createElement('div'),
            formView = document.createElement('input');

        this.set('_keyLabel', keyLabelView);
        this.set('_formView', formView);

        this.viewDidLoad(node, keyLabelView, formView);
    },

    /*
     Has the html elements and passes them to viewWillAppear().

     We know about the html elements and can do some setup in here.
     Example: add disabled, hidden, etc className / adds alto object ids (maybe) / setup dynamic data and more...
     */
    viewDidLoad: function (node, keyLabelView, formView) {
        var that = this;

        node.className = "alto-key-form-view";
        keyLabelView.className = "key-label";
        formView.className = "form-view";

        var n = 0,
            classNames = this.get('keyLabelClassNames');
        while (n < classNames.length) {
            keyLabelView.className += keyLabelView.className ? ' ' + classNames[n] : classNames[n];
            n++;
        }

        n = 0;
        classNames = this.get('formViewClassNames');
        while (n < classNames.length) {
            formView.className += formView.className ? ' ' + classNames[n] : classNames[n];
            n++;
        }

        formView.addEventListener("input", function () {
            that.inputDidChange(that.get('_formView'))
        }, false);

        if (this.get('formValue')) {
            formView.value = this.get('formValue')
        }

        if (this.get('isDefaultFocus')) {
            formView.autofocus = true;
        }

        if (this.get('formType') === 'date') {
            formView.id = 'alto-date',
            formView.addEventListener("focus", function(){that.focus(that)}, false);
        }

        keyLabelView.textContent = this.get('keyLabelTitle');

        node.appendChild(keyLabelView);
        node.appendChild(formView);

        this.viewWillAppear(node);
    },

    inputDidChange: function (_formView) {
        this.set('formValue', _formView.value);

        if (!Alto.isEmpty(this.get('formType'))) {
            var formType = this.get('formType'),
                validateMethod = '_validate' + Alto.String.capitalize(formType);

            if (this[validateMethod]) {
                this[validateMethod](this.get('formValue'));
            }
        }
    },

    focus: function (_formView) {
        var APP = Alto.applicationName

        window[APP].statechart.dispatchEvent(this._hackedDateAction);
    },

    formValueDidChange: function () {
        if (Alto.isEmpty(this.get("formValue"))) {
            this.get('_formView').value = '';
            return
        }

        if (!Alto.isEmpty(this.get('formType'))) {
            var formType = this.get('formType'),
                validateMethod = '_validate' + Alto.String.capitalize(formType);

            if (this[validateMethod]) {
                this[validateMethod](this.get('formValue'));
            }
        }

        if (this.get('_formView').value === this.get('formValue')) {return}

        this.get('_formView').value = this.get('formValue');
    }.observes('this.formValue').on('init')

});