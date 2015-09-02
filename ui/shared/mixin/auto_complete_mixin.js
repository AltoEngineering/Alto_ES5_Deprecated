// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2014 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC and LifeWallet
// ==========================================================================

/**
 `Alto.AutoCompleteMixin` is a mixin that will help in textfield completion. The mixin take the value of the form
 while not empty to convert all characters to uppercase. With built in regex, it compares it to the `autoCompleteData`
 property and adds it to the `matches` array object.

 @module UI
 @class Alto.AutoCompleteMixin
 @extends Alto.Mixin
 @since Alto 0.0.1
 @author Chad Eubanks & Ryan Green
 */


Alto.AutoCompleteMixin = Alto.Mixin.create({

    lookupKey: null,

    autoCompleteData: '',

    matches: [],

    valueDidChange: function () {
        var value = this.get('value');

        if (value == '') {
            return
        }

        if (value.length == 1) {
            value = value.toUpperCase();
        }

        var substrRegex = new RegExp(value),
            i = 0,
            __matches = [],
            data = this.get('autoCompleteData');

        while (i < data.length) {
            if (substrRegex.test(data[i].get(this.get('lookupKey')))) {
                __matches.push(data[i]);
            }
            i++
        }

        this.set('matches', __matches);
        this._super();
    }.observes('this.value'),

    matchesDidChange: function () {
        console.log(this.get('matches'));
    }.observes('this.matches')

});