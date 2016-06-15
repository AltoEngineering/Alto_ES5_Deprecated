alto_require('frameworks/shared/altojs/statechart/statechart.js');

// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2014 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC
// ==========================================================================

/**
 A state object is used as a communication point between all of your applications components.

 @module Statechart
 @class Alto.State
 @extends Alto.Object
 @since Alto 0.0.1
 @author Chad Eubanks
 */

Alto.State = Alto.Object.extend ({

    /**
     @method enterState
     */
    enterState: function () {},

    /**
     @method exitState
     */
    exitState: function () {}

});