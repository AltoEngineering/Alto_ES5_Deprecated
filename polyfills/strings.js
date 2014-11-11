// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2014 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC
// ==========================================================================

/**
 Extends the native javascript string object.

 @module JavaScript prototype
 @class String.prototype
 @extends String
 @since Alto 0.0.1
 @author Chad Eubanks
 */


/**
    @method contains
*/
if ( !String.prototype.contains ) {
    String.prototype.contains = function() {
        return String.prototype.indexOf.apply( this, arguments ) !== -1;
    };
}