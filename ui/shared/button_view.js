// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2014 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC
// ==========================================================================

/**
 Gives logging to your console some color.

 @module UI
 @class Alto.ButtonView
 @extends Alto.CoreView
 @since Alto 0.0.1
 @author Chad Eubanks
 */

Alto.ButtonView = Alto.CoreView.extend ({

    tag: "button",

    title: "",

    action: "",

    leftIcon: null,

    rightIcon: null,

    tabbedIcon: null,

    /*
     Has the html elements and passes them to viewWillAppear().

     We know about the html elements and can do some setup in here.
     Example: add disabled, hidden, etc className / adds alto object ids / setup dynamic data and more...
     */
    viewDidLoad: function(node) {
        var that = this;

        if (node) {
            node.addEventListener("click", function(){that.click(that) }, false);

            if (this.get('leftIcon')) {
                var span = document.createElement('span'),
                    img = document.createElement('img');

                node.className += 'alto-text-button-left-icon '
                img.src = this.get('leftIcon');
                span.innerHTML = this.get("this.title");

                node.appendChild(img);
                node.appendChild(span);
            } else if (this.get('rightIcon')) {
                var span = document.createElement('span'),
                    img = document.createElement('img');

                node.className += 'alto-text-button-right-icon '
                img.src = this.get('rightIcon');
                span.innerHTML = this.get("this.title");

                node.appendChild(span);
                node.appendChild(img);
            } else if (this.get('tabbedIcon')) {
                var span = document.createElement('span'),
                    img = document.createElement('img');

                node.className += 'alto-tabbed-button '
                img.src = this.get('tabbedIcon');
                span.innerHTML = this.get("this.title");

                node.appendChild(img);
                node.appendChild(span);
            } else {
                node.innerHTML = this.get("this.title");
            }

        }

        this._super(node);
    },

    click: function(buttonView) {
        var APP = Alto.applicationName

        window[APP].statechart.dispatchEvent(buttonView.action, this);
    },

    titleDidChange: function() {
        this.node.innerHTML = this.get("this.title");
    }.observes('this.title')

});