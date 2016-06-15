alto_require('frameworks/shared/altojs/ui/utilities/dom.js');

// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2015 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC
// ==========================================================================

/**
 `Alto.CoreView` is the root view of all view instances. Every class you use or write inherits the instance methods of
 `Alto.Object`. You may not need to use any of these methods, but, if you choose to do so, you may need to override
 them with code that is specific to your class.

 @module UI
 @class Alto.CoreView
 @extends Alto.Object
 @since Alto 0.0.1
 @version 1.0.0
 @author Chad Eubanks
 */

Alto.CoreView = Alto.Object.extend({

    instanceName: '',

    classNames: [],

    childViews: [],

    parentView: 'body',

    tag: '',

    node: '',

    layerId: '',

    isVisible: true,

    attachToNode: '',

    attachBeforeNode: '',

    init: function () {
        if (Alto.isPresent(this.get('instanceName'))) {
            var instanceName = this.get('instanceName').split('.'),
                APP = instanceName[0],
                VIEWNAME = instanceName[1];

            if (Alto.isNone(window[APP][VIEWNAME])) {
                window[APP][VIEWNAME] = this;
                this.viewWillLoad();
            } else {
                Alto.Logger.error('A view instance named \'%@\' already exisits.  Canceling creation of view.'.fmt(this.get('instanceName')));
            }

        } else {
            this.viewWillLoad();
        }

    },

    /**
     Get the views tag type, create the html element(s) and passes html element(s) to Load().

     We dont know anything about the html elements nor should we make that assumption.

     @method viewWillLoad
     */
    viewWillLoad: function () {
        var tag = this.get('tag'),
            html;

        if (Alto.isEmpty(tag)) {
            Alto.Logger.error('%@ can not create a html element with an empty tag. Tag example: \'div\'.'.fmt(this.get('instanceName')));
            return;
        }

        html = document.createElement(tag);

        // let the html element know about the view //
        html.__alto_object__ = this;

        this.viewDidLoad(html);
    },

    /**
     Has the html elements and passes them to viewWillAppear().

     We know about the html elements and can do some setup in here.
     Example: modify attributes / setup dynamic data and more...

     @method viewDidLoad
     */
    viewDidLoad: function (html) {

        if (Alto.isPresent(html)) {

            var classNames = this.get('classNames'),
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
            Alto.Logger.error('%@: viewDidLoad was invoked without passing a html element as an argument.  View can not be created.'.fmt(this.get('instanceName')));
            return;
        }
        
    },

    /**
     With our html elements all setup and ready to go.
     We add them to the dom and invokes viewDidAppear().
     @method viewWillAppear
     */
    viewWillAppear: function (html) {
        var attachToNode = this.get('attachToNode'),
            attachBeforeNode = this.get('attachBeforeNode'),
            APP = Alto.applicationName;

        if (Alto.isPresent(attachToNode) && Alto.isEmpty(attachBeforeNode)) {
            if (Alto.isEqual(attachToNode, 'body')) {
                document.getElementsByTagName('body')[0].appendChild(html);
            } else {
                attachToNode.appendChild(html);
            }
        } else {
            // todo handle before node use case
        }

        this.viewDidAppear(html);
    },

    /**
     Our html is now on the dom and can be queried.
     @method viewDidAppear
     */
    viewDidAppear: function (html) {
        this.set('node', html);
        this.viewCreateSubViews();
    },

    /**
     Create the views subviews.
     @method viewCreateSubViews
     */
    viewCreateSubViews: function () {
        var children = this.get('childViews'),
            viewInstance, that = this;

        if (Alto.isPresent(children)) {
            children.forEach(function (child) {
                if (!Alto.Object.detectInstance(child)) {
                    if (Alto.isEqual(child, Alto.String.camelize(child))) {
                        Alto.Logger.warn(Alto.String.fmt('ChildViews are of type \'Class\'. To avoid unwanted side effects. Use a classified syntax for a child\'s name.  Example: \'%@\'.', Alto.String.classify(child)));
                        //Alto.Logger.warn('ChildViews are of type \'Class\'. To avoid unwanted side effects. Use a classified syntax for a child\'s name.  Example: \'%@\'.'.fmt(child.classify()));

                    }

                    if (Alto.isNone(that[child])) {
                        Alto.Logger.error('Can not find child view: ', child)
                        return;
                    } else {
                        viewInstance = that[child].createWithMixins({parentView: that});
                        that[Alto.String.camelize(child)] = viewInstance;
                    }
                }
                that.node.appendChild(viewInstance.node);
            })
        }

        Alto.run.later(function () {
            that.viewAnimateIn();
        }, 200);
    },

    viewAnimateIn: function () {

    },

    /*
     Removes self from dom
     */
    remove: function () {
        this.viewAnimateOut();
    },

    /**
     Before the view is removed from the dom. If desired, Animate it out.
     @method viewAnimateIn
     */
    viewAnimateOut: function (delay) {
        if (Alto.isNone(delay)) {
            this.viewWillDisappear();
        } else {
            var that = this;
            Alto.run.later(function () {
                that.viewWillDisappear();
            }, delay)
        }
    },

    /**
     Removes elements from the dom.
     @method viewWillDisappear
     */
    viewWillDisappear: function () {
        Alto.DomUtil.removeView(this);
        this.viewDidDisappear();
    },

    /**
     Nothing is left on the dom.
     @method viewDidDisappear
     */
    viewDidDisappear: function () {
    },

    isVisibleDidChange: Alto.observer('isVisible', function () {
        if (this.get('isVisible')) {
            this.node.classList.remove('hidden');
        } else {
            this.node.classList.add('hidden');
        }
    }),

    mouseDown: function () {
        return;
    }

});