import Alto from '../../core.js';
import CoreView from './core_view.js';

// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2017 The Code Boutique, LLC
// License:   MIT License (see license for details)
// Author: Chad Eubanks
// ==========================================================================

let TextFieldView = CoreView.extend({

    isTextFieldView: true,

    animateHint: false,

    animationTiming: 0.13209420901,

    hint: '',

    isDefaultFocus: false,

    maxLength: 5096,

    type: null,

    value: '',

    init: function(html) {
        this.viewWillLoad(html);
    },

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

    viewDidLoad(input, hint, animatedInputWrapper) {
        let self = this, node;

        if (Alto.isPresent(input)) {

            let classNames = this.get('classNames'),
                id = this.get('layerId'),
                isVisible = this.get('isVisible');

            if (Alto.isPresent(classNames)) {
                classNames.forEach(function (className) {
                    input.classList.add(className);
                })
            }

            if (Alto.isPresent(id)) {
                input.id = id;
            }

            if (!isVisible) {
                input.classList.add('hidden');
            }

            input.addEventListener('input', function () {
                self.inputDidChange()
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
                   // this.animateHintToModifiedState(0, hint);
                }
            } else {
                if (this.get('animateHint')) {
                    // this.animateHintToNormalState(0); //

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
                }
            }

            if (this.get('animateHint')) {
                // do nothing
            } else {
                if (this.get('type')) {
                    input.type = this.get('type');
                }

                input.placeholder = this.get('hint');
                node = input;
            }

        } else {
            Alto.Console.error(`ViewDidLoad was invoked without passing a html element as an argument.  View can not be created.`);
            return;
        }

        this.viewWillAppear(node);
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
                let position = this.node.selectionStart;
                this.set('value', this.node.value);
                this.node.selectionEnd = position;
            }
        }
    },

    valueDidChange: function() {
        if (Alto.isPresent(this.node)) {
            if (Alto.isEmpty(this.get('value'))) {
                this.node.value = '';

                return
            }

            if (this.node.value === this.get('value')) {
                return
            }

            this.node.value = this.get('value');
        }

    }

});

export default TextFieldView;