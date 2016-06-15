alto_require('frameworks/shared/altojs/ui/utilities/date.js');
alto_require('frameworks/shared/altojs/ui/view.js');
alto_require('frameworks/shared/altojs/ui/label_view.js');

Alto.DateTextfieldView = Alto.View.extend({

    title: null,

    isoDate: null,

    includeFutureYears: false,

    formattedDate: null,

    viewWillLoad: function () {
        var node = document.createElement('div'),
            title = document.createElement('div'),
            day = document.createElement('select'),
            month = document.createElement('select'),
            year = document.createElement('select');

        this.viewDidLoad(node, title, day, month, year);
    },

    viewDidLoad: function (node, title, day, month, year) {
        var that = this;

        node.className = 'date-textfield-view';

        title.className = 'title';
        title.innerText = this.get('title');

        day.className = 'day-select-view';
        month.className = 'month-select-view';
        year.className = 'year-select-view';
        day.addEventListener("input", function () {
            that.dateDidChange(day, month, year);
        }, false);

        month.addEventListener("input", function () {
            that.dateDidChange(day, month, year);
        }, false);

        year.addEventListener("input", function () {
            that.dateDidChange(day, month, year);
        }, false);

        node.appendChild(title);
        node.appendChild(month);
        node.appendChild(day);
        node.appendChild(year);

        this._super(node);
    },

    viewCreateSubViews: function (monthIndex, year) {
        var monthSelectNode = this.get('node').children[1],
            daySelectNode = this.get('node').children[2],
            yearSelectNode = this.get('node').children[3],
            monthOptions = Alto.date.monthsAbbreviated,
            dayOptions;

        if (monthIndex) {

            //months with 30 days
            if (Alto.isEqual(monthIndex, 3) || Alto.isEqual(monthIndex, 5) ||
                Alto.isEqual(monthIndex, 8) || Alto.isEqual(monthIndex, 10)) {
                dayOptions = 30;
            }
            //february, check for leap year
            else if (Alto.isEqual(monthIndex, 1)) {

                // If the year is evenly divisible by 4, proceed. Otherwise, go NOT a leap year.
                if (year && Alto.isEqual(year / 4 % 2, 0)) {

                    //If the year is evenly divisible by 100, proceed. Otherwise, it is a leap year.
                    if (Alto.isEqual(year / 100 % 2, 0)) {

                        //If the year is evenly divisible by 400, it is a leap year. Otherwise, it is NOT a leap year.
                        if (Alto.isEqual(year / 400 % 2, 0)) {
                            dayOptions = 29;
                        } else {
                            dayOptions = 28;
                        }
                    } else {
                        dayOptions = 29;
                    }

                } else {
                    dayOptions = 28;
                }
            } else {
                dayOptions = 31;
            }

        } else {
            dayOptions = 31;
        }

        //build day select menu
        this.buildDaySelectMenu(daySelectNode, 1, dayOptions);

        //build month select menu
        this.buildMonthsSelectMenu(monthSelectNode, monthOptions);

        //build year select menu
        this.buildYearSelectMenu(yearSelectNode, 1940, 2016);

        if (this.get('formattedDate')) {
            var formattedDate = this.get('formattedDate'),
                day = ((new Date(this.get('formattedDate'))).getDate()).toString(),
                month = Alto.date.monthsAbbreviated[(new Date(this.get('formattedDate'))).getMonth()],
                year = ((new Date(this.get('formattedDate'))).getFullYear()).toString();

            daySelectNode.value = day;
            monthSelectNode.value = month;
            yearSelectNode.value = year;
        }
    },

    buildMonthsSelectMenu: function (selectNode, months) {
        if (Alto.isEqual(selectNode.value, 'mm') || Alto.isEmpty(selectNode.value)) {
            selectNode.length = 0;
            this.addHintToSelectMenu(selectNode, 'mm');
        } else {
            var value = selectNode.value;

            selectNode.length = 0;
        }

        months.forEach(function (month) {
            var option = document.createElement('option');

            option.innerText = month;
            option.value = month;
            selectNode.appendChild(option);
        })

        if (value) {
            selectNode.value = value;
        }
    },

    buildDaySelectMenu: function (selectNode, currentIndex, max) {
        if (Alto.isEqual(selectNode.value, 'dd') || Alto.isEmpty(selectNode.value)) {
            selectNode.length = 0;
            this.addHintToSelectMenu(selectNode, 'dd');
        } else {
            var value = selectNode.value;

            selectNode.length = 0;
        }

        while (currentIndex <= max) {
            var option = document.createElement('option');

            option.innerText = currentIndex;
            option.value = currentIndex;
            selectNode.appendChild(option);

            currentIndex++;
        }

        if (value) {
            selectNode.value = value;
        }
    },

    buildYearSelectMenu: function (selectNode, currentIndex, max) {
        if (Alto.isEqual(selectNode.value, 'year') || Alto.isEmpty(selectNode.value)) {
            selectNode.length = 0;
            this.addHintToSelectMenu(selectNode, selectNode.className.split('-')[0]);
        }

        if (this.get('includeFutureYears')) {
            currentIndex = max;
            max = max + 10;
        }

        while (currentIndex <= max) {
            var option = document.createElement('option');

            option.innerText = currentIndex;
            option.value = currentIndex;
            selectNode.appendChild(option);

            currentIndex++;
        }
    },

    addHintToSelectMenu: function (selectNode, hint) {
        var option = document.createElement('option');

        option.innerText = hint;
        option.value = hint;
        option.selected = true;
        option.disabled = true;

        selectNode.appendChild(option);
    },

    dateDidChange: function (day, month, year) {
        var isDaySelected = !Alto.isEqual(day.value, 'dd'),
            isMonthSelected = !Alto.isEqual(month.value, 'mm'),
            isYearSelected = !Alto.isEqual(year.value, 'year');

        if (isDaySelected && isMonthSelected && isYearSelected) {
            this.set('formattedDate', '%@ %@, %@'.fmt(month.value, day.value, year.value));
        } else {
            this.set('formattedDate', '');
        }

        if (isMonthSelected && isYearSelected) {
            this.viewCreateSubViews(Alto.date.monthsAbbreviated.indexOf(month.value), year.value);
        } else if (isMonthSelected) {
            this.viewCreateSubViews(Alto.date.monthsAbbreviated.indexOf(month.value));
        }
    },

    formattedDateDidChange: Alto.observer('formattedDate', function () {
        if (Alto.isEmpty(this.get('formattedDate'))) {
            return
        }

        var isoDate = (new Date(this.get('formattedDate'))).toISOString();
        this.set('isoDate', isoDate);
    })

});