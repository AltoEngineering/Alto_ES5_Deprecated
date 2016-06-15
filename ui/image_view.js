alto_require('frameworks/shared/altojs/ui/core_view.js');

// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2014 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC
// ==========================================================================

/**
 `Alto.ImageView` is a component for uploading an image into your project. You can either use a local file or valid URL.

 @module UI
 @class Alto.ImageView
 @extends Alto.CoreView
 @since Alto 0.0.1
 @author Chad Eubanks
 */

Alto.ImageView = Alto.CoreView.extend ({

    tag: "img",

    /**
     * Full path source image used to display image.
     * @property src
     * @type String
     */
    src: "",

    /*
     Has the html elements and passes them to viewWillAppear().

     We know about the html elements and can do some setup in here.
     Example: add disabled, hidden, etc className / adds alto object ids (maybe) / setup dynamic data and more...
     */
    viewDidLoad: function(node) {
        if (node) {
            if (this.get("src")) {
                node.src = this.get("src");
            }
        }

        this._super(node);
    },

    srcDidChange: Alto.observer('src', function() {
        this.node.src = this.get("src");
    })

});