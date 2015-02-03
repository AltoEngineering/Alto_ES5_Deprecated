Alto.CalendarView = Alto.CoreView.extend(Alto.CalendarDelegate, {
    classNames: ['calendar-base-view'],

    calendarTable: null,

    monthYearLabel: null,

    selectedDate: null,

    _currentSelectedCell: null,

    cellBackgroundColor: 'white',

    cellBackgroundColorSelected: '#eaf4ff',

    viewWillLoad: function () {
        var calenderBaseView = document.createElement('div'),
            calenderHeaderView = document.createElement('div'),
            calendarPreviousMonthButton = document.createElement('button'),
            calendarNextMonthButton = document.createElement('button'),
            calenderHeaderTitleView = document.createElement('div'),
            monthYearLabel = document.createElement('div'),
            calendarTable = document.createElement('table');

        this.set('selectedDate', this.today); // set current selection date with todays date on load.
        this.viewDidLoad(calenderBaseView, calenderHeaderView, calendarPreviousMonthButton, calendarNextMonthButton, calenderHeaderTitleView, monthYearLabel, calendarTable);
    },

    viewDidLoad: function (calenderBaseView, calenderHeaderView, calendarPreviousMonthButton, calendarNextMonthButton, calenderHeaderTitleView, monthYearLabel, calendarTable) {
        var that = this

        if (this.isFullScreen) {
            calenderBaseView.className += " alto-view-full-screen"
        }

        calenderHeaderView.className = "calendarHeaderView";
        calendarPreviousMonthButton.className = "calendarPreviousMonthButton";
        calendarNextMonthButton.className = "calendarNextMonthButton";
        calenderHeaderTitleView.className = "calenderHeaderTitleView";
        monthYearLabel.className = "monthYearLabel";
        calendarTable.className = "calendarTable";

        monthYearLabel.innerHTML = this.get('selectedDate').month() + ' ' + this.get('selectedDate').year();

        this.set('monthYearLabel', monthYearLabel);

        calendarPreviousMonthButton.addEventListener("click", function(){that._previousMonth(that) }, false);
        calendarNextMonthButton.addEventListener("click", function(){that._nextMonth(that) }, false);

        calenderHeaderTitleView.appendChild(monthYearLabel);
        calenderHeaderView.appendChild(calendarPreviousMonthButton);
        calenderHeaderView.appendChild(calendarNextMonthButton);
        calenderHeaderView.appendChild(calenderHeaderTitleView);

        calendarTable = this._createCalendarDayHeader(calendarTable);
        calendarTable = this._createCalendarDays(calendarTable);

        this.set('calendarTable', calendarTable);

        calenderBaseView.appendChild(calenderHeaderView);
        calenderBaseView.appendChild(this.get('calendarTable'));

        this._populateCalendarDaysWithDate(this.get('selectedDate').startOfMonth(), this.get('selectedDate'), this.get('selectedDate').endOfMonth());

        this._super(calenderBaseView);
    },

    _createCalendarDayHeader: function (calendarTable) {
        var calendarDayHeaderRow = document.createElement('tr'),
            calendarDayHeaderCell,
            count = 0;

        calendarDayHeaderRow.className = "calendarDayHeaderRow";

        while (count <= 6) {
            calendarDayHeaderCell = document.createElement('th');

            calendarDayHeaderCell.innerHTML = this.get('selectedDate').days[count]
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
                count <= 6 ? row = 0 : row++;
                calendarWeekRow = document.createElement('tr');
            }

            if (count != 0 && count % 6 === 0) {
                calendarTable.appendChild(calendarWeekRow)
            }

            if (column <= 6) {
                column++
            }

            calendarDayCell = document.createElement('td');
            calendarWeekRow.appendChild(calendarDayCell);


            this._calanderMatrix[count].row = row;
            this._calanderMatrix[count].column = column;
            this._calanderMatrix[count].cell = calendarDayCell;

            if (column === 6) {
                column = -1;
            }
            count++
        }

        return calendarTable;
    },

    _populateCalendarDaysWithDate: function (startRange, today, endRange) {
        var startDateOfTheMonth = startRange.getDate(),
            startDayOfTheMonth = startRange.getDay(),
            todaysDate = this.get('selectedDate'), //today.date(),
            endDateOfTheMonth = endRange.getDate(),
            calendarTable = this.get('calendarTable'),
            currentCalendarCell,
            startDateFound = false;

            this._calanderHTMLMatrix = {};

        var count = 0,
            dayCellCount = 7 * 6;

        while (count < dayCellCount) {

            //hold reference to current scope
            var that = this;
            var _eventHandler = function (evt) {
                if (evt.target.innerHTML === "") {return}
                var date = that.selectedDate;
                that.didSelectDate(evt, date);
            };

            currentCalendarCell = this._calanderMatrix[count];

            currentCalendarCell.cell.innerHTML = '';
            currentCalendarCell.cell.style.backgroundColor = this.get('cellBackgroundColor');

            if (this.selectedDate.days[currentCalendarCell.column] === this.selectedDate.days[startDayOfTheMonth]) {
                startDateFound = true;
            }

            if (startDateFound && startDateOfTheMonth <= endDateOfTheMonth) {
                currentCalendarCell.cell.innerHTML = startDateOfTheMonth;
                currentCalendarCell.cell.addEventListener('click', _eventHandler, true);
                this._calanderHTMLMatrix[startDateOfTheMonth] = {};
                this._calanderHTMLMatrix[startDateOfTheMonth].cell = currentCalendarCell.cell;

                if (todaysDate.date() === startDateOfTheMonth) {
                    currentCalendarCell.cell.style.backgroundColor = this.get('cellBackgroundColorSelected');
                    this.set('_currentSelectedCell', currentCalendarCell.cell);
                }

                startDateOfTheMonth++
            }

            count++
        }

    },

    _updateMonthYearLabel: function () {
        var monthYearLabel = this.get('monthYearLabel');
        monthYearLabel.innerHTML = this.get('selectedDate').month() + ' ' + this.get('selectedDate').year();
    },

    _nextMonth: function (that) {
        that.set('_displayMonth', that.selectedDate.nextMonth());
    },

    _previousMonth: function (that) {
        that.set('_displayMonth', that.selectedDate.previousMonth());
    },

    _displayMonthDidChange: function () {
        this.selectedDate.set('now', this.get('_displayMonth'));
        this._populateCalendarDaysWithDate(this.get('selectedDate').startOfMonth(), this.get('selectedDate'), this.get('selectedDate').endOfMonth());
        this._updateMonthYearLabel();
    }.observes('this._displayMonth'),

    didSelectDate: function (evt, date) {
        var element = evt.target,
            selectedDate = element.innerHTML,
            jsDate = date.formattedDateForDay(selectedDate),
            altoDateObject = Alto.Date.create().set('now', jsDate);

        this._updateSelectionForCell(element);
        this.set('selectedDate', altoDateObject);
    },

    _updateSelectionForCell: function (element) {
        this.get('_currentSelectedCell').style.backgroundColor = this.get('cellBackgroundColor');
        element.style.backgroundColor = this.get('cellBackgroundColorSelected');
        this.set('_currentSelectedCell', element);
    },

    _calanderMatrix: {},

    _calanderHTMLMatrix: {}

});