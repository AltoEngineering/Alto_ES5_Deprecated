// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Author: Chad Eubanks
// Copyright: @2014 The Code Boutique, LLC
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

Alto.Router = Alto.Object.extend ({

    /**
     ---- About this class ----
     All routes associated to the application are delcared as a hash with key value pairs.
     A route hash contains the following:
     - url           (how the url is displayed) **NOTE**  nested urls are given a model attribute ex:  url: "#blog/:title"
     - state         (the state in which your application will be in for a given url)

     ---- How to use it ----
     routes: [{
        name: "index",
        url: "index.html",
        state: "applicationState"
     },{
         name: "blogs",
         url: "#blog",
         state: "blogState"
     },{
        name: "blog",
        url:  "#blog/:id",
        state: "userBlogState",
        dataSource: "TCB.BlogDataSource",
        dataSourceMethod: "fetchBlogById",
        isProtected: true // will check for an auth token before making network call
     }];

     */

    /*
        Do not override this method.
    */
    init: function() {
        this.set('_didWake', true);
        this._super();
    },

    routes: [],

    /**  Internal Use Only  **/

    /**
        An observed property that gets set to true when an applications router is initalized.
    */
    _didWake: false,

    /*
        All urls associated to an applications routes.
    */
    _urls: [],

    /*
     All names associated to an applications routes.
     */
    _names: [],

    /*
        All states associated to an applications routes.
    */
    _states: [],

    /*
     All dataSources associated to an applications routes.
     */
    _dataSources: [],

    /*
     All dataSourceMethods associated to an applications routes.
     */
    _dataSourceMethods: [],

    /*
     All privacy settings associated to an applications routes.
     */
    _isProtecteds: [],

    /*
     Pushes all Names into our _names array.
     */
    _acknowledgeNames: function() {
        var routes = this.get('routes');

        this.set('_names', routes.getEach('name'));
    }.observes('this._didWake'),

    /*
        Pushes all URLs into our _urls array.
    */
    _acknowledgeUrls: function() {
        var routes = this.get('routes');

        this.set('_urls', routes.getEach('url'));
    }.observes('this._didWake'),

    /*
     Pushes all datasources into our _datasources array.
     */
    _acknowledgeDataSources: function() {
        var routes = this.get('routes');

        this.set('_dataSources', routes.getEach('dataSource'));
    }.observes('this._didWake'),

    /*
     Pushes all privacy settings into our _isProtecteds array.
     */
     _acknowledgeDataSources: function() {
        var routes = this.get('routes');

        this.set('_isProtecteds', routes.getEach('isProtected'));
    }.observes('this._didWake'),

    /*
     Pushes all dataSourceMethods into our _queryTypes array.
     */
    _acknowledgeDataSourceMethods: function() {
        var routes = this.get('routes');

        this.set('_dataSourceMethods', routes.getEach('dataSourceMethod'));
    }.observes('this._didWake'),

    /*
        Pushes all States into our _states array.
    */
    _acknowledgeStates: function() {
        var routes = this.get('routes');

        this.set('_states', routes.getEach('state'));
    }.observes('this._didWake'),

    /*
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
                this._goToState(this.get('_states')[i]);
            }
        }
    }.observes('this._didWake'),

    /*
        When a hash change occurs, invoke _findMatchingingResources();
    */
    hashDidChange: window.onhashchange = function(e) {
        var APP = this.Alto.applicationName;

        window[APP].router._findMatchingingResources(e);
    },

    /*
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
                Alto.console.log(message, Alto.console.warnColor);
            }

            window[APP][window[APP].Statechart.get("currentState")].exitState();
        }

        // Handle an attempt to enter a non existent state
        if (!window[APP][state]) {
            var message = "Can not find state " + state + ". Check your applications router and declared states.";
            Alto.console.log(message, Alto.console.errorColor);
        } else {
            window[APP].Statechart.set("currentState", state);

            if (window[APP].LogStateTransitions) {
                var message = "Entering " + window[APP].Statechart.get("currentState");
                Alto.console.log(message, Alto.console.messageColor);
            }

            window[APP][state].enterState();
        }

    },

    goToState: function(state) {
        var routes = this.routes;

        for (var i = 0, len = routes.length; i < len; i++) {

            if (routes[i].state == state) {
                location.hash = routes[i].url
            }
        }
    },

    goToStateWithDynamicRoute: function(state, dynamicRoute) {
        var routes = this.routes;

        for (var i = 0, len = routes.length; i < len; i++) {

            if (routes[i].state == state) {
                history.pushState({}, null,'#' + dynamicRoute)
                this._goToState(state);
            }
        }
    },

    popRoute: function () {
        window.history.go(-1);
    }

});