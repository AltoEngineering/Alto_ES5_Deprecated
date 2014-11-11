// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2014 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC
// ==========================================================================

/**
 Alto.Router defines what URLs or 'routes' are used in your application.  As with traditional document based websites,
 an Alto application changes its route based upon a corresponding event.  Take the following scenarios into account:

 - A user navigates to a login screen.  The most likely URL that correlates to this screen is: **www.example.com/index.html/#/login**.
 - A user wants to share a blog post.  A user can post a link online with the following URL:  **www.example.com/index.html/#/blog/18**.

 Architectually, Alto couples a route with a specific state.  See the {{#crossLinkModule "Statechart"}}{{/crossLinkModule}}
 module for detailed information about statecharts.

 All routes associated to the application are delcared as a hash with key value pairs and omit the domain name.  A route hash contains the
 following properties:

 - url: how the url is displayed
 - state: the name of the state instance your application will be in for the paired url

        App.router = Alto.Router.create ({
            routes:[{
                url: "index.html",
                state: "indexState"
            },{
                url: "#/login",
                state: "unauthenticatedState"
            },{
                url: "#/blog",
                state: "blogsState"
            }, {
                url: "#/blog/:id", // a nested url with a model attribute
                state: "blogState",
                isProtected: true // will check for an session token before making network call
            }]
        });

 @module Router
 @class Alto.Router
 @extends Alto.Object
 @since Alto 0.0.1
 @author Chad Eubanks
 */

Alto.Router = Alto.Object.extend ({


    /**
        @method goToState
        @param {String} state An instance of the state you are going to enter.

        **How to use**
        <pre class="code prettyprint prettyprinted">
            <code>App.indexState = Alto.State.create ({

                doEnterBlogState: function () {
                    App.router.goToState('blogState');
                }

            });</code>
        </pre>
    */
    goToState: function(state) {
        var routes = this.routes,
            message = "Could not find state " + state;

        for (var i = 0, len = routes.length; i < len; i++) {

            if (routes[i].state == state) {
                location.hash = routes[i].url
                return;
            }
        }

        Alto.Console.log(message, Alto.Console.errorColor);
    },

    /**
        @method goToStateWithDynamicRoute
        @param {String} state An instance of the state you are going to enter
        @param {String} dynamicRoute The desired path of your dynamic route

        **How to use**
        <pre class="code prettyprint prettyprinted">
            <code>App.indexState = Alto.State.create ({

                // pass in who is sending a message to this method
                doEnterBlogDetailState: function (sender) {
                     var baseRoute = 'blog/',
                         data = sender.data;
                    App.router.goToStateWithDynamicRoute('blogDetailState', baseRoute + data.objectId);
                }

            });</code>
        </pre>
    */
    goToStateWithDynamicRoute: function(state, dynamicRoute) {
        var routes = this.routes;
        for (var i = 0, len = routes.length; i < len; i++) {

            if (routes[i].state == state) {
                history.pushState({}, null,'#' + dynamicRoute)
                this._goToState(state);
            }
        }
    },

    /** =====   Internal Use Only  ===== **/

    /**
        Do not override this method.
        Do not call directly
    */
    init: function() {
        this.set('_didWake', true);
        this._super();
    },

    /**
        @property routes
        @type Array
    */
    routes: [],

    /**
        An observed property that gets set to true when an applications router is initalized.
     */
    _didWake: false,

    /**
        All urls associated to an applications routes.
    */
    _urls: [],


    /**
        All states associated to an applications routes.
    */
    _states: [],


    /**
        All privacy settings associated to an applications routes.
    */
    _isProtecteds: [],

    /**
        Internally used to determine if we found a staticRoute (a route that is not bound by a model attribute).
    */
    _staticRouteFound: false,

    /**
        When our applications router wakes, we map each property of a route into its respective array.
   */
    _mapRoutes: function () {
        var routes = this.get('routes');

        this.set('_urls', routes.getEach('url'));
        this.set('_states', routes.getEach('state'));
        this.set('_isProtecteds', routes.getEach('isProtected'));
    }.observes('this._didWake'),

    /**
        Pairs a URL to the corresponding State.
    */
    _findMatchingingResources: function(e) {
        var hashFromChange = e.newURL ? e.newURL.substr(e.newURL.indexOf('#'), e.newURL.length) : "",
            knownUrls = this.get('_urls'),
            currentUrl = location.pathname.substr(location.pathname.lastIndexOf('/') + 1, location.pathname.length),
            currentHash = location.hash,
            url;

        // on a fresh load/reload and we are in our root route. Ex: index.html
        if (!hashFromChange && currentHash == "") {url = currentUrl}

        // on a fresh load/reload and we are NOT in our root route. Ex: index.html#blog
        if (!hashFromChange && currentHash != "") {url = currentHash}

        //on hashDidChange and we are in our root route.  Ex: index.html
        if (hashFromChange && currentHash == "") {url = currentUrl}

        //on hashDidChange and we are NOT in our root route.  Ex: index.html#blog
        if (hashFromChange && currentHash != "") {url = hashFromChange}

        for (var i = 0, len = knownUrls.length; i < len; i++) {

            if (knownUrls[i] == url) {
                this.set('_staticRouteFound', true);
                this._goToState(this.get('_states')[i]);
            }
        }

        if (!this.get('_staticRouteFound')) {
            var baseUrl = url.split('/')[0];

            if (!location.pathname.contains('index.html') && baseUrl == '') {this._goToRootRoute(); return}

            for (var i = 0, len = knownUrls.length; i < len; i++) {
                if (knownUrls[i].contains(baseUrl) && knownUrls[i].contains(':')) {
                    this._goToState(this.get('_states')[i])
                }

            }
        }

    }.observes('this._didWake'),

    /**
        When a hash change occurs, invoke _findMatchingingResources();
    */
    _hashDidChange: window.onhashchange = function(e) {
        var APP = this.Alto.applicationName;
        window[APP].router.set('_staticRouteFound', false);
        window[APP].router._findMatchingingResources(e);
    },

    /**
        Go to state that matches the current url
    */
    _goToState: function (state) {

        var APP = Alto.applicationName;

        // If we don't already have one.  Create an instance of our applications statehcart
        if (!window[APP].Statechart) {
            window[APP].Statechart = Alto.Statechart.create();
        }

        // Do nothing if the passed in state is the same as the current state
        // Occurs if two route objects are associated to the same state object
        if (window[APP].Statechart.get("currentState") == state) {return}

        // If we are already in a state, call is exitState before transitioning
        if (window[APP].Statechart.get("currentState") != "") {

            if (window[APP].LogStateTransitions) {
                var message = "Exiting " + window[APP].Statechart.get("currentState");
                Alto.Console.log(message, Alto.Console.warnColor);
            }

            window[APP][window[APP].Statechart.get("currentState")].exitState();
        }

        // Handle an attempt to enter a non existent state
        if (!window[APP][state]) {
            var message = "Can not find state " + state + ". Check your applications router and declared states.";
            Alto.Console.log(message, Alto.Console.errorColor);
        } else {
            window[APP].Statechart.set("currentState", state);

            if (window[APP].LogStateTransitions) {
                var message = "Entering " + window[APP].Statechart.get("currentState");
                Alto.Console.log(message, Alto.Console.messageColor);
            }

            window[APP][state].enterState();
        }

    },

    _goToRootRoute: function () {
        var knownUrls = this.get('_urls');

        for (var i = 0, len = knownUrls.length; i < len; i++) {

            if (knownUrls[i].contains('index.html')) {
                this.set('_staticRouteFound', true);
                this._goToState(this.get('_states')[i]);
            }
        }
    }

});