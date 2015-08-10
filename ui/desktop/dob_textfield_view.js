Alto.DateTextField = Alto.View.extend({
    classNames: ['date-textfield'],
    childViews: ['labelView', 'monthSelectMenu', 'dayTextField', 'yearTextField'],

    keyLabelTitle: null,

    months: [],

    month: null,

    date: null,

    year: null,

    isoDate: null,

    init: function () {
        this._populateMonths();
        this._formatDate();
        this.viewWillLoad();
    },

    labelView: Alto.LabelView.extend({
        classNames: ['key-label-view'],
        titleBinding: 'parentView.keyLabelTitle'
    }),

    monthSelectMenu: Alto.SelectView.extend({
        classNames: ['month-select-menu'],
        optionsBinding: 'parentView.months',
        selectedOptionBinding: 'parentView.month'
    }),

    dayTextField: Alto.TextField.extend({
        classNames: ['day-text-field'],
        hint: 'dd',
        maxLength: 02,
        valueBinding: 'parentView.date',
        isRequired: false
    }),

    yearTextField: Alto.TextField.extend({
        classNames: ['year-text-field'],
        hint: 'yyyy',
        maxLength: 04,
        valueBinding: 'parentView.year',
        isRequired: false
    }),

    _populateMonths: function () {
        var months = Alto.Date.create().months

        this.set('months', months);
    },

    _formatDate: function() {
        if (Alto.isEmpty(this.get('isoDate'))) {return}

        var dateObject = Alto.Date.create({'now': new Date(Date.parse(this.get('isoDate')))}),
            month = dateObject.month(dateObject.get('now')),
            date = dateObject.date(dateObject.get('now')),
            year = dateObject.year(dateObject.get('now'));

        this.set('month', month);
        this.set('date', date);
        this.set('year', year);
    },

    _dateDidChange: function () {
        var dateObject = Alto.Date.create(),
            month = this.get('month')? dateObject.get('months').indexOf(this.get('month')) : dateObject.get('months').indexOf( dateObject.get('months')[0]),
            year = this.get('year'),
            date = this.get('date'),
            jsDate = new Date(year, month, date);

        debugger;

        this.set('isoDate', jsDate.toISOString());
    }.observes('month,date,year')

});