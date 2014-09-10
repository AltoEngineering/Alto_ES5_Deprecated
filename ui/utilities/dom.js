// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Author: Chad Eubanks
// Copyright: @2014 The Code Boutique, LLC
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

Alto.DomUtil = Alto.Object.create({

    removeAllChildren: function (element) {
        if(!element.firstChild) return;
        while ( element.firstChild ) element.removeChild(element.firstChild);
    },

    removeNodeFromParent: function (node, parent) {
        node.parentNode.removeChild(node);
    },

    addElementToNode: function(element, node) {

        if (element == "") {return}

        if (node === 'body') {
            var dom = document.getElementsByTagName('body')[0];
                dom.appendChild(element);
        } else {
            var dom = document.getElementById(node.id);
            dom.appendChild(element);
        }
    }

});