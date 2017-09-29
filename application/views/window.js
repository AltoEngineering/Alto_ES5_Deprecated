import CoreObject from '../foundation/core_object.js';
import generateGuid from '../foundation/guid.js';
import Alto from '../../core.js';

// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2017 The Code Boutique, LLC
// License:   MIT License (see license for details)
// Author: Chad Eubanks
// ==========================================================================

let Window = class Window extends CoreObject {

    static toString() {
        return 'Alto.Window'
    }

    static create(...args) {
        const instance = Object.assign(new Window(), this, ...args);
        delete instance.create;
        instance.guid = generateGuid();
        instance.init();
        return instance;
    }

    static extend(...args) {
        const instance = new Window();
        instance.create = this.create;
        return Object.assign(instance, ...args);
    }

}

Window = Window.create({

    isWindow: true,

    responderPane: false,

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
        var responderPane = Alto.isPresent(Alto.applicationInstance.window.get('responder'));

        if (responderPane) {
            Alto.applicationInstance.window.mouseDownResponderMode(event, responderPane);
        } else {
            Alto.applicationInstance.window.mouseDownStandardMode(event);
        }

    },

    mouseDownResponderMode: function (event, responderPane) {
        /*
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
*/
    },

    mouseDownStandardMode: function (event) {

        if (Alto.isNone(event.target.__alto_object__)) {
            return
        }

        if (Alto.isPresent(event.target.__alto_object__.action)) {

            if (event.target.__alto_object__._mouseDown) {
                event.target.__alto_object__._mouseDown();
            }

            if (event.target.__alto_object__.action !== 'internal') {
                Alto.applicationInstance.statechart.dispatchEvent(event.target.__alto_object__.action, event.target.__alto_object__);
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

            if (_action && _action !== 'internal') {
                Alto.applicationInstance.statechart.dispatchEvent(_action, sender);
            }

            if (sender._mouseDown) {
                sender._mouseDown();
            }

        }

    }

});

export default Window;