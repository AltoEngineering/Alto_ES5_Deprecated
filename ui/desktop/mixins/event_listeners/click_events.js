Alto.ClickEvents = Alto.Mixin.create ({

    /*
     Has the html elements and passes them to viewWillAppear().

     We know about the html elements and can do some setup in here.
     Example: add disabled, hidden, etc className / adds alto object ids / setup dynamic data and more...
     */
    viewDidLoad: function(node) {
        var that = this

        this._super();

        node.innerHTML = this.getPath("title")
        node.addEventListener("click", function(){that.click(that) }, false);

        this.viewWillAppear(node);

    },

    click: function(buttonView) {
        var APP = Alto.applicationName

        window[APP].Statechart.sendEvents(buttonView.action);
    }

});