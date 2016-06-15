alto_require('frameworks/shared/altojs/ui/core_view.js');

// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2014 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC
// ==========================================================================

/**
 Gives logging to your console some color.

 @module UI
 @class Alto.LinkView
 @extends Alto.CoreView
 @since Alto 0.0.1
 @author Chad Eubanks
 */

Alto.LinkView = Alto.CoreView.extend({

    tag: "a",
    /**
     The complete path name for the destination of the link.
     @property href
     @type String
     */
    href: "",

    /**
     Set the title of the link.
     @property title
     @type String
     */

    title: "",

    /**
     Set the target of the link.
     @property target
     @type Boolean
     */

    openInNewWindow: true,

    /*
     Has the html elements and passes them to viewWillAppear().

     We know about the html elements and can do some setup in here.
     Example: add disabled, hidden, etc className / adds alto object ids (maybe) / setup dynamic data and more...
     */
    viewDidLoad: function (node) {
        if (node) {
            if (!Alto.isEmpty(this.get("title"))) {
                node.innerHTML = this.get("title");
            }

            if (!Alto.isEmpty(this.get('href'))) {
                node.href = 'http://%@'.fmt(this.get('href'));
            } else if (!Alto.isEmpty(this.get('parentView.data.link'))) {
                node.href = 'http://%@'.fmt(this.get('parentView.data.link'));
            }

            if (this.get('openInNewWindow')) {
                node.target = "_blank"
            }
        }

        this._super(node);
    },

    titleDidChange: function () {
        if (Alto.isEmpty(this.get("title"))) {
            this.node.innerHTML = "";
            return;
        }
        this.node.innerHTML = this.get("title");
    }.observes('this.title'),

    hrefDidChange: function () {
        if (Alto.isEmpty(this.get("href"))) {
            node.href = "";
            return;
        }
        node.href = this.get('href');
    }.observes('this.href')

});