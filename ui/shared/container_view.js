// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2014 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC
// ==========================================================================

/**
 Gives logging to your console some color.

 @module UI
 @class Alto.ContainerView
 @extends Alto.CoreView
 @since Alto 0.0.1
 @author Chad Eubanks
 */
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