// ==========================================================================
// Project: Alto
// Author: Chad Eubanks
// Copyright: @2014 The Code Boutique, LLC
// ==========================================================================

Alto.TextArea = Alto.CoreView.extend ({
    tag: 'textarea',
    value: "",

    /*
     Has the html elements and passes them to viewWillAppear().

     We know about the html elements and can do some setup in here.
     Example: add disabled, hidden, etc className / adds alto object ids (maybe) / setup dynamic data and more...
     */
    viewDidLoad: function(node) {
        var that = this;

        node ? node : node = document.createElement(this.get("tag"));
        if (node) {
            node.id = Alto.guidFor(this);
            var n = 0,
                classNames = this.get('classNames');
            while (n < classNames.length) {
                node.className += node.className ? ' ' + classNames[n] : classNames[n];
                n++;
            }

            node.addEventListener("input", function(){that.inputDidChange(that) }, false);

            this.viewWillAppear(node);
        }
    },

    inputDidChange: function(textField) {
        this.set('value', textField.node.value);
    },

    valueDidChange: function () {
        this.node.value = this.get('value');
    }.observes('this.value')

})