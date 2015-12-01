alto_require('frameworks/altojs/ui/shared/view.js');
alto_require('frameworks/altojs/ui/shared/label_view.js');
alto_require('frameworks/altojs/ui/desktop/select_view/select_view.js');
alto_require('frameworks/altojs/ui/shared/textfield_view.js');

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
        hint: 'Month',
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
            month = dateObject.get('now').getMonth(),
            date = dateObject.date(dateObject.get('now')),
            year = dateObject.year(dateObject.get('now'));

        this.set('month', this.get('months')[month]);
        this.set('date', date);
        this.set('year', year);
    },

    dateDidChange: function () {
        if(Alto.isPresent(this.get('month')) && Alto.isPresent(this.get('year'))) {
            // given month and year, find the number of days in that month
            var monthIndex = this.get('months').indexOf(this.get('month')),
                startDay = (new Date (this.get('year'), monthIndex, 1)).getDate(),
                numberOfDays = (new Date (this.get('year'), monthIndex + 1, 0)).getDate();
        } else {
            // default to current month's number of days
            var startDay = (new Date ((new Date).getFullYear(), (new Date).getMonth(), 1)).getDate(),
                numberOfDays = (new Date ((new Date).getFullYear(), (new Date).getMonth() + 1, 0)).getDate();
        }

        if(Alto.isEmpty(this.get('date')) || (this.get('date') >= startDay && this.get('date') <= numberOfDays)) {
            this.node.children[2].classList.remove('invalid');
        } else {
            this.node.children[2].classList.add('invalid');
        }
    }.observes('month,date,year'),

    yearDidChange: function () {
        var currentYear = (new Date).getFullYear();

        if(Alto.isEmpty(this.get('year')) || (this.get('year') >= 1902 && this.get('year') <= currentYear)) {
            this.node.children[3].classList.remove('invalid');
        } else {
            this.node.children[3].classList.add('invalid');
        }
    }.observes('year'),

    _dateDidChange: function () {
        // if date or year is invalid, add to form validation object
        if(this.node.children[2].className.contains('invalid') || this.node.children[3].className.contains('invalid')) {
            Alto.formValidationContainer.get('activeFormsLookup')[Alto.guidFor(this)] = this;
            this.set('isoDate', null);
        } else if (Alto.isEmpty(this.get('month')) || Alto.isEmpty(this.get('date')) || Alto.isEmpty(this.get('year'))) {
            this.set('isoDate', null);
        } else {
            // set new iso date
            var dateObject = Alto.Date.create(),
                month = dateObject.get('months').indexOf(this.get('month')),
                year = this.get('year'),
                date = this.get('date'),
                jsDate = new Date(year, month, date);

            this.set('isoDate', jsDate.toISOString());

            // remove node if it was previously invalid
            if(Alto.formValidationContainer.get('activeFormsLookup')[Alto.guidFor(this)]) {
                delete Alto.formValidationContainer.get('activeFormsLookup')[Alto.guidFor(this)]
            }

        }
    }.observes('month,date,year')

});