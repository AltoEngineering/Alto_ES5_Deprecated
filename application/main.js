// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2014 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC
// ==========================================================================

/**
 Alto.main starts the initialization of your application.  You should not call this directly nor should you modify this
 method.

 @since Alto 0.0.1
 @author Chad Eubanks
 */

Alto.main = function() {
    var APP = window.Alto.applicationName;
    window[APP].applicationDidLoad();
}
Alto.main();
