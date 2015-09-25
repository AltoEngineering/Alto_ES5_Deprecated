Alto.KeyResponderMixin = Alto.Mixin.create({

    keyResponder: null,

    _keyResponder: function(event) {
        if (!this.get('keyResponder')) {return};

        if (event.keyCode == 27) {
            if (Alto.isNone(this.keyResponder.get('cancelAction'))) {return}
            window[Alto.applicationName].statechart.dispatchViewEvent(this.keyResponder.get('cancelAction'));
        } else if (event.keyCode == 13) {
            if (Alto.isNone(this.keyResponder.get('saveAction'))) {return}
            window[Alto.applicationName].statechart.dispatchViewEvent(this.keyResponder.get('saveAction'));
        }
    }

});