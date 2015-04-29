Alto.formValidationMixin = Alto.Mixin.create({

    // expects a input to be this.node

    _formPassedValidation: false,

    _renderError: function () {
        var node = this.get('node');
        node.classList.remove('alto-invalid-form');
        node.className += ' alto-invalid-form';
    },

    _validateEmail: function (email) {
        var emailPattern = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

        this.set('_formPassedValidation', emailPattern.test(email))
    },

    _validatePassword: function (password) {
        this.set('_formPassedValidation', !Alto.isEmpty(password))
    },

    _formPassedValidationDidChange: function () {
        if (this.get('_formPassedValidation')) {
            delete Alto.formValidationContainer.get('activeFormsLookup')[Alto.guidFor(this)];
            this.node.classList.remove('alto-invalid-form');
        } else {
            if (!Alto.formValidationContainer.get('activeFormsLookup')[Alto.guidFor(this)]) {
                var activeFormsLookup = Alto.formValidationContainer.get('activeFormsLookup');

                activeFormsLookup[Alto.guidFor(this)] = this;
            }
        }
    }.observes('_formPassedValidation').on('init')

});