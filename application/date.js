Alto.Date = Alto.Object.extend ({

    days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],

    months: ['Januray', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],

    now: function () {
        return new Date();
    }.property().volatile(),

    day: function (day) {
        return day ? this.get('days')[day.getDay()] : this.get('days')[this.get('now').getDay()];
    },

    month: function (month) {
        return month ? this.get('months')[month.getMonth()] : this.get('months')[this.get('now').getMonth()];
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
    }
});