// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2015 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC
// ==========================================================================

/**
    Base pane class.

 @module UI
 @class Alto.Pane
 @extends Alto.CoreView
 @since Alto 0.0.2
 @internal-version 0.0.1
 @author Chad Eubanks and Miguel Chateloin
 */

Alto.Pane = Alto.CoreView.extend({
    classNames: ['alto-pane'],

    isPane: true,

    tag: 'div'

});