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

Alto.Mapper = Alto.Object.create ({

    /**
        @method createRecordFromJson
        @param {String} recordInstance An instantiated version of a model class
        @param {String} json The json you will map to your record
    */
    createRecordFromJson: function (recordInstance, json) {

        for(var key in json) {
            var value = json[key];
            if (!Alto.none(recordInstance.getPath(key))) {
                recordInstance.set(key, value);
            } else {
                Alto.Console.log("Can not set missing property \"%@\" on model".fmt(key), Alto.Console.warnColor);
            }
        }

        return recordInstance;
    }

});