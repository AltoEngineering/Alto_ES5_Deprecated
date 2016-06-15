alto_require('frameworks/shared/altojs/data_layer/request.js');

// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2014 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC
// ==========================================================================

/**
 A datasource interacts with the network layer.  Here is where we will find basic CRUD calls, messaging of data, converting
 JSON to an Alto.Record aka a model, and converting an Alto.Record to JSON.

 @module Data
 @class Alto.DataSource
 @extends Alto.Object
 @since Alto 0.0.1
 @author Chad Eubanks
 */

Alto.DataSource = Alto.Object.extend({

    fetchRecords: function (url) {
        return new Alto.RSVP.Promise(function (succeeded, failed) {

            var request = Alto.Request.create({
                url: url,
                httpMethod: 'GET',
                requestHeaders: {
                    'Content-Type': 'application/json'
                },

                success: function () {
                    var json = JSON.parse(request.xhr.response);
                    succeeded(json);
                },

                error: function () {
                    failed();
                }

            })

        })
    },

    fetchRecord: function (url) {
        return new Alto.RSVP.Promise(function (succeeded, failed) {

            var request = Alto.Request.create({
                url: url,
                httpMethod: 'GET',
                requestHeaders: {
                    'Content-Type': 'application/json',
                    // 'AUTH-TOKEN': LW.networkApi.get('_sessionToken')
                },

                success: function () {
                    var json = JSON.parse(request.xhr.response);
                    succeeded(json);
                },

                error: function () {
                    failed();
                }

            })

        })
    },

    saveRecord: function (url, data) {
        return new Alto.RSVP.Promise(function (succeeded, failed) {

            var request = Alto.Request.create({
                url: url,
                httpMethod: 'POST',
                requestHeaders: {
                    'Content-Type': 'application/json'
                },
                data: data,

                success: function () {
                    var json = JSON.parse(request.xhr.response);
                    succeeded(json);
                },

                error: function (json) {
                    failed();
                }

            })

        })
    },

    updateRecord: function (url, data) {
        return new Alto.RSVP.Promise(function (succeeded, failed) {

            var request = Alto.Request.create({
                url: url,
                httpMethod: 'PUT',
                requestHeaders: {
                    'Content-Type': 'application/json'
                },
                data: data,

                success: function () {
                    var json = JSON.parse(request.xhr.response);
                    succeeded(json);
                },

                error: function () {
                    failed();
                }

            })

        })
    },

    deleteRecord: function (url, data) {
        return new Alto.RSVP.Promise(function (succeeded, failed) {

            var request = Alto.Request.create({
                url: url,
                httpMethod: 'DELETE',
                requestHeaders: {
                    'Content-Type': 'application/json'
                },

                success: function () {
                    succeeded();
                },

                error: function () {
                    failed();
                }

            })

        })
    }

});