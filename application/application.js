// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2014 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC
// ==========================================================================

/**
 When an application starts.  It calls the **applicationWillLoad()** method.  At this time the applications name has yet to
 be created and the applications name is not in scope of the window object.

 Once an application has loaded, meaning when all framework files related to Alto and an Alto application have been loaded
 into the browsers javascript, the applications name has been instantiated, and the applications name is in scope of
 the window object.  Then the **applicationDidLoad()** method is called.  At this time you may start to use your applications
 namespace.

 The main purpose of these application life cycle hooks is simply to provide an opportunity to setup global properties/objects
 both outside of your applications namespace: applicationWillLoad() and within scope of your applications namespace:
 applicationDidLoad().

 @module Application
 @class Alto.Application
 @extends Alto.Object
 @since Alto 0.0.1
 @author Chad Eubanks
 */

Alto.Application = Alto.Object.extend({

    isApplication: true,

    CookieDomain: null,

    /**
     @property NAMESPACE
     @type String
     @description The value for namespace needs to match the name assigned to the instance of Alto.Application.
     Internally, Alto uses the value for namespace to setup your application during initialization and during event
     handling.

     **Example:**
     <pre class="code prettyprint prettyprinted">
     <code>App = Alto.Application.create ({
                NAMESPACE: 'App'
            });
     </code>
     </pre>
     */
    NAMESPACE: '',

    /**
     @property COOKIENAME
     @type String
     @description The value for cookiename is used internally as the lookup name of your applications session cookie.
     @default this.get('NAMESPACE')

     **Example:**
     <pre class="code prettyprint prettyprinted">
     <code>App = Alto.Application.create ({
                COOKIENAME: 'AuthCookie'
            });
     </code>
     </pre>
     */
    COOKIENAME: function () {
        return '%@%@'.fmt(this.get('NAMESPACE').toLowerCase(), 'auth');
    }.property('NAMESPACE'),

    /**
     @property VERSION
     @type String
     @description Keeps track of your application version.
     */
    VERSION: '',

    /**
     @property LogStateTransitions
     @type Bool
     @description When set to true, as an Alto application enters and exists a state. A message will print to your
     web console.
     @default true
     */
    LogStateTransitions: true,

    /**
     @property LogMessages
     @type Bool
     @description When set to true and when using {{#crossLink "Alto.Console/log:method"}}Alto.Console.log{{/crossLink}}, console logs will print to your web console.
     @default true
     */
    LogMessages: true,

    init: function () {

        Alto.applicationName = this.NAMESPACE;
        this.applicationWillLoad();
    },

    /**
     @method applicationWillLoad
     */
    applicationWillLoad: function () {

    },

    /**
     @method applicationDidLoad
     */
    applicationDidLoad: function () {
        window[Alto.applicationName].router = window[Alto.applicationName].Router.createWithMixins();
        window[Alto.applicationName].router.routerDidBecomeActive();
    },

    createSession: function (token, daysValid) {
        var expirationDate = new Date(),
            cookie;

        expirationDate.setDate(expirationDate.getDate() + daysValid);

        cookie = Alto.Cookie.create({
            name: this.get('COOKIENAME'),
            value: token,
            domain: this.get('CookieDomain'),
            path: '/',
            expires: expirationDate,
            secure: false
        });
        cookie.write();
    },

    endSession: function () {
        var expirationDate = new Date(),
            cookie;

        expirationDate.setDate(expirationDate.getDate() - 30000);

        cookie = Alto.Cookie.create({
            name: this.get('COOKIENAME'),
            value: '',
            domain: this.get('CookieDomain'),
            path: '/',
            expires: expirationDate,
            secure: false
        });
        cookie.write();

        Alto.run.next(this, function() {
            location.reload();
        });
    }

});