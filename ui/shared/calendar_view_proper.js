Alto.CalendarViewProper = Alto.CoreView.extend({
    classNames: ['calendar-base-view'],

    /**
     Table that displays the entire calender.
     @property calendarTable
     */
    calendarTable: null,

    /**
     Shows the current month and year that is displayed.
     @property monthYearLabel
     @type String
     */
    monthYearLabel: null,

    /**
     The current cell that is currently selected.
     @property _currentSelectedCell
     */
    _currentSelectedCell: null,

    /**
     The background color of the calender cells.
     @property cellBackgroundColor
     */
    cellBackgroundColor: 'white',

    /**
     The background colof of the selected calender cell.
     @property cellBackgroundColorSelected
     */
    cellBackgroundColorSelected: '#eaf4ff',

    /**
     @property saveAction
     */
    saveAction: null,

    today: Alto.Date.create(),

    selectedDate: '', //iso format

    selectedDateAltoObject: function () {
        return Alto.Date.create({now: new Date(Date.parse(this.get('selectedDate')))});
    }.property('selectedDate'),

    _displayMonth: null,

    viewWillLoad: function () {
        var calenderBaseView = document.createElement('div'),
            calenderHeaderView = document.createElement('div'),
            calendarPreviousMonthButton = document.createElement('button'),
            calendarNextMonthButton = document.createElement('button'),
            calenderHeaderTitleView = document.createElement('div'),
            monthYearLabel = document.createElement('div'),
            calendarTable = document.createElement('table'),
            saveButton = document.createElement('button');

       if (Alto.isEmpty(this.get('selectedDateAltoObject'))) { this.set('selectedDateAltoObject', this.today.get('now').toISOString())}
        this.viewDidLoad(calenderBaseView, calenderHeaderView, calendarPreviousMonthButton, calendarNextMonthButton, calenderHeaderTitleView, monthYearLabel, calendarTable, saveButton);
    },

    viewDidLoad: function (calenderBaseView, calenderHeaderView, calendarPreviousMonthButton, calendarNextMonthButton, calenderHeaderTitleView, monthYearLabel, calendarTable, saveButton) {
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
        saveButton.classList.add("saveButton", "alto-text-button-main");

        saveButton.textContent = "Save";

        monthYearLabel.innerHTML = this.get('selectedDateAltoObject').month() + ' ' + this.get('selectedDateAltoObject').year();

        this.set('monthYearLabel', monthYearLabel);

        calendarPreviousMonthButton.addEventListener("click", function () {
            that._previousMonth(that)
        }, false);
        calendarNextMonthButton.addEventListener("click", function () {
            that._nextMonth(that)
        }, false);
        saveButton.addEventListener("click", function () {
            that._saveCalendarDates(that)
        }, false);

        calenderHeaderTitleView.appendChild(monthYearLabel);
        calenderHeaderView.appendChild(calendarPreviousMonthButton);
        calenderHeaderView.appendChild(calendarNextMonthButton);
        calenderHeaderView.appendChild(calenderHeaderTitleView);
        calenderHeaderView.appendChild(saveButton);

        calendarTable = this._createCalendarDayHeader(calendarTable);
        calendarTable = this._createCalendarDays(calendarTable);

        this.set('calendarTable', calendarTable);

        calenderBaseView.appendChild(calenderHeaderView);
        calenderBaseView.appendChild(this.get('calendarTable'));

        this._populateCalendarDaysWithDate(this.get('selectedDateAltoObject').startOfMonth(), this.get('selectedDateAltoObject'), this.get('selectedDateAltoObject').endOfMonth());

        this._super(calenderBaseView);
    },

    /**
     * @method _createCalendarDayHeader
     * @param calendarTable
     * @returns {*}
     * @private
     */
    _createCalendarDayHeader: function (calendarTable) {
        var calendarDayHeaderRow = document.createElement('tr'),
            calendarDayHeaderCell,
            count = 0;

        calendarDayHeaderRow.className = "calendarDayHeaderRow";

        while (count <= 6) {
            calendarDayHeaderCell = document.createElement('th');

            calendarDayHeaderCell.innerHTML = this.get('selectedDateAltoObject').days[count]
            calendarDayHeaderRow.appendChild(calendarDayHeaderCell);
            count++;
        }

        calendarTable.appendChild(calendarDayHeaderRow);

        return calendarTable;

    },

    /**
     * @method _createCalendarDays
     * @param calendarTable
     * @returns {*}
     * @private
     */
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

    /**
     *
     * @param startRange
     * @param today
     * @param endRange
     * @private
     */
    _populateCalendarDaysWithDate: function (startRange, today, endRange) {
        var startDateOfTheMonth = startRange.getDate(),
            startDayOfTheMonth = startRange.getDay(),
            todaysDate = this.get('selectedDateAltoObject'), //today.date(),
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
                if (evt.target.innerHTML === "") {
                    return
                }
                var date = that.get('selectedDateAltoObject');
                that.didSelectDate(evt, date);
            };

            currentCalendarCell = this._calanderMatrix[count];

            currentCalendarCell.cell.innerHTML = '';
            currentCalendarCell.cell.style.backgroundColor = this.get('cellBackgroundColor');

            if (this.get('selectedDateAltoObject').days[currentCalendarCell.column] === this.get('selectedDateAltoObject').days[startDayOfTheMonth]) {
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

    /**
     * @method _updateMonthYearLabel
     */
    _updateMonthYearLabel: function () {
        var monthYearLabel = this.get('monthYearLabel');
        monthYearLabel.innerHTML = this.get('selectedDateAltoObject').month() + ' ' + this.get('selectedDateAltoObject').year();
    },

    /**
     * @method _nextMonth
     */
    _nextMonth: function (that) {
        that.set('_displayMonth', that.get('selectedDateAltoObject').nextMonth());
    },

    /**
     * @method _previousMonth
     */
    _previousMonth: function (that) {
        that.set('_displayMonth', that.get('selectedDateAltoObject').previousMonth());

    },

    /**
     * @method _saveCalendarDates
     */
    _saveCalendarDates: function (that) {
        var APP = Alto.applicationName

        window[APP].statechart.dispatchEvent(this.get('saveAction', this));
    },

    _displayMonthDidChange: function () {
        this.get('selectedDateAltoObject').set('now', this.get('_displayMonth'));
        this._populateCalendarDaysWithDate(this.get('selectedDateAltoObject').startOfMonth(), this.get('selectedDateAltoObject'), this.get('selectedDateAltoObject').endOfMonth());
        this._updateMonthYearLabel();
    }.observes('this._displayMonth'),

    /**
     * @method didSelectDate
     * @param event
     * @param date
     */
    didSelectDate: function (evt, date) {
        var element = evt.target,
            selectedDate = element.innerHTML,
            jsDate = date.formattedDateForDay(selectedDate),
            altoDateObject = Alto.Date.create().set('now', jsDate);

        this._updateSelectionForCell(element);
        this.set('selectedDate', altoDateObject.now.toISOString());
    },

    /**
     * @method _updateSelectionForCell
     * @param element
     */
    _updateSelectionForCell: function (element) {
        this.get('_currentSelectedCell').style.backgroundColor = this.get('cellBackgroundColor');
        element.style.backgroundColor = this.get('cellBackgroundColorSelected');
        this.set('_currentSelectedCell', element);
    },


    _calanderMatrix: {},

    _calanderHTMLMatrix: {}

});