Alto.DataStore = Alto.Object.extend({

    arrayController: null,

    objectController: null,

    datasource: null,

    model: null,

    url: null,

    commitRecord: function (data) {
        var that = this,
            datasource = that.get('datasource').create(),
            data = that.serialize(data),
            url = this.get('url');

        return new Alto.RSVP.Promise(function (succeeded, failed) {
            datasource.saveRecord(url, data).then(function (json) {
                var record = that.deserialize(that.get('model').createWithMixins(), json);

                that.arrayController.get('content').addObject(record);
                that.objectController.set('content', record);

                if (LW.loadingPane) {
                    LW.loadingPane.remove();
                }
                succeeded();
            }, function (error) {
                failed(error);
            })
        })
    },

    commitRecords: function () {

    },

    deleteRecord: function () {
        var that = this,
            datasource = that.get('datasource').create(),
            url = this.get('url');

        return new Alto.RSVP.Promise(function (succeeded, failed) {
            datasource.deleteRecord(url).then(function () {
                var arr = [];

                that.arrayController.get('content').forEach(function (object, index) {
                    if (Alto.isPresent(object) && Alto.isEqual(object.get('id'), that.get('objectController.id'))) {
                        that.arrayController.get('content').removeAt(index);
                    }
                });

                that.arrayController.set('content', arr);

                that.objectController.set('content', {});

                if (LW.loadingPane) {
                    LW.loadingPane.remove();
                }
                succeeded();
            }, function (error) {
                failed(error);
            })
        })
    },

    deleteRecords: function () {

    },

    findRecord: function () {
        var that = this,
            datasource = that.get('datasource').create(),
            url = this.get('url');

        this.get('objectController').set('content', {});

        return new Alto.RSVP.Promise(function (succeeded, failed) {

            datasource.fetchRecord(url).then(function (json) {

                that.objectController.set('content', that.deserialize(that.get('model').create(), json));

                if (LW.loadingPane) {
                    LW.loadingPane.remove();
                }
                succeeded(json);
            }, function (error) {
                failed(error);
            })
        })
    },

    findRecords: function () {
        var that = this,
            datasource = that.get('datasource').create(),
            url = this.get('url');

        this.get('arrayController').set('content', []);

        return new Alto.RSVP.Promise(function (succeeded, failed) {

            datasource.fetchRecords(url).then(function (json) {
                if (Alto.isPresent(json)) {
                    json.forEach(function (obj) {
                        that.arrayController.get('content').addObject(that.deserialize(that.get('model').create(), obj));
                    });

                    that.objectController.set('content', that.arrayController.get('content').objectAt(0));
                }

                if (LW.loadingPane) {
                    LW.loadingPane.remove();
                }
                succeeded(json);
            }, function (error) {
                failed(error);
            })
        })
    },

    updateRecord: function (data) {
        var that = this,
            datasource = that.get('datasource').create(),
            data = this.serialize(data),
            url = this.get('url');

        return new Alto.RSVP.Promise(function (succeeded, failed) {

            datasource.updateRecord(url, data).then(function (json) {
                var content = that.arrayController.get('content') ? that.get('arrayController.content') : that.get('objectController.content'),
                    newRecord = that.deserialize(that.get('model').create(), json);

                that.updateArrayContent(content, newRecord);

                that.objectController.set('content', newRecord);

                if (LW.loadingPane) {
                    LW.loadingPane.remove();
                }
                succeeded(json);
            }, function (error) {
                failed(error);
            })
        })
    },

    updateRecords: function (data) {
        var that = this,
            datasource = that.get('datasource').create(),
            data = that.serializeRecords(data),
            url = this.get('url');

        return new Alto.RSVP.Promise(function (succeeded, failed) {

            datasource.updateRecord(url, data).then(function (json) {
                var arr = [];

                json.forEach(function (object) {
                    arr.addObject(that.deserialize(that.get('model').create(), object));
                })
                that.set('arrayController', arr);
                // todo update controller with updated records
                if (LW.loadingPane) {
                    LW.loadingPane.remove();
                }
                succeeded(json);
            }, function (error) {
                failed(error);
            })
        })
    },


    // internal use only //

    deserialize: function (recordInstance, json, stringFormat) {

        if (!stringFormat) {
            stringFormat = 'camelize';
        }

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

            // todo refactor to hanlde a null value assigned to a records attribute
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

    serialize: function (record, stringifyRecord, stringFormat) {
        var json = {};

        if (Alto.isEmpty(stringifyRecord)) {
            stringifyRecord = true;
        }

        if (Alto.isEmpty(stringFormat)) {
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

        if (Alto.isEmpty(record)) {
            Alto.Logger.error('Empty record. Expecting record to contain keys.');
            return;
        }

        Alto.keys(record).forEach(function (recordKey) {
            if (recordKey.indexOf('Binding') > -1) {
                json[recordKey.slice(recordKey.length - 7, recordKey.length)[stringFormat]()] = record.get(recordKey);
            } else {
                json[recordKey[stringFormat]()] = record[recordKey];
            }
        });

        // hack for some odd bug
        if (json.binding) {
            delete json.binding;
        }

        if (json.hasOwnProperty('is_selected')) {
            delete json.is_selected;
        }

        if (stringifyRecord) {
            return JSON.stringify(json);
        } else {
            return json;
        }
    },

    serializeRecords: function (array) {
        var that = this,
            updatedArray = [];

        array.forEach(function (object) {
            updatedArray.addObject(that.serialize(object, true))
        })

        return JSON.stringify(updatedArray);
    },

    updateArrayContent: function (content, newRecord, id) {
        var arr = [];

        content.forEach(function (record) {

            if (Alto.isPresent(id) && Alto.isEqual(record.get(id), newRecord.get(id))) {
                arr.addObject(newRecord);
            } else if (Alto.isPresent(record.get('id')) && Alto.isEqual(record.get('id'), newRecord.get('id'))) {
                arr.addObject(newRecord);
            } else {
                arr.addObject(record)
            }
        });

        this.arrayController.set('content', arr);
    }

});