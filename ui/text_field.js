alto_require('frameworks/shared/altojs/ui/core_view.js');
alto_require('frameworks/shared/altojs/ui/animate/animate.js');

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

Alto.TextField = Alto.CoreView.extend({

    animationTiming: 0.13209420901,

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

    animateHint: false,

    _animatedHintState: 'normal',

    /**
     Gets the view's tag and creates html elements.  Once html elements are create.  We pass them to viewDidLoad().

     We dont know anything about the html elements nor should we make that assumption.

     @method viewWillLoad
     */
    viewWillLoad: function () {
        var input,
            hint,
            animatedInputWrapper;

        if (this.get('animateHint')) {
            input = document.createElement('input');
            hint = document.createElement('label');
            animatedInputWrapper = document.createElement('div');
        } else {
            input = document.createElement('input');
        }

        this.viewDidLoad(input, hint, animatedInputWrapper);
    },

    /**
     Has the html elements and passes them to viewWillAppear().

     We know about the html elements and can do some setup in here.
     Example: add disabled, hidden, className / setup dynamic data and more...

     @method viewDidLoad
     */
    viewDidLoad: function (input, hint, animatedInputWrapper) {
        var that = this,
            node;

        input.addEventListener('input', function () {
            that.inputDidChange()
        }, false);

        if (this.get('maxLength')) {
            input.maxLength = this.get('maxLength');
        }

        if (this.get('isDefaultFocus')) {
            input.autofocus = true;
        }

        if (Alto.isPresent(this.get('value'))) {
            input.value = this.get('value');

            if (this.get('animateHint')) {
                if (this.get('type')) {
                    input.type = this.get('type');
                }

                hint.className = 'hint';
                input.className = 'animated-input';
                animatedInputWrapper.className = 'animated-input-wrapper';

                animatedInputWrapper.appendChild(hint);
                animatedInputWrapper.appendChild(input);
                node = animatedInputWrapper;
                this._super(node);
                this.animateHintToModifiedState(0, hint);
            }
        } else {
            if (this.get('animateHint')) {
                this.animateHintToNormalState(0);

                if (this.get('type')) {
                    input.type = this.get('type');
                }
                hint.className = 'hint';
                input.className = 'animated-input';
                animatedInputWrapper.className = 'animated-input-wrapper';
                hint.innerText = this.get('hint');

                animatedInputWrapper.appendChild(hint);
                animatedInputWrapper.appendChild(input);
                node = animatedInputWrapper;
                this._super(node);
            }
        }


        if (this.get('animateHint')) {
            // do nothing
        } else {
            if (this.get('type')) {
                input.type = this.get('type');
            }

            input.placeholder = this.get('hint');
            input.className = 'input';
            node = input;
            this._super(node);
        }

    },

    inputDidChange: function () {
        if (this.get('animateHint')) {
            if (this.node.childNodes[1].value.length > this.get('maxLength')) {
                this.node.childNodes[1].value = this.get('value');
            } else {
                this.set('value', this.node.childNodes[1].value);
            }
        } else {
            if (this.node.value.length > this.get('maxLength')) {
                this.node.value = this.get('value');
            } else {
                this.set('value', this.node.value);
            }
        }
    },

    valueDidChange: function () {
        if (Alto.isEmpty(this.get('value'))) {

            if (this.get('animateHint')) {
                this.node.childNodes[1].value = '';
                this.animateHintToNormalState();
            } else {
                this.node.value = '';
            }

            return
        }

        if (this.node.value === this.get('value')) {
            return
        }

        if (this.get('animateHint')) {
            this.animateHintToModifiedState(this.get('animationTiming'));
            this.node.childNodes[1].value = this.get('value');
        } else {
            this.node.value = this.get('value');
        }
    }.observes('this.value'),

    animateHintToNormalState: function () {
        var that = this;

        this.set('_animatedHintState', 'normal');
        Alto.run.next(function () {
            Alto.animate.textfieldNormalState(that.node.children[0]);
        });
    },

    animateHintToModifiedState: function (duration, hint) {
        var that = this;


        if (Alto.isEqual(this.get('_animatedHintState'), 'modified')) {
            return
        }

        this.set('_animatedHintState', 'modified');

        if (!duration) {
            this.node.children[0].style.transform = 'translate3d(-6%, -70%, 0) scale(0.80)';
            this.node.children[0].style.webkitTransform = 'translate3d(-6%, -70%, 0) scale(0.80)';
            this.node.children[0].style.mozTransform = 'translate3d(-6%, -70%, 0) scale(0.80)';
            this.node.children[0].style.transitionDuration = '%@s'.fmt(0);
            this.node.children[0].style.transitionTimingFunction = 'ease-in-out';
            this.node.children[0].className += ' modified-hint-state';

            hint.innerText = this.get('hint');
        } else {
            Alto.run.next(function () {
                Alto.animate.textfieldModifiedState(that.node.children[0], duration);
            });
        }
    }


});

