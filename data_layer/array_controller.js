// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2014 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC
// ==========================================================================

/**
 A controller stores record instances and allows a view to bind to a proprty path for the views data.  All controller
 logic should be limitied to dealing with data.

 @module Data
 @class Alto.ArrayController
 @extends Alto.Object
 @since Alto 0.0.1
 @author Chad Eubanks
 */


Alto.ArrayController = Alto.ArrayController.reopen({

    content: [],

    patchContent: function (record, hashTable) {
        var priorContent = this.get('content'),
            newContent = [];

        if (hashTable) {
            priorContent.removeAt(hashTable[record.id]);
        }

        priorContent.forEach(function (obj) {
            newContent.pushObject(obj);
        });

        newContent.push(record);

        this.set('content', newContent);

    }

});