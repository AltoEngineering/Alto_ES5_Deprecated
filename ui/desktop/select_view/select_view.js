/**
 @module UI
 @class Alto.SelectView
 @extends Alto.CoreView
 @since Alto 0.0.1
 @author Anthony Alviz
 */

Alto.SelectView = Alto.CoreView.extend({

    tag: 'select',

    hint: null,

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

        if (Alto.isPresent(this.get('hint')) || Alto.isEqual(this.get('hint'), '')) {
            var optionNode = document.createElement('option');
            optionNode.textContent = this.get('hint');
            optionNode.value = this.get('hint');
            optionNode.selected = true;
            optionNode.disabled = true;
            selectNode.appendChild(optionNode);
            this.node.value = this.get('hint');
        }

        if (options[0] instanceof Object && !Alto.isEmpty(keyValue)) {
            options.forEach(function (option) {
                var optionNode = document.createElement('option');
                optionNode.textContent = option[keyValue];
                optionNode.value = option[keyValue];
                selectNode.appendChild(optionNode);
            })
        } else if (typeof options[0] === "string") {
            options.forEach(function (option) {
                var optionNode = document.createElement('option');
                optionNode.textContent = option;
                optionNode.value = option;
                selectNode.appendChild(optionNode);
            })
        }

        if (Alto.isPresent(this.get('selectedOption'))) {
            this.node.value = this.get('selectedOption');
        }

    },

    inputDidChange: function (view) {
        this.set('selectedOption', view.node.options[view.node.selectedIndex].value);
    },

    selectedOptionDidChange: function () {
        if (this.node.value !== this.get('selectedOption')) {
            this.node.value = this.get('selectedOption');
        }
    }.observes('this.selectedOption'),

    optionsDidChange: function () {
        this.viewCreateSubViews();
    }.observes('options')

});