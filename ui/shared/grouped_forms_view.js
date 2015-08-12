// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2015 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC
// ==========================================================================

Alto.GroupedFormsView = Alto.CoreView.extend({
    childViews: ['sectionTitle', 'contentView'],

    tag: 'div',

    title: null,

    sectionTitleClassNames: ['section-title'],

    sectionTitle: Alto.LabelView.extend({
        classNamesBinding: 'parentView.sectionTitleClassNames',
        titleBinding: 'parentView.title'
    }),

    contentView: Alto.View.extend({
    })


});
