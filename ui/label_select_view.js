// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2014 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC
// ==========================================================================

/**
 Gives logging to your console some color.

 @module UI
 @class Alto.LabelSelectView
 @extends Alto.View
 @since Alto 0.0.1
 @author Anthony Alviz
 */

Alto.LabelSelectView = Alto.View.extend({

    tag: "div",

    /**
     * The value of the label.
     * @property title
     * @type String
     */
    title: null,

    /**
     * The value of the label.
     * @property hint
     * @type String
     */
    hint: null,

    /**
     * The value of the label.
     * @property options
     * @type String
     */
    options: null,

    /**
     * The value of the label.
     * @property value
     * @type String
     */
    value: null,

    /**
     * If options binding is an object, this is the key of the object to bind to.
     * @property value
     * @type String
     */
    keyValue: null,

    /*
     Has the html elements and passes them to viewWillAppear().

     We know about the html elements and can do some setup in here.
     Example: add disabled, hidden, etc className / adds alto object ids (maybe) / setup dynamic data and more...
     */
    viewWillLoad: function () {
        var node = document.createElement('div'),
            title = document.createElement('div'),
            select = document.createElement('select');

        // let the html element know about the view //
        node.__alto_object__ = this;

        this.viewDidLoad(node, title, select);
    },

    viewDidLoad: function (node, title, select) {
        var that = this;

        title.className = "title";
        select.className = "select-view";

        select.addEventListener("input", function () {
            that.inputDidChange(select)
        }, false);

        if (Alto.isPresent(this.get('value'))) {
            select.value = this.get('value');
        } else {
            select.value = this.get('hint');
        }

        title.textContent = this.get('title');

        node.appendChild(title);
        node.appendChild(select);

        this._super(node);
    },

    viewCreateSubViews: function () {
        var options = this.get('options'),
            selectNode = this.get('node').children[1],
            keyValue = this.get('keyValue');

        if (Alto.isEmpty(this.get('options'))) {
            return
        }

        if (selectNode.children) {
            //resets all options
            Alto.DomUtil.removeAllChildren(selectNode)
        }

        if (Alto.isPresent(this.get('hint')) || Alto.isEmpty(this.get('hint'))) {
            var optionNode = document.createElement('option');

            optionNode.textContent = this.get('hint');
            optionNode.value = this.get('hint');
            optionNode.selected = true;
            optionNode.disabled = true;
            selectNode.appendChild(optionNode);
            this.node.children[1].value = this.get('hint');
        }

        if (options[0] instanceof Object && !Alto.isEmpty(keyValue)) {
            options.forEach(function (option) {
                var optionNode = document.createElement('option'),
                    value = option.get('%@'.fmt(keyValue));

                //todo have a check for duplicates

                if (Alto.isPresent(value)) {
                    optionNode.textContent = value;
                    optionNode.value = value;
                    selectNode.appendChild(optionNode);
                }
            })
        } else if (typeof options[0] === "string") {
            options.forEach(function (option) {
                var optionNode = document.createElement('option');
                optionNode.textContent = option;
                optionNode.value = option;
                selectNode.appendChild(optionNode);
            })
        }

        if (Alto.isPresent(this.get('value'))) {
            this.node.children[1].value = this.get('value');
        }

    },

    inputDidChange: function (value) {
        this.set('value', value.value);
    },

    valueDidChange: Alto.observer('value', function () {
        if (Alto.isPresent(this.get('value'))) {
            this.node.children[1].value = this.get('value');
        } else {
            this.node.children[1].value = this.get('hint');
        }
    }),

    optionsDidChange: function () {
        this.viewCreateSubViews();
    }.observes('options')
})