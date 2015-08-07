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

    stopPropagation: false,

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

    /**
     When set to true, overrides default behavior of internal click method to check the  `Alto.formValidationContainer`
     for any invalid forms.

     @property doValidateForms
     @type Bool
     @default false
     */
    doValidateForms: false,

    /**
     When set to true, overrides default behavior of internal click method to reset the  `Alto.formValidationContainer`
     to an empty `{}`.

     @property doResetFormValidationContainer
     @type Bool
     @default false
     */
    doResetFormValidationContainer: false,

    /*
     Has the html elements and passes them to viewWillAppear().

     We know about the html elements and can do some setup in here.
     Example: add disabled, hidden, etc className / adds alto object ids / setup dynamic data and more...
     */
    viewDidLoad: function (node) {
        var that = this;

        if (node) {
            node.addEventListener("click", function (e) {


                if (that.get('stopPropagation')) {
                    if (!e)
                        e = window.event;

                    //IE9 & Other Browsers
                    if (e.stopPropagation) {
                        e.stopPropagation();
                    }
                    //IE8 and Lower
                    else {
                        e.cancelBubble = true;
                    }
                }

                that.click(that)
            }, false);

            if (this.get('leftIcon')) {
                var span = document.createElement('span'),
                    img = document.createElement('img');

                node.className += 'alto-text-button-left-icon '
                img.src = this.get('leftIcon');
                span.innerHTML = this.get('title');

                node.appendChild(img);
                node.appendChild(span);
            } else if (this.get('rightIcon')) {
                var span = document.createElement('span'),
                    img = document.createElement('img');

                node.className += 'alto-text-button-right-icon '
                img.src = this.get('rightIcon');
                span.innerHTML = this.get('title');

                node.appendChild(span);
                node.appendChild(img);
            } else if (this.get('tabbedIcon')) {
                var span = document.createElement('span'),
                    img = document.createElement('img');

                node.className += 'alto-tabbed-button '
                img.src = this.get('tabbedIcon');
                span.innerHTML = this.get('title');

                node.appendChild(img);
                node.appendChild(span);
            } else {
                node.innerHTML = this.get('title');
            }

        }

        this._super(node);
    },

    click: function (buttonView) {
        var APP = Alto.applicationName;

        if (this.get('doResetFormValidationContainer')) {
            Alto.formValidationContainer.resetActiveFormsLookup();
        }

        if (this.get('doValidateForms')) {

            Alto.formValidationContainer.validate().then(function(value) {
                window[APP].statechart.dispatchEvent(buttonView.get('action'), this);
            }, function(value) {
               // do nothing
            });

        } else {
            window[APP].statechart.dispatchEvent(buttonView.action, this);
        }

    },

    titleDidChange: function () {
        if (this.get('leftIcon')) {
            this.node.children[1].innerHTML = this.get('title');
        } else if (this.get('rightIcon')) {
            this.node.children[0].innerHTML = this.get('title');
        } else if (this.get('tabbedIcon')) {
            this.node.children[1].innerHTML = this.get('title');
        } else {
            this.node.innerHTML = this.get('title');
        }
    }.observes('title')

});