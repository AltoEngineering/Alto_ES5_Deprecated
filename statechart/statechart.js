// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2014 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC
// ==========================================================================

/**
 An application will have one StateChart.  When your application initalizes, a StateChart singleton scoped to your
 application name is created for you.

 @module Statechart
 @class Alto.Statechart
 @extends Alto.Object
 @since Alto 0.0.1
 @author Chad Eubanks
 */


Alto.Statechart = Alto.Object.extend ({

    /**
        @property currentState
    */
    currentState: "",

    /**
        @method dispatchEvent
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
            Alto.Console.log(message, Alto.Console.errorColor);
        }

    },

    /**
        @method goToState
    */
    goToState: function (state) {
        var APP = Alto.applicationName;

        // If we are already in a state, call is exitState before transitioning
        if (window[APP].Statechart.get("currentState") != "") {

            if (window[APP].LogStateTransitions) {
                var message = "Exiting " + window[APP].Statechart.get("currentState");
                Alto.Console.log(message, Alto.Console.warnColor);
            }

            window[APP][window[APP].Statechart.get("currentState")].exitState();
        }

        // Handle an attempt to enter a non existent state
        if (!window[APP][state]) {
            var message = "Can not find state " + state + ". Check your applications router and declared states.";
            Alto.Console.log(message, Alto.Console.errorColor);
        } else {
            window[APP].Statechart.set("currentState", state);

            if (window[APP].LogStateTransitions) {
                var message = "Entering " + window[APP].Statechart.get("currentState");
                Alto.Console.log(message, Alto.Console.messageColor);
            }

            window[APP][state].enterState();
        }
    }

});