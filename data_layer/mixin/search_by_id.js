Alto.searchById = Alto.Object.createWithMixins({

    searchById: {},

    _contentDidChange: function () {
        var content = this.get('content'),
            self = this;

        content.forEach(function(employee, idx) {
            self.searchById[employee.id] = idx;
        });

    }.observes('content', 'content.length'),

    patchContent: function(record, mappedObjects) {
        Alto.propertyWillChange(this, 'content');
        this.get('content').replace(mappedObjects[record.id], 1, record);
        Alto.propertyDidChange(this, 'content');
    }

});