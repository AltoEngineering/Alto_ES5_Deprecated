Alto.Date = Alto.Object.extend ({

    days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],

    months: ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],

    monthsAbbreviated: ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'],

    now: function () {
        return new Date();
    }.property().volatile(),

    day: function (day) {
        return day ? this.get('days')[day.getDay()] : this.get('days')[this.get('now').getDay()];
    },

    month: function (month) {
        return month ? this.get('months')[month.getMonth()] : this.get('months')[this.get('now').getMonth() + 1];
    },

    year: function (year) {
        return year ? year.getFullYear() : this.get('now').getFullYear();
    },

    date: function (date) {
        return date ? date.getDate() : this.get('now').getDate();
    },

    startOfMonth: function() {
        return new Date (this.get('now').getFullYear(), this.get('now').getMonth(), 1);
    },

    endOfMonth: function() {
        return new Date (this.get('now').getFullYear(), this.get('now').getMonth() + 1, 0);
    },

    nextMonth: function() {
        return new Date (this.get('now').getFullYear(), this.get('now').getMonth() +  1);
    },

    previousMonth: function (){
        return new Date (this.get('now').getFullYear(), this.get('now').getMonth() -1 );
    },

    formattedDateForDay: function(day) {
        return new Date (this.get('now').getFullYear(), this.get('now').getMonth(),day);
    },

    convertFormattedDateToDateObject: function(formattedDate) {
        debugger;
        var month =  formattedDate.split('/')[0],
            date = formattedDate.split('/')[1],
            year = formattedDate.split('/')[2],
            jsDate = new Date(),
            altoDate = Alto.Date.create();

        jsDate.setMonth(month - 1);
        jsDate.setDate(date);
        jsDate.setYear(year);

       return altoDate.set('now', jsDate);

    }
});