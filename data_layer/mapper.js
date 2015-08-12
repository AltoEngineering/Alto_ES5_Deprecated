// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2014 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC
// ==========================================================================

/**
 Alto.Mapper is converts JSON to an Alto.Record and an Alto.Record to JSON.

 @module Data
 @class Alto.Mapper
 @extends Alto.Object
 @since Alto 0.0.1
 @author Chad Eubanks
 */

Alto.Mapper = Alto.Object.create({

    /**
     @method createRecordFromJson
     @param {String} recordInstance An instantiated version of a model class
     @param {String} json The json you will map to your record
     @param {Alto.String} the type of formatting your record expects: ex (json key) foo_bar | (record key) fooBar
     */
    createRecordFromJson: function (recordInstance, json, stringFormat) {
        if (stringFormat && !Alto.String[stringFormat]) {
            Alto.Logger.error('unknown string format given.  Alto.String does not have a method called', stringFormat);
            return;
        }

        for(var key in json) {
            var value = json[key];

            if(Object.prototype.toString.call(json) !== '[object Object]' ) {
                return;
            }

            if (stringFormat && Alto.String[stringFormat]) {
                key = Alto.String[stringFormat](key);
            }

            if (!Alto.isNone(recordInstance.get(key))) {

                if (Alto.isNone(value)) {
                    value = ''
                }

                if (!recordInstance.__alto_meta__.descs[key]) {
                    recordInstance.set(key, value);
                }

            } else {
                Alto.Console.log("Can not set missing property \"%@\" on model".fmt(key), Alto.Console.warnColor);
            }
        }

        return recordInstance;
    },

    deserializeRecordToJson: function (record, stringFormat) {
        var json = {};

        if (!stringFormat) {
            stringFormat = 'underscore'
        }

        if (!Alto.String[stringFormat]) {
            Alto.Logger.error('unknown string format given.  Alto.String does not have a method called', stringFormat);
            return;
        }

        if (!record instanceof Alto.Object) {
            Alto.Logger.error('Unknown record type given.  Expecting record to be instance of Alto.Object');
            return;
        }

        Alto.keys(record).forEach(function (recordKey) {
            json[recordKey[stringFormat]()] = record.get(recordKey);
        });

        return JSON.stringify(json);

    }

});