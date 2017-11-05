import CoreObject from '../foundation/core_object.js';
import Console from '../foundation/console.js';
import generateGuid from '../foundation/guid.js';

// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2017 The Code Boutique, LLC
// License:   MIT License (see license for details)
// Author: Chad Eubanks
// ==========================================================================

let Statechart = class Statechart extends CoreObject {

    static toString() {
        return 'Alto.Statechart'
    }

    static create(...args) {
        const instance = Object.assign(new Statechart(), this, ...args);
        instance.guid = generateGuid();
        delete instance.create;
        instance.init();
        return instance;
    }

    static extend(...args) {
        const instance = new Statechart();
        instance.create = this.create;
        return Object.assign(instance, ...args);
    }

};

Statechart = Statechart.create({

    currentState: null,

    currentSubState: null,

    dispatchEvent: (event, ...args) => {
        let currenState = window.Alto.applicationInstance.statechart.get("currentState"),
            currenSubState = window.Alto.applicationInstance.statechart.get("currenSubState");

        if (currenSubState && currenSubState[event]) {
            currenSubState[event](...args);
        } else if (currenState && currenState[event]) {
            currenState[event](...args);
        } else {
            Console.log(`Malformed event given. ${event} can not be found on the current substate or state.`, Console.errorColor);
        }
    },

    goToState: (state) => {
        let currenState = window.Alto.applicationInstance.statechart.get("currentState"),
            currenSubState = window.Alto.applicationInstance.statechart.get("currenSubState");

        if (window.Alto.isEqual(state, currenState)) {return}

        if (currenState && currenSubState) {
            if (window.Alto.applicationInstance.logStateTransitions) {
                Console.log(`   Exiting ${currenSubState.toString()}`, Console.warnColor);
                Console.log(`Exiting ${currenState.toString()}`, Console.warnColor);
            }

            window.Alto.applicationInstance.statechart.set('currenSubState', null);
            currenSubState.exitState();

            window.Alto.applicationInstance.statechart.set('currenState', null);
            currenState.exitState();
        } else if (currenState) {
            if (window.Alto.applicationInstance.logStateTransitions) {
                Console.log(`Exiting ${currenState.toString()}`, Console.warnColor);
            }

            window.Alto.applicationInstance.statechart.set('currenSubState', null);
            currenState.exitState();
        }

        if (window.Alto.applicationInstance.logStateTransitions) {
            Console.log(`Entering ${state.toString()}`, Console.messageColor);
        }

        window.Alto.applicationInstance.statechart.set('currentState', state);
        state.enterState();

    },

    goToSubState: (substate) => {
        let currenSubState = window.Alto.applicationInstance.statechart.get("currenSubState");

        if (currenSubState) {
            if (window.Alto.applicationInstance.logStateTransitions) {
                Console.log(`   Exiting ${currenSubState.toString()}`, Console.warnColor);
            }

            window.Alto.applicationInstance.statechart.set('currenSubState', null);
            currenSubState.exitState();
        }

        if (window.Alto.applicationInstance.logStateTransitions) {
            Console.log(`   Entering ${substate.toString()}`, Console.messageColor);
        }

        window.Alto.applicationInstance.statechart.set('currenSubState', substate);
        substate.enterState();
    }

});

export default Statechart;