Alto.date = Alto.Object.createWithMixins({

    days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],

    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],

    monthsAbbreviated: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],

    now: function () {
        return new Date();
    }.property().volatile(),

    formatDate: function(date) {

        if (Alto.isEmpty(date)) {
            return
        }

        var day = new Date (date).getUTCDate(),
            monthIndex = new Date (date).getMonth(),
            year = new Date (date).getFullYear();

        return '%@ %@, %@'.fmt(this.get('monthsAbbreviated')[monthIndex], day, year)
    },

    formatUTCHours: function(date) {
        var hour = (new Date (date)).getUTCHours(),
            min = (new Date (date)).getUTCMinutes().toString(),
            formattedMin, timeStamp;

        if (Alto.isEqual(min.length, 1)) {
            formattedMin = "0%@".fmt(min);
        } else {
            formattedMin = min;
        }

        if (hour > 12) {
            timeStamp = "%@:%@pm".fmt(hour-12, formattedMin);
        } else {
            timeStamp = "%@:%@am".fmt(hour, formattedMin);
        }

        return timeStamp;
    },

    formatHours: function(date) {
        var hour = (new Date (date)).getHours(),
            min = (new Date (date)).getMinutes().toString(),
            formattedMin, timeStamp;

        if (Alto.isEqual(min.length, 1)) {
            formattedMin = "0%@".fmt(min);
        } else {
            formattedMin = min;
        }
        
        if (hour > 12) {
            timeStamp = "%@:%@pm".fmt(hour-12, formattedMin);
        } else if (Alto.isEqual(hour, 0)) {
            //midnight test case
            timeStamp = "%@:%@am".fmt(12, formattedMin);
        } else {
            timeStamp = "%@:%@am".fmt(hour, formattedMin);
        }

        return timeStamp;
    }
});