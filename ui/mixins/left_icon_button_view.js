Alto.LeftIconButtonViewMixin = Alto.Mixin.create({

    iconClassNames: null,

    /**
     Get the views tag type, create the html element(s) and passes html element(s) to viewDidLoad().

     We dont know anything about the html elements nor should we make that assumption.

     @method viewWillLoad
     */
    viewWillLoad: function () {
        var tag = this.get('tag'),
            html, icon, span, div;

        if (Alto.isEmpty(tag)) {
            Alto.Logger.error('%@ can not create a html element with an empty tag. Tag example: \'div\'.'.fmt(this.get('instanceName')));
            return;
        }

        html = document.createElement(tag);
        div = document.createElement('div');
        span = document.createElement('span');
        icon = document.createElement('div');

        // let the html element know about the view //
        html.__alto_object__ = this;

        this.viewDidLoad(html, div, span, icon);
    },

    /**
     Has the html elements and passes them to viewWillAppear().

     We know about the html elements and can do some setup in here.
     Example: modify attributes / setup dynamic data and more...

     @method viewDidLoad
     */
    viewDidLoad: function (html, div, span, icon) {
        var classNames = this.get('iconClassNames');

        classNames.forEach(function (className) {
            icon.classList.add(className);
        });

        div.innerText = this.get('title');

        div.__alto_object__ = this;

        span.appendChild(icon);
        html.appendChild(span);
        html.appendChild(div);

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
    }

});