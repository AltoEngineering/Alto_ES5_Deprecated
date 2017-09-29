import Alto from '../../core.js';

// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2017 The Code Boutique, LLC
// License:   MIT License (see license for details)
// Author: Chad Eubanks
// ==========================================================================

let CoreView = class CoreView {

    static toString() {
        return 'Alto.CoreView'
    }

    static create(...args) {
        const instance = Object.assign(new CoreView(), this, ...args);
        instance.guid = Alto.generateGuid();
        delete instance.create;
        delete instance.extend;

        if (instance.hasBindings) {
            instance.initWithBindings(instance);
        } else {
            instance.init(instance);
        }

        return instance;
    }

    static extend(...args) {
        const instance = new CoreView();
        instance.create = this.create;
        instance.extend = this.extend;
        return Object.assign(instance, this, ...args);
    }

};

CoreView = CoreView.extend({

    action: null,

    attachToNode: null,

    classNames: [],

    childViews: [],

    isVisible: true,

    layerId: null,

    tag: null,

    node: null,

    set: function (key, value) {
        if (Alto.isEqual(this.get(key), value)) {
            return this
        }

        this[key] = value;
        return this;
    },

    get: function (key) {
        return this[key];
    },

    initWithBindings: function (instance) {
        let keys = Object.keys(instance), self = this;

        keys.forEach(function (key) {
            let connection = self[`${key}Binding`];

            if (connection) {
                let {isOneWay} = connection;

                if (!isOneWay) {
                    Alto.Binding.createTwoWayBinding(self, key, connection);
                }
            }
        });

        instance.init(instance);
    },

    init: function (html) {
        this.viewWillLoad(html);
    },

    viewWillLoad: function () {
        var tag = this.get('tag'),
            html;

        if (Alto.isEmpty(tag)) {
            Alto.Console.error(`Can not create a html element with an empty tag. Tag example: 'div'.`);
            return;
        }

        html = document.createElement(tag);

        // let the html element know about the view //
        html.__alto_object__ = this;

        this.viewDidLoad(html);
    },

    viewDidLoad: function (html) {
        if (Alto.isPresent(html)) {

            let classNames = this.get('classNames'),
                id = this.get('layerId'),
                isVisible = this.get('isVisible');

            if (Alto.isPresent(classNames)) {
                classNames.forEach(function (className) {
                    html.classList.add(className);
                })
            }

            if (Alto.isPresent(id)) {
                html.id = id;
            }

            if (!isVisible) {
                html.classList.add('hidden');
            }

            this.viewWillAppear(html);
        } else {
            Alto.Console.error(`ViewDidLoad was invoked without passing a html element as an argument.  View can not be created.`);
            return;
        }
    },

    viewWillAppear: function (html) {
        let attachToNode = this.get('attachToNode');

        if (Alto.isPresent(attachToNode)) {
            if (Alto.isEqual(attachToNode, 'body')) {
                document.getElementsByTagName('body')[0].appendChild(html);
            } else {
                attachToNode.appendChild(html);
            }
        }

        this.viewDidAppear(html);
    },

    viewDidAppear: function (html) {
        this.set('node', html);
        this.viewCreateSubViews();
    },

    viewCreateSubViews: function (html) {
        let children = this.get('childViews'), self = this, viewInstance;

        if (Alto.isPresent(children)) {
            children.forEach(function (child) {
                if (Alto.isNone(self[child])) {
                    Alto.Console.error(`Can not find child view: ${child}`);
                    return;
                } else {
                    viewInstance = self[child].create({parentView: self});
                    self.node.appendChild(viewInstance.node);
                }
            });
        }

        this.viewAnimateIn();
    },

    viewAnimateIn: function () {

    },

    remove: function () {
        this.viewAnimateOut();
    },

    viewAnimateOut: function (delay) {
        if (Alto.isNone(delay)) {
            this.viewWillDisappear();
        } else {
            var that = this;
            that.viewWillDisappear();
            /*
             Alto.run.later(function () {
             that.viewWillDisappear();
             }, delay)
             */
        }
    },

    viewWillDisappear: function () {
        if (this.node.parentNode) {
            this.node.parentNode.removeChild(this.node);
        }
        this.viewDidDisappear();
    },

    viewDidDisappear: function () {

    }

});

export default CoreView;