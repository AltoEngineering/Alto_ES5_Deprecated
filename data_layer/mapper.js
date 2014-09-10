Alto.Mapper = Alto.Object.create ({

    record: "",

    arr: [],

    createRecordFromJson: function (recordInstance, json) {

        for(var key in json) {
            var value = json[key];
            if (!Alto.none(recordInstance.getPath(key))) {
                recordInstance.set(key, value);
            } else {
                Alto.console.log("Can not set missing property \"%@\" on model".fmt(value), Alto.console.warnColor);
            }
        }

        return recordInstance;
    }

});