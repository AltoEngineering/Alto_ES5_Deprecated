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

        for (var key in json) {
            var value = json[key];

            if (Object.prototype.toString.call(json) !== '[object Object]') {
                return;
            }

            if (stringFormat && Alto.String[stringFormat]) {
                key = Alto.String[stringFormat](key);
            }

            if (!Alto.isNone(recordInstance.get(key))) {

                if (Alto.isNone(value)) {
                    value = ''
                }
                ;

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
            if (recordKey.contains('Binding')) {
                json[recordKey.slice(recordKey.length - 7, recordKey.length)[stringFormat]()] = record.get(recordKey);
            } else {
                json[recordKey[stringFormat]()] = record.get(recordKey);
            }
        });

        // hack for some odd bug
        if (json.binding) {
            delete json.binding;
        }

        return JSON.stringify(json);
    },


    /**
     @method duplicateRecord
     @param {Object} content is the information used for duplication            -- Enroller.companyController.get('content')
     @param {String} name of the datastore used                                 -- 'companyDataStore' | 'CompanyDataStore'
     @param {String} method in the datastore used for deserializing             -- 'deserializeCompanyRecord'
     @param {String} name of the model to build the duplicated record           -- 'CompanyRecord'
     @param {String} controller to set the content too                          -- 'companyController'

     i.e. window[APP].controller.get('priorRecord')
     */
    duplicateRecord: function (content, datastore, datastoreMethod, recordInstance, controller) {
        var APP = Alto.applicationName,
            deseralizedData,
            serializedData,
            datastoreFormatValidation;

        //todo make our usage of this api consistant... right now Enroller's datastore's are singletons.  Enrollee's are not.
        // datastore should not be singleton

        if (typeof datastore != 'string') {
            // must pass in a string
            Alto.Logger.error('duplicateRecord() expects the datastore argument to be a string');
            return
        }

        datastoreFormatValidation = datastore.split('.');

        if (datastoreFormatValidation.length > 1) {
            // dont pass in a property path... must be just the class or instance name 'companyDataStore | CompanyDataStore
            Alto.Logger.error('duplicateRecord() expects the datastore argument to be a string name and not a property path.  Example: \'companyDataStore\' ');
            return
        }


        if (window[APP][datastore] instanceof Alto.Object) {
            // is this an instance?
            deseralizedData = JSON.stringify(window[APP][datastore][datastoreMethod](content));
        } else if (window[APP][datastore]) {
            // does this class exist?
            deseralizedData = JSON.stringify(window[APP][datastore].create()[datastoreMethod](content));
        }
        
        if (recordInstance instanceof Alto.Object) {
            // is this an instance?
            recordInstance;
        } else if (recordInstance) {
            // does this class exist?
            recordInstance = window[APP][recordInstance].create();
        }

        serializedData = Alto.Mapper.createRecordFromJson(recordInstance, JSON.parse(deseralizedData), 'camelize');
        window[APP][controller].set('priorRecord', serializedData);

    }

});