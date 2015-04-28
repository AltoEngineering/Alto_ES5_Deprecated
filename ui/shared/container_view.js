// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2014 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC
// ==========================================================================

/**
`Alto.ContainerView` is an instance that creates a container on the DOM with a specific container id.

 @module UI
 @class Alto.ContainerView
 @extends Alto.CoreView
 @since Alto 0.0.1
 @author Chad Eubanks
 */
Alto.ContainerView = Alto.CoreView.extend ({

    classNames: ["alto-container-view"],

    tag: "div",

    /**
     * Main view that will be used to create the container.
     * @property rootView
     */
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