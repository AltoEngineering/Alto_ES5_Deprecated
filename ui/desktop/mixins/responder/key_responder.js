Alto.KeyResponderMixin = Alto.Mixin.create({

    keyResponder: null,

    _keyResponder: function(event) {
        if (!this.get('keyResponder')) {return};

        if (event.keyCode == 27) {
            window[Alto.applicationName].statechart.dispatchViewEvent(this.keyResponder.get('cancelAction'));
        }

    }

});