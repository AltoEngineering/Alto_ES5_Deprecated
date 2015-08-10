// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2014 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC
// ==========================================================================

/**
 `Alto.DomUtil` provides utility functions to work with the DOM tree. This works directly with a parent class to
 remove/add any elements, views, or nodes.

 @submodule DomUitl
 @class Alto.DomUtil
 @extends Alto.Object
 @since Alto 0.0.1
 @author Chad Eubanks
 */

Alto.DomUtil = Alto.Object.create({

    /**
     Removes all children nodes from parent class.
     @method removeAllChildren
     @param element
     */
    removeAllChildren: function (element) {
        if (!element.firstChild) return;
        while (element.firstChild) element.removeChild(element.firstChild);
    },

    /**
     Removes a child node from parent class.
     @method removeNodeFromParent
     @param element
     */
    removeNodeFromParent: function (node, parent) {
        node.parentNode.removeChild(node);
    },

    /**
     Destroys an instance of a parent view.
     @method removeView
     @param element
     */
    removeView: function (instanceName) {
        var view = window[instanceName.split('.')[0]][instanceName.split('.')[1]];

        if (!view) {Alto.Logger.error('A view instance by the name:', '`' + instanceName + '`', 'does not exist.'); return}

        view.node.parentNode.removeChild(view.node);
        Alto.Object.destroyInstance(instanceName);
    },

    /**
     Add child element to another node
     @method addElementToNode
     @param element
     */
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

    /**
     Add element to parent node.
     @method addElementToNodeBeforeNode
     @param element
     */
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