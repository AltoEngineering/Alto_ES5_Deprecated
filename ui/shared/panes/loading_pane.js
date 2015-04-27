Alto.LoadingPane = Alto.View.extend({
    classNames: ['alto-panel-pane'],
    childViews: ['contentView'],

    contentView: Alto.View.extend({
        classNames: ['loader']
    })

});