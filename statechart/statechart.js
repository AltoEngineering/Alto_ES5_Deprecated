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
     Current state the application is in.
     @property currentState
     */
    currentState: "",

    /**
     Current substate the application is in.
     @property currentSubState
     */
    currentSubState: "",

    dispatchViewEvent: function (eventName) {
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
        } else if (window[APP][state].viewState[eventName]) {
            window[APP][state].viewState[eventName].apply(this, args);
        } else {
            Alto.Console.log(message, Alto.Console.errorColor);
        }

    },

    /**
     Takes function parameter and executes that event.

     Example:
     ```javascript
     window[APP].statechart.dispathEvent('function')
     ```
     @method dispatchEvent
     @param function
     @type String
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
        } else if (window[APP][state].viewState[eventName]) {
            window[APP][state].viewState[eventName].apply(this, args);
        }  else {
            Alto.Console.log(message, Alto.Console.errorColor);
        }

    },

    /**
     Leaves current state and routes to a new state.

     Example:
     ```javascript
     window[APP].statechart.goToState('newState')
     ```
     @method goToState
     @type String
     @param stateName
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
        if (!window[APP][state.classify()]) {
            var message = "Can not find state " + state + ".";
            Alto.Console.log(message, Alto.Console.errorColor);
        } else {

            if (!window[APP][state]) {
                window[APP][state] = window[APP][state.classify()].create();
            }

            window[APP].statechart.set("currentState", state.camelize());

            if (window[APP].LogStateTransitions) {
                var message = "Entering " + window[APP].statechart.get("currentState");
                Alto.Console.log(message, Alto.Console.messageColor);
            }

            window[Alto.applicationName].statechart.set('currentSubState', '');
            window[APP][state.camelize()].enterState();
        }
    },

    /**
     Leaves current substate (if present) and routes to new substate. Still retains parent state.

     Example:
     ```javascript
     window[APP].statechart.goToSubState('newSubState')
     ```
     @method goToSubState
     @param substate
     @type String
     */
    goToSubState: function (substate) {
        // check if the current state has the substate
        // enter the substate
        // set the statecharts current substate
        var APP = Alto.applicationName,
            currentState  = window[APP].statechart.get("currentState"),
            currentSubstate = window[APP].statechart.get("currentSubState");

        if (Alto.isPresent(currentSubstate)) {window[APP].statechart.leaveCurrentSubState();}

        if (window[APP][currentState][substate]) {
            window[APP][substate] =  window[APP][currentState][substate].create();

            window[APP].statechart.set("currentSubState", substate);

            if (window[APP].LogStateTransitions) {
                var message = "Entering substate " + window[APP].statechart.get("currentSubState");
                Alto.Console.log(message, Alto.Console.messageColor);
            }

            window[APP][substate].enterState();

        } else if (window[APP][currentSubstate][substate]) {
            window[APP][substate] =  window[APP][currentSubstate][substate].create();

            window[APP].statechart.leaveCurrentSubState();

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

    /**
     Explicitly leaves current substate and will display to console. However, `leaveCurrentSubState` is implicitly
     performed during `goToState` and `goToSubState` methods.

     Example:
     ```javascript
     window[APP].statechart.leaveCurrentSubState();
     ```
     @method leaveCurrentSubState
     */
    leaveCurrentSubState: function() {
        var APP = Alto.applicationName,
            substate = window[APP].statechart.get("currentSubState");

        if (window[APP].LogStateTransitions) {
            var message = "Exiting substate " + substate;
            Alto.Console.log(message, Alto.Console.warnColor);
        }

        window[APP][substate].exitState();

        window[APP].statechart.set("currentSubState", null);
    }

});