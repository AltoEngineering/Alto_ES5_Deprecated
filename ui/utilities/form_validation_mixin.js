Alto.formValidationMixin = Alto.Mixin.create({

    isRequired: true,

    _formPassedValidation: false,

    _renderError: function () {
        var node = this.get('node');

        if (this.get('isTextField')) {
            node.classList.remove('alto-invalid-form');
            node.className += ' alto-invalid-form';
        } else if (this.get('isKeyFormView')) {
            node.children[1].classList.remove('alto-invalid-form');
            node.children[1].className += ' alto-invalid-form';
        }

    },

    _removeRenderedError: function () {
        var node = this.get('node');

        if (this.get('isTextField')) {
            node.classList.remove('alto-invalid-form');
        } else if (this.get('isKeyFormView')) {
            node.children[1].classList.remove('alto-invalid-form');
        }
    },

    _validateEmail: function (email) {
        var emailPattern = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

        this.set('_formPassedValidation', emailPattern.test(email));
    },

    _validatePassword: function (password) {
        this.set('_formPassedValidation', !Alto.isEmpty(password));
    },

    _validateText:  function (text) {
        this.set('_formPassedValidation', !Alto.isEmpty(text));
    },

    _validatePhone:  function (phone) {
        this.set('_formPassedValidation', !Alto.isEmpty(phone));
    },

    _validateDate:  function (date) {
        this.set('_formPassedValidation', !Alto.isEmpty(date));
    },

    _validateSocialsecurity:  function (socialsecurity) {
        var socialsecurityPattern = socialsecurity.contains('*') ? /^[\*]{3}-[\*]{2}-\d{4}$/ : /^[\d]{3}-[\d]{2}-\d{4}$/;

        this.set('_formPassedValidation', socialsecurity.match(socialsecurityPattern));
    },

    _formPassedValidationDidChange: function () {
        if (this.get('_formPassedValidation')) {
            delete Alto.formValidationContainer.get('activeFormsLookup')[Alto.guidFor(this)];
            this._removeRenderedError();
        } else {
            if (!Alto.formValidationContainer.get('activeFormsLookup')[Alto.guidFor(this)]) {
                var activeFormsLookup = Alto.formValidationContainer.get('activeFormsLookup');

                if (this.get('isRequired')) {
                    activeFormsLookup[Alto.guidFor(this)] = this;
                }
            }
        }
    }.observes('_formPassedValidation').on('init')

});