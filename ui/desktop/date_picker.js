alto_require('frameworks/altojs/ui/shared/core_view.js');
alto_require('frameworks/altojs/ui/shared/view.js');
alto_require('frameworks/altojs/ui/shared/calendar_view_proper.js');

// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2014 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC
// ==========================================================================

/**
 `Alto.TextField` is a class used to create text inputs where an event handler is created to update on any changes.
 If nothing has been inputted, the default value is empty.

 One example of usage:

 ```javascript
 var sampleDatePicker = Alto.DatePicker.extend({
        hint: ""                   //shows text inside the text field
        isPassword: false          //sensors any input inside the text field
        value: null                //set the value inside the text field
        isDefaultFocus: false      //will focus on the text field when first loaded
 })
 ```

 @module UI
 @class Alto.DatePicker
 @extends Alto.TextField
 @since Alto 0.0.1
 @author Chad Eubanks
 */

Alto.DatePicker = Alto.CoreView.extend({

    inputClassNames: [],

    spanclassNames: [],

    buttonClassNames: [],

    calanderClassNames: [],

    selectedDate: '',

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
     Specifies the type an <input> element should be.  Example: `type: 'email'`.  The type not only sets the type
     dom element attirbute but it also drives the forms validation.
     @property type
     @type string
     */
    type: null,

    /**
     Gets the template and passes html elements to viewDidLoad().

     We dont know anything about the html elements nor should
     we make that assumption.

     @method viewWillLoad
     */
    viewWillLoad: function () {
        if (this.get("tag") == '') {
            Alto.Console.log('View class: ' + this + ' can not have an empty tag.', Alto.Console.errorColor);
            return;
        }

        var input = this.get("tag"),
            span,
            button;

        input = document.createElement(input);
        span = document.createElement('span')
        button = document.createElement('button')
        this.viewDidLoad(input, span, button);
    },

    /*
     Has the html elements and passes them to viewWillAppear().

     We know about the html elements and can do some setup in here.
     Example: add disabled, hidden, etc className / adds alto object ids (maybe) / setup dynamic data and more...
     */
    viewDidLoad: function (input, span, button) {
        var self = this,
            n = 0,
            inputClassNames = this.get('inputClassNames'),
            spanClassNames = this.get('spanclassNames'),
            buttonClassNames = this.get('buttonClassNames');

        if (input) {
            if (self.get('type')) {
                var activeFormsLookup = Alto.formValidationContainer.get('activeFormsLookup');

                input.type = this.get('type');
            }

            if (this.get('isRequired')) {
                activeFormsLookup[Alto.guidFor(this)] = this;
            }

            if (!Alto.isEmpty(this.get("value"))) {
                input.value = this.get('value');
            }

            if (!Alto.isEmpty(this.get("hint"))) {
                input.placeholder = this.get('hint');
            }

            while (n < inputClassNames.length) {
                input.className += input.className ? ' ' + inputClassNames[n] : inputClassNames[n];
                n++;
            }

            input.addEventListener("focus", function () {
                self._focus(self)
            }, false);

        }

        if (span) {
            n = 0;

            while (n < spanClassNames.length) {
                span.className += span.className ? ' ' + spanClassNames[n] : spanClassNames[n];
                n++;
            }
        }

        if (button) {
            n = 0;

            while (n < buttonClassNames.length) {
                button.className += button.className ? ' ' + buttonClassNames[n] : buttonClassNames[n];
                n++;
            }
        }

        span.appendChild(button);
        input.appendChild(span);

        this.set('node', input);

        this._super(input);
    },

    _focus: function (self) {
        if (!self.get('_calendarPane')) {
            self.node.disabled = true;
            self._displayDatePicker(self)
        }
    },

    _displayDatePicker: function () {
        this.set('_calendarPane', this.calendarPane.createWithMixins({attachToNode: 'body', parentView: this}));

        if (this.get('selectedDate')) {
            this._calendarPane.datePickerFrame.calendarView.set('_displayMonth', new Date(Date.parse(this.get('selectedDate'))));
        }
    },

    _calendarPane: null,

    calendarPane: Alto.View.extend({
        classNames: ['calendar-pane'],
        childViews: ['datePickerFrame'],
        layerId: 'model-frame',

        parentView: null,

        preventDefault: false,

        viewDidLoad: function (node) {
            this._super(node);
            var that = this

            node.addEventListener("click", function () {
                that.click(that)
            }, false);

            this.viewWillAppear(node);
        },

        click: function () {
            if (!this.get('preventDefault')) {
                this.parentView.get('_calendarPane').node.parentNode.removeChild( this.parentView.get('_calendarPane').node);
                this.parentView.set('_calendarPane', null);
                this.parentView.node.disabled = false;
            }
            this.set('preventDefault', false);
        },

        datePickerFrame: Alto.View.extend({
            classNamesBinding: 'this.parentView.parentView.calanderClassNames',
            childViews: ['calendarView'],

            viewDidLoad: function (node) {
                var n = 0,
                    classNames = this.get('classNames'),
                    that = this;

                while (n < classNames.length) {
                    node.className += node.className ? ' ' + classNames[n] : classNames[n];
                    n++;
                }

                node.className += ' dob-date-picker-frame';

                node.addEventListener("click", function () {
                    that.click(that)
                }, false);
                this._super(node);

                this.viewWillAppear(node);
            },

            click: function () {
                this.parentView.set('preventDefault', true);
            },

            calendarView: Alto.CalendarViewProper.extend({
                classNames: ['dob-date-picker'],
                selectedDateBinding: 'this.parentView.parentView.parentView.selectedDate'
            })

        })

    }),

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