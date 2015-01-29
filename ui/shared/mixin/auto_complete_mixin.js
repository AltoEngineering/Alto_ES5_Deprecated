// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2014 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC and LifeWallet
// ==========================================================================

/**
 Adds autocompletion to textfields.

 @module UI
 @class Alto.AutoCompleteMixin
 @extends Alto.Mixin
 @since Alto 0.0.1
 @author Chad Eubanks & Ryan Green
 */


Alto.AutoCompleteMixin = Alto.Mixin.create({

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
            if (substrRegex.test(data[i])) {
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