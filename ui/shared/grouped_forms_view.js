// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2015 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC
// ==========================================================================

Alto.GroupedFormsView = Alto.CoreView.extend({
    childViews: ['sectionTitle', 'contentView'],

    tag: 'div',

    title: null,

    sectionTitle: Alto.LabelView.extend({
        classNames: ['section-title'],
        titleBinding: 'parentView.title'
    }),

    contentView: Alto.View.extend({
    })


});
