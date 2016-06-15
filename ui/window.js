alto_require('frameworks/alto/ui/core_view.js');

// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2015 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC
// ==========================================================================

/**
 Base pane class.

 @module UI
 @class Alto.Window
 @extends Alto.CoreView
 @since Alto 0.0.2
 @internal-version 0.0.1
 @author Chad Eubanks and Miguel Chateloin
 */

Alto.Window = Alto.Object.extend({

    isWindow: true,

    init: function () {
        this.establishEventListenrs();
    },

    establishEventListenrs: function () {
        var that = this,
            _window = document.getElementsByTagName('body')[0];

        // let the html element know about the view //
        _window.__alto_object__ = this;

        // register client handler
        _window.addEventListener("click", that.mouseDown, true);

    },

    mouseDown: function (event) {
        var responderPane = Alto.isPresent(parent.CoreApp.applicationInstance.window.get('responder'));

        if (responderPane) {
            parent.CoreApp.applicationInstance.window.mouseDownResponderMode(event, responderPane);
        } else {
            parent.CoreApp.applicationInstance.window.mouseDownStandardMode(event);
        }

    },

    mouseDownResponderMode: function (event, responderPane) {
        var responderPaneFound = false,
            target = event.target,
            APP = Alto.applicationName;

        if (Alto.isNone(event.target.__alto_object__)) {
            return
        }

        if (Alto.isPresent(event.target.__alto_object__.action)) {

            if (event.target.__alto_object__._mouseDown) {
                event.target.__alto_object__._mouseDown();
            }

            if (event.target.__alto_object__.action != 'internal') {
                window[APP].statechart.dispatchEvent(event.target.__alto_object__.action, event.target.__alto_object__);
            }

        } else {
            if (!event.target.__alto_object__) {return}

            var _action, sender = event.target.__alto_object__;

            while (!_action && !sender.stopPropagation) {
                if (!sender.parentView) {

                    if (responderPane) {
                        parent.CoreApp.applicationInstance.window.get('responder').remove();
                        parent.CoreApp.applicationInstance.window.set('responder', '');
                    }
                    return
                }

                _action = sender.parentView.action
                sender = sender.parentView;
            }

            if (sender.stopPropagation) {
                return
            }

            if (sender._mouseDown) {
                sender._mouseDown();
            }

            if (_action && _action != 'internal') {
                window[APP].statechart.dispatchEvent(_action, sender);
            }

        }

        while (!responderPaneFound) {

            if (target.stopPropagation) {
                return
            }

            if (target.__alto_object__ && Alto.isEqual(target.__alto_object__.parentView, 'body')) {
                parent.CoreApp.applicationInstance.window.get('responder').remove();
                return
            } else if (target.__alto_object__ && target.__alto_object__.parentView) {
                target = target.__alto_object__.parentView;
            } else if (target.parentView) {
                target = target.parentView;
            } else if (Alto.isPresent(parent.CoreApp.applicationInstance.window.get('responder'))) {
                parent.CoreApp.applicationInstance.window.get('responder').remove();
            } else {
                return
            }

        }

    },

    mouseDownStandardMode: function (event) {
        var APP = Alto.applicationName;

        if (Alto.isNone(event.target.__alto_object__)) {
            return
        }

        if (Alto.isPresent(event.target.__alto_object__.action)) {

            if (event.target.__alto_object__._mouseDown) {
                event.target.__alto_object__._mouseDown();
            }

            if (event.target.__alto_object__.action != 'internal') {
                window[APP].statechart.dispatchEvent(event.target.__alto_object__.action, event.target.__alto_object__);
            }

        } else {
            var _action, sender = event.target.__alto_object__;

            while (!_action && !sender.stopPropagation) {
                if (!sender.parentView) {
                    return
                }

                _action = sender.parentView.action
                sender = sender.parentView;
            }

            if (sender.stopPropagation) {
                return
            }

            if (_action && _action != 'internal') {
                window[APP].statechart.dispatchEvent(_action, sender);
            }

            if (sender._mouseDown) {
                sender._mouseDown();
            }

        }
    }

});
