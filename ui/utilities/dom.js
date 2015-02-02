// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2014 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC
// ==========================================================================

/**
 Gives logging to your console some color.

 @submodule DomUitl
 @class Alto.DomUtil
 @extends Alto.Object
 @since Alto 0.0.1
 @author Chad Eubanks
 */

Alto.DomUtil = Alto.Object.create({

    removeAllChildren: function (element) {
        if (!element.firstChild) return;
        while (element.firstChild) element.removeChild(element.firstChild);
    },

    removeNodeFromParent: function (node, parent) {
        node.parentNode.removeChild(node);
    },

    removeView: function (instanceName) {
        var view = window[instanceName.split('.')[0]][instanceName.split('.')[1]];
        view.node.parentNode.removeChild(node);
        Alto.Object.destroyInstance(instanceName);
    },

    addElementToNode: function (element, node) {

        if (element == "") {
            return
        }

        if (node === 'body') {
            var dom = document.getElementsByTagName('body')[0];
            dom.appendChild(element);
        } else if (node.id) {
            var dom = document.getElementById(node);
            dom.appendChild(element);
        } else {
            node.appendChild(element);
        }
    },

    addElementToNodeBeforeNode: function (element, node, beforeNode) {

        if (element == "") {
            return
        }

        if (node === 'body') {
            var dom = document.getElementsByTagName('body')[0];
            dom.insertBefore(element, beforeNode);
        }

    }

});