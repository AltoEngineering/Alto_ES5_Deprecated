// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Author: Chad Eubanks
// Copyright: @2014 The Code Boutique, LLC
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

Alto.Statechart = Alto.Object.extend ({

    currentState: "",

    init: function () {
        this._super();
    },

    /*
        Examaple: TCB.Statechart.sendEvent('method_name');
    */
    dispatchEvent: function(eventName) {
        var APP = Alto.applicationName,
            state = window[APP].Statechart.currentState,
            args = Array.prototype.slice.call(arguments),
            message = "Unknown method name: Your state is missing the method \"" + eventName + "\".";

        args.shift();

        if (!window[APP][state]) {return}

        if (window[APP][state][eventName]) {
            window[APP][state][eventName].apply(this, args);
        } else {
            Alto.console.log(message, Alto.console.errorColor);
        }

    },

    goToState: function (state) {
        var APP = Alto.applicationName;

        // If we are already in a state, call is exitState before transitioning
        if (window[APP].Statechart.get("currentState") != "") {

            if (window[APP].LogStateTransitions) {
                var message = "Exiting " + window[APP].Statechart.get("currentState");
                Alto.console.log(message, Alto.console.warnColor);
            }

            window[APP][window[APP].Statechart.get("currentState")].exitState();
        }

        // Handle an attempt to enter a non existent state
        if (!window[APP][state]) {
            var message = "Can not find state " + state + ". Check your applications router and declared states.";
            Alto.console.log(message, Alto.console.errorColor);
        } else {
            window[APP].Statechart.set("currentState", state);

            if (window[APP].LogStateTransitions) {
                var message = "Entering " + window[APP].Statechart.get("currentState");
                Alto.console.log(message, Alto.console.messageColor);
            }

            window[APP][state].enterState();
        }
    },

    stateDidChange: function() {

    }.observes('currentState')

});