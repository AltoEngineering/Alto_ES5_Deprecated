// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2014 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC
// ==========================================================================

/**
 Gives logging to your console some color.

 @module UI
 @class Alto.Checkbox
 @extends Alto.CoreView
 @since Alto 0.0.1
 @author Chad Eubanks
 */

Alto.Checkbox = Alto.CoreView.extend ({

    title: '',

    isChecked: false,

    /*
     Gets the template and passes html elements to viewDidLoad().

     We dont know anything about the html elements nor should
     we make that assumption.
     */
    viewWillLoad: function () {
        var label = document.createElement('label'),
            input = document.createElement('input');

        this.viewDidLoad(label, input);
    },

    /*
     Has the html elements and passes them to viewWillAppear().

     We know about the html elements and can do some setup in here.
     Example: add disabled, hidden, etc className / adds alto object ids (maybe) / setup dynamic data and more...
     */
    viewDidLoad: function(label, input) {
        if (label && input) {
            input.type = 'checkbox';
            input.checked = this.get('isChecked');

            label.innerHTML = this.get('title');
            label.className = 'alto-checkbox-label'
            label.appendChild(input);
        }

        this.addClickHandler(label);

        this._super(label);
    },

    addClickHandler: function(node) {
        var that = this

        node.addEventListener("change", function(){that.onChange(that) }, false);
    },

    onChange: function(view) {
        this.set('isChecked', view.node.children[0].checked)
    }

});