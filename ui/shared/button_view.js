// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2014 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC
// ==========================================================================

/**
 An `Alto.ButtonView` is an instance that implements a button view. This class provides methods for setting the title,
 target action, and an icon. Icon positioning can use one of three types (leftIcon, rightIcon, and tabbedIcon).
 Using these methods, you can specify a different appearance for each button state.

 A simple example of usage:

 ```javascript
 button: Alto.ButtonView.extend({
    title: 'Submit',
    rightIcon: 'url',                        //path to image
    action: 'goToUrl'
})
 ```


 @class Alto.ButtonView
 @extends Alto.CoreView
 @since Alto 0.0.1
 @author Chad Eubanks
 */

Alto.ButtonView = Alto.CoreView.extend({

    tag: "button",

    /**
     Sets the title of the button.

     @property title
     @type String
     */
    title: "",

    /**
     The action that is fired after the button is clicked.

     @property action
     @type String
     */
    action: "",

    /**
     Sets an icon image to the left of the button. Provide the path of the image inside your project or any valid URL.

     @property leftIcon
     @type String
     @default null
     */
    leftIcon: null,

    /**
     Sets an icon image to the right of the button. Provide the path of the image inside your project or any valid URL.

     @property rightIcon
     @type String
     @default null
     */
    rightIcon: null,

    /**
     Sets an icon image to a tabbed buton. Provide the path of the image inside your project or any valid URL.

     @property tabbedIcon
     @type String
     @default null
     */
    tabbedIcon: null,

    /*
     Has the html elements and passes them to viewWillAppear().

     We know about the html elements and can do some setup in here.
     Example: add disabled, hidden, etc className / adds alto object ids / setup dynamic data and more...
     */
    viewDidLoad: function (node) {
        var that = this;

        if (node) {
            node.addEventListener("click", function () {
                that.click(that)
            }, false);

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

    click: function (buttonView) {
        var APP = Alto.applicationName

        window[APP].statechart.dispatchEvent(buttonView.action, this);
    },

    titleDidChange: function () {
        this.node.innerHTML = this.get("this.title");
    }.observes('this.title')

});