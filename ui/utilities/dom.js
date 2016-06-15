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
        } else {
            node.appendChild(element);
        }
    },

    /**
     Destroys an instance of a parent view.
     @method removeView
     @param element
     */
    removeView: function (view) {
        if (view.node.parentNode) {
            view.node.parentNode.removeChild(view.node);
        }

        if (Alto.isPresent(view.get('instanceName'))){
            Alto.Object.destroyInstance(view.get('instanceName'));
        }
    },

    /**
     Removes all children nodes from parent class.
     @method removeAllChildren
     @param element
     */
    removeAllChildren: function (element) {
        if (!element.firstChild) return;
        while (element.firstChild) element.removeChild(element.firstChild);
    },

    removeNodeFromParent: function (node, parent) {
        node.parentNode.removeChild(node);
    }
});