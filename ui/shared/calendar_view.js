Alto.CalendarView = Alto.CoreView.extend(Alto.CalendarDelegate, {
    classNames: ['calendar-base-view'],

    calendarTable: null,

    monthYearLabel: null,

    viewWillLoad: function () {
        var calenderBaseView = document.createElement('div'),
            calenderHeaderView = document.createElement('div'),
            calenderHeaderTitleView = document.createElement('div'),
            monthYearLabel = document.createElement('div'),
            calendarTable = document.createElement('table');

        this.viewDidLoad(calenderBaseView, calenderHeaderView, calenderHeaderTitleView, monthYearLabel, calendarTable);
    },

    viewDidLoad: function (calenderBaseView, calenderHeaderView, calenderHeaderTitleView, monthYearLabel, calendarTable) {

        if (this.isFullScreen) {
            calenderBaseView.className += " alto-view-full-screen"
        }

        calenderHeaderView.className = "calendarHeaderView";
        calenderHeaderTitleView.className = "calenderHeaderTitleView";
        monthYearLabel.className = "monthYearLabel";
        calendarTable.className = "calendarTable";

        monthYearLabel.innerHTML = this.get('today').month() + ' ' + this.get('today').year();

        this.set('monthYearLabel', monthYearLabel);

        calenderHeaderTitleView.appendChild(monthYearLabel);
        calenderHeaderView.appendChild(calenderHeaderTitleView);

        calendarTable = this._createCalendarDayHeader(calendarTable);
        calendarTable = this._createCalendarDays(calendarTable);

        this.set('calendarTable', calendarTable);

        calenderBaseView.appendChild(calenderHeaderView);
        calenderBaseView.appendChild(this.get('calendarTable'));

        this._populateCalendarDaysWithDate(this.get('today').startOfMonth(), this.get('today'), this.get('today').endOfMonth());

        this._super(calenderBaseView);
    },

    _createCalendarDayHeader: function (calendarTable) {
        var calendarDayHeaderRow = document.createElement('tr'),
            calendarDayHeaderCell,
            count = 0;

        calendarDayHeaderRow.className = "calendarDayHeaderRow";

        while (count <= 6) {
            calendarDayHeaderCell = document.createElement('th');

            calendarDayHeaderCell.innerHTML = this.get('today').days[count]
            calendarDayHeaderRow.appendChild(calendarDayHeaderCell);
            count++;
        }

        calendarTable.appendChild(calendarDayHeaderRow);

        return calendarTable;

    },

    _createCalendarDays: function (calendarTable) {
        var count = 0,
            dayCellCount = 7 * 6,
            calendarWeekRow,
            calendarDayCell,
            row,
            column = -1;

        while (count < dayCellCount) {
            this._calanderMatrix[count] = {};

            if (count === 0 || count % 7 === 0) {
                count <= 6 ? row = 0 : row ++;
                calendarWeekRow = document.createElement('tr');
            }

            if (count != 0 && count % 6 === 0) {
                calendarTable.appendChild(calendarWeekRow)
            }

            if (column <= 6) {
                column ++
            }

            calendarDayCell = document.createElement('td');
            calendarWeekRow.appendChild(calendarDayCell);

            this._calanderMatrix[count].row = row;
            this._calanderMatrix[count].column = column;
            this._calanderMatrix[count].cell = calendarDayCell;

            if (column === 6) {column = -1;}
            count++
        }

        return calendarTable;
    },

    _populateCalendarDaysWithDate: function (startRange, today, endRange) {
        var startDateOfTheMonth = startRange.getDate(),
            startDayOfTheMonth = startRange.getDay(),
            todaysDate = today.date(),
            endDateOfTheMonth = endRange.getDate(),
            calendarTable = this.get('calendarTable'),
            currentCalendarCell,
            startDateFound = false;

        var count = 0,
            dayCellCount = 7 * 6;

        while (count < dayCellCount) {
            currentCalendarCell = this._calanderMatrix[count];

            currentCalendarCell.cell.innerHTML = '';
            currentCalendarCell.cell.style.backgroundColor = 'rgba(255, 255, 255, 1.0)';

            if (this.today.days[currentCalendarCell.column] === this.today.days[startDayOfTheMonth]) {
                startDateFound = true;
            }

            if (startDateFound && startDateOfTheMonth <= endDateOfTheMonth) {
                currentCalendarCell.cell.innerHTML = startDateOfTheMonth;

                if (todaysDate === startDateOfTheMonth) {
                    currentCalendarCell.cell.style.backgroundColor = 'transparent';
                }

                startDateOfTheMonth ++
            }

            count++
        }

    },

    _updateMonthYearLabel: function () {
        var monthYearLabel = this.get('monthYearLabel');

        monthYearLabel.innerHTML = this.get('today').month() + ' ' + this.get('today').year();
    },

    _nextMonth: function() {
        var nextMonth = this.today.nextMonth();
        this.set('_displayMonth', nextMonth);
    },

    _previousMonth: function () {
        this.set('_displayMonth', this.today.previousMonth());
    },

    _displayMonthDidChange: function () {
        this.today.set('now', this.get('_displayMonth'));
        this._populateCalendarDaysWithDate(this.get('today').startOfMonth(), this.get('today'), this.get('today').endOfMonth());
        this._updateMonthYearLabel();
    }.observes('this._displayMonth'),

    _calanderMatrix: {}

});