// ==========================================================================
// Project: SoundWave
// Author: Chad Eubanks
// Copyright: @2014 The Code Boutique, LLC
// ==========================================================================

Alto.ImageView = Alto.CoreView.extend ({

    tag: "img",

    src: "",

    /*
     Has the html elements and passes them to viewWillAppear().

     We know about the html elements and can do some setup in here.
     Example: add disabled, hidden, etc className / adds alto object ids (maybe) / setup dynamic data and more...
     */
    viewDidLoad: function(node) {
        node ? node : node = document.createElement(this.get("tag"));
        if (node) {

            var n = 0,
                classNames = this.get('classNames');
            while (n < classNames.length) {
                node.className += node.className ? ' ' + classNames[n] : classNames[n];
                n++;
            }

            if (this.getPath("src")) {
                node.src = this.getPath("src");
            }

            this.viewWillAppear(node);
        }
    },

    srcDidChange: function() {
        this.node.src = this.getPath("this.src");
    }.observes('this.src')

});