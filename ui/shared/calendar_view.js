Alto.CalendarView = Alto.CoreView.extend(Alto.CalendarDelegate, {
    classNames: ['calendar-base-view'],

    calendarTable: null,

    monthYearLabel: null,

    selectedDate: null,

    selection:null,

    _currentSelectedCell: null,

    viewWillLoad: function () {
        var calenderBaseView = document.createElement('div'),
            calenderHeaderView = document.createElement('div'),
            calenderHeaderTitleView = document.createElement('div'),
            monthYearLabel = document.createElement('div'),
            calendarTable = document.createElement('table');

        this.set('selectedDate',this.today);// set current selection date with todays date on load.
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

        monthYearLabel.innerHTML = this.get('selectedDate').month() + ' ' + this.get('selectedDate').year();

        this.set('monthYearLabel', monthYearLabel);

        calenderHeaderTitleView.appendChild(monthYearLabel);
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
            todaysDate = this.get('selectedDate'), //today.date(),
            endDateOfTheMonth = endRange.getDate(),
            calendarTable = this.get('calendarTable'),
            currentCalendarCell,
            startDateFound = false;

        var count = 0,
            dayCellCount = 7 * 6;

        while (count < dayCellCount) {

            //hold reference to current scope
            var that = this;
            var clickFunction = function(){
                var date = that.selectedDate;
                that.didSelectDate(this,date);
            };

            currentCalendarCell = this._calanderMatrix[count];

            currentCalendarCell.cell.innerHTML = '';
            currentCalendarCell.cell.style.backgroundColor = 'rgba(255, 255, 255, 1.0)';

            if (this.selectedDate.days[currentCalendarCell.column] === this.selectedDate.days[startDayOfTheMonth]) {
                startDateFound = true;
            }

            if (startDateFound && startDateOfTheMonth <= endDateOfTheMonth) {
                currentCalendarCell.cell.innerHTML = startDateOfTheMonth;
                currentCalendarCell.cell.addEventListener('click',clickFunction,true);

                if (todaysDate.date() === startDateOfTheMonth) {
                    currentCalendarCell.cell.style.backgroundColor = 'transparent';
                    this.set('_currentSelectedCell',currentCalendarCell.cell);
                }

                startDateOfTheMonth ++
            }

            count++
        }

    },

    _updateMonthYearLabel: function () {
        var monthYearLabel = this.get('monthYearLabel');
        monthYearLabel.innerHTML = this.get('selectedDate').month() + ' ' + this.get('selectedDate').year();
    },

    _nextMonth: function() {
        var nextMonth = this.selectedDate.nextMonth();
        this.set('_displayMonth', nextMonth);
    },

    _previousMonth: function () {
        this.set('_displayMonth', this.selectedDate.previousMonth());
    },

    _displayMonthDidChange: function () {
        this.selectedDate.set('now', this.get('_displayMonth'));
        this._populateCalendarDaysWithDate(this.get('selectedDate').startOfMonth(), this.get('selectedDate'), this.get('selectedDate').endOfMonth());
        this._updateMonthYearLabel();
    }.observes('this._displayMonth'),

    didSelectDate: function (element, date) {
        var selectedDate = element.innerHTML;
        var jsDate       = date.formattedDateForDay(selectedDate);
        var dateObject   = Alto.Date.create().set('now',jsDate); //we always want to use alto date object
        this._updateSelectionForCell(element);
        this.set('selectedDate',dateObject);
        this.set('selection',jsDate);
    },

    selectionDidChange: function () {
    }.observes('this.selectedDate'),

    _updateSelectionForCell: function(element) {
        this.get('_currentSelectedCell').style.backgroundColor = 'rgba(255, 255, 255, 1.0)';
        element.style.backgroundColor = 'transparent';
        this.set('_currentSelectedCell',element);
    },

    _calanderMatrix: {}
});