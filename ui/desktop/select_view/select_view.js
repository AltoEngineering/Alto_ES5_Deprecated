/**
 @module UI
 @class Alto.SelectView
 @extends Alto.CoreView
 @since Alto 0.0.1
 @author Anthony Alviz
 */

Alto.SelectView = Alto.CoreView.extend({

    tag: 'select',

    options: [],

    keyValue: null,

    selectedOption: null,

    viewDidLoad: function (node) {
        var that = this;

        node.addEventListener("change", function () {
            that.inputDidChange(that)
        }, false);

        this._super(node);
    },

    /*  Create the views subviews    */
    viewCreateSubViews: function () {
        var options = this.get('options'),
            selectNode = this.get('node'),
            keyValue = this.get('keyValue');

        if (Alto.isEmpty(this.get('options'))) {return}

        if (options[0] instanceof Object && !Alto.isEmpty(keyValue)) {
            options.forEach(function (option) {
                var optionNode = document.createElement('option');
                optionNode.textContent = option[keyValue];
                selectNode.appendChild(optionNode);
            })
        } else if (options[0] instanceof String) {
            options.forEach(function (option) {
                var optionNode = document.createElement('option');
                optionNode.textContent = option;
                selectNode.appendChild(optionNode);
            })
        }

        if (!Alto.isEmpty(this.get('selectedOption'))) {
            this.node.value = this.get('selectedOption');
        }
    },

    inputDidChange: function (view) {
        this.set('selectedOption', view.node.options[view.node.selectedIndex].value);
    },

    selectedOptionDidChange: function () {
        if (this.node.value != this.get('selectedOption')) {
            this.node.value = this.get('selectedOption');
        }
    }.observes('this.selectedOption')

});