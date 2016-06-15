alto_require('frameworks/shared/altojs/ui/core_view.js');
alto_require('frameworks/shared/altojs/ui/animate/animate.js');

Alto.ModalPane = Alto.CoreView.extend({

    animationDuration: 0.3,

    classNames: null,

    childViews: ['ContentView'],

    ContentView: null,

    viewWillLoad: function () {
        var html;

        html = document.createElement('div');

        // let the html element know about the view //
        html.__alto_object__ = this;

        this.viewDidLoad(html);
    },

    /**
     Our html is now on the dom and can be queried.
     @method viewDidAppear
     */
    viewDidAppear: function (html) {
        if (parent.CoreApp.applicationInstance) {
            parent.CoreApp.applicationInstance.window.set('responder', this);
        }

        this._super(html);
    },

    viewAnimateIn: function () {
        Alto.animate.move(this.contentView.get('node'), '-50%', '-50%', this.get('animationDuration'));
    },

    viewAnimateOut: function () {
        Alto.animate.move(this.contentView.get('node'), '-50%', '400%', this.get('animationDuration'));
        this._super(300);
    },

    viewDidDisappear: function () {
        if (parent.CoreApp.applicationInstance) {
            parent.CoreApp.applicationInstance.window.set('responder', '');
        }
        this._super();
    }

});