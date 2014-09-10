// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Author: Chad Eubanks
// Copyright: @2014 The Code Boutique, LLC
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

Alto.ContainerView = Alto.CoreView.extend ({

    classNames: ["alto-container-view"],

    tag: "div",

    rootView: "",

    rootViewDidChange: function() {

        var containerId = Alto.guidFor(this),
            containerNode = document.querySelector('#'+containerId),
            containerChildView = this.get('rootView'),
            APP = Alto.applicationName;

        while (containerNode.firstChild) {
            containerNode.removeChild(containerNode.firstChild);
        }
        Alto.DomUtil.addElementToNode(this.get('rootView'), containerNode);

    }.observes("rootView")

});