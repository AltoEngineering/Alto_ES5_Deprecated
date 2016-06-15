alto_require('frameworks/shared/altojs/ui/core_view.js');
alto_require('frameworks/shared/altojs/ui/list_view.js');

Alto.PickerPane = Alto.CoreView.extend({

    classNames: null,

    childViews: ['ContentView'],

    ContentView: null,

    viewWillLoad: function () {
        var html, pickerView, contentFrame;

        html = document.createElement('div');
        pickerView = document.createElement('div');
        contentFrame = document.createElement('div');

        // let the html element know about the view //
        html.__alto_object__ = this;

        this.viewDidLoad(html, pickerView, contentFrame);
    },

    viewDidLoad: function (html, pickerView, contentFrame) {
        pickerView.classList.add('images-picker_anchor');
        pickerView.classList.add('anchor');
        html.appendChild(pickerView);
        html.appendChild(contentFrame);

        this._super(html);
    },

    /**
     Our html is now on the dom and can be queried.
     @method viewDidAppear
     */
    viewDidAppear: function (html) {
        parent.CoreApp.applicationInstance.window.set('responder', this);

        this._super(html);
    },

    viewDidDisappear: function () {
        parent.CoreApp.applicationInstance.window.set('responder', '');
        this._super();
    }

});