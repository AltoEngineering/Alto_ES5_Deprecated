Alto.RightIconButtonViewMixin = Alto.Mixin.create({

    iconClassNames: null,

    /**
     Get the views tag type, create the html element(s) and passes html element(s) to viewDidLoad().

     We dont know anything about the html elements nor should we make that assumption.

     @method viewWillLoad
     */
    viewWillLoad: function () {
        var tag = this.get('tag'),
            html, icon, span;

        if (Alto.isEmpty(tag)) {
            Alto.Logger.error('%@ can not create a html element with an empty tag. Tag example: \'div\'.'.fmt(this.get('instanceName')));
            return;
        }

        html = document.createElement(tag);
        span = document.createElement('span');
        icon = document.createElement('div');

        // let the html element know about the view //
        html.__alto_object__ = this;

        this.viewDidLoad(html, span, icon);
    },

    /**
     Has the html elements and passes them to viewWillAppear().

     We know about the html elements and can do some setup in here.
     Example: modify attributes / setup dynamic data and more...

     @method viewDidLoad
     */
    viewDidLoad: function (html, span, icon) {
        this._super(html);

        var classNames = this.get('iconClassNames');

        classNames.forEach(function (className) {
            icon.classList.add(className);
        })

        span.appendChild(icon);
        html.appendChild(span);
    },

});