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


Alto.Statechart = Alto.Object.extend({

    /**
     @property currentState
     */
    currentState: "",

    /**
     @property currentSubState
     */
    currentSubState: "",

    /**
     @method dispatchEvent
     */
    dispatchEvent: function (eventName) {
        var APP = Alto.applicationName,
            state = window[APP].statechart.currentState,
            substate = window[APP].statechart.currentSubState,
            args = Array.prototype.slice.call(arguments),
            message = "Unknown method name: Your state is missing the method \"" + eventName + "\".";

        args.shift();

        if (!window[APP][state]) {
            return
        }

        if (window[APP][substate] && window[APP][substate][eventName]) {
            window[APP][substate][eventName].apply(this, args);
        } else if (window[APP][state][eventName]) {
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
        if (window[APP].statechart.get("currentState") != "") {

            if (window[APP].LogStateTransitions) {
                var message = "Exiting " + window[APP].statechart.get("currentState");
                Alto.Console.log(message, Alto.Console.warnColor);
            }

            window[APP][window[APP].statechart.get("currentState")].exitState();
        }

        // Handle an attempt to enter a non existent state
        if (!window[APP][state]) {
            var message = "Can not find state " + state + ". Check your applications router and declared states.";
            Alto.Console.log(message, Alto.Console.errorColor);
        } else {
            window[APP].statechart.set("currentState", state);

            if (window[APP].LogStateTransitions) {
                var message = "Entering " + window[APP].statechart.get("currentState");
                Alto.Console.log(message, Alto.Console.messageColor);
            }

            window[APP][state].enterState();
        }
    },

    /**
     @method goToSubState
     */
    goToSubState: function (substate) {
        // check if the current state has the substate
        // enter the substate
        // set the statecharts current substate
        var APP = Alto.applicationName,
            currentState  = window[APP].statechart.get("currentState");

        if (window[APP][currentState][substate]) {
            window[APP][substate] =  window[APP][currentState][substate].create();

            window[APP].statechart.set("currentSubState", substate);

            if (window[APP].LogStateTransitions) {
                var message = "Entering substate " + window[APP].statechart.get("currentSubState");
                Alto.Console.log(message, Alto.Console.messageColor);
            }

            window[APP][substate].enterState();

        } else {
            Alto.Logger.error('Substate', substate, 'not found in parent state');
        }

    },

    leaveCurrentSubState: function() {
        var APP = Alto.applicationName,
            substate = window[APP].statechart.get("currentSubState");

        if (window[APP].LogStateTransitions) {
            var message = "Exiting substate " + substate;
            Alto.Console.log(message, Alto.Console.warnColor);
        }

        window[APP].statechart.set("currentSubState", null);

        window[APP][substate].exitState();
    }

});