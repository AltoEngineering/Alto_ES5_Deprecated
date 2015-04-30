Alto.formValidationContainer = Alto.Object.create({

    activeFormsLookup: {},

    resetActiveFormsLookup: function () {
        this.set('activeFormsLookup', {});
    },

    validate: function() {
        var self = this,
            invalidForms =  Alto.keys(Alto.formValidationContainer.get('activeFormsLookup'));

        return new Alto.RSVP.Promise(function (succeeded, failed) {

            if (Alto.isEmpty(invalidForms)) {
                succeeded(true);
            } else {
                invalidForms.forEach(function (view) {
                    self.activeFormsLookup[view]._renderError();
                    Alto.Logger.error('Form validation failed for form ', self.activeFormsLookup[view].node, '.');
                })
                failed();
            }

        })

    }

});