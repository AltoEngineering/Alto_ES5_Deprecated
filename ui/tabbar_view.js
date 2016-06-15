alto_require('frameworks/shared/altojs/ui/core_view.js');
alto_require('frameworks/shared/altojs/ui/view.js');
alto_require('frameworks/shared/altojs/ui/container_view.js');
alto_require('frameworks/shared/altojs/ui/list_view.js');
alto_require('frameworks/shared/altojs/ui/label_view.js');

Alto.TabbarView = Alto.CoreView.extend({
    childViews: ['ContainerView', 'BottomToolbar'],

    tag: 'div',

    nowShowing: '',

    cellAction: 'internal',
/*
    data: [
        {title: "Tab 1", value: "MyApp.tabsPage.view1"},
        {title: "Tab 2", value: "MyApp.tabsPage.view2"}
    ]
    */
    data: [],

    ContainerView: Alto.ContainerView.extend({
        classNames: ['container-view'],
        nowShowingBinding: 'parentView.nowShowing'
    }),

    BottomToolbar: Alto.View.extend({
        classNames: ['bottom-toolbar'],
        childViews: ['ListView'],

        ListView: Alto.ListView.extend({
            classNames: ['list-view'],
            dataBinding: 'parentView.parentView.data',

            Cell: Alto.Cell.extend({
                classNames: ['cell'],
                childViews: ['CellLabel'],
                actionBinding: 'parentView.parentView.parentView.cellAction',

                CellLabel: Alto.LabelView.extend({
                    classNames: ['cell-label'],
                    titleBinding: 'parentView.data.title'
                })

            }),

            companyCurrentTabDidChange: Alto.observer('Companies.tabbarController.currentSelectedTab', function () {
                this.parentView.parentView.set('nowShowing', Companies.tabbarController.get('currentSelectedTab').value);
            }),

            policyCurrentTabDidChange: Alto.observer('Policies.tabbarController.currentSelectedTab', function () {
                this.parentView.parentView.set('nowShowing', Policies.tabbarController.get('currentSelectedTab').value);
            })

        })

    })

});