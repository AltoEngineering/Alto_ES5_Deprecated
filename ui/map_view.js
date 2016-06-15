alto_require('frameworks/shared/altojs/ui/core_view.js');

// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2014 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC
// ==========================================================================

/**
 Gives logging to your console some color.

 @module UI
 @class Alto.MapView
 @extends Alto.View
 @since Alto 0.0.1
 @author Anthony Alviz
 */

/**
 *  Load <script src="https://maps.googleapis.com/maps/api/js"></script>
 *  tag into index file to import google maps api.
 **/

Alto.MapView = Alto.CoreView.extend({

    /**
     * Default tag in reference to google map api
     **/
    tag: 'div',

    /**
     * Map is used as id in reference to google map api
     **/
    id: 'map',

    /**
     * For directions, the desired location taking from the users current location. Expects
     * an object of { lat: value, lng: value }
     **/
    destination: null,

    /**
     * The initial resolution at which to display the map. Value of 0 corresponds to a map of the Earth fully zoomed
     * out, and larger zoom levels zoom in at a higher resolution.
     **/
    zoom: 11,

    /**
     * A path to a custom icon to use as the destination marker.
     **/
    icon: null,

    /**
     * Default coordinates if the user denies permission of current location. Expects
     * an object of { lat: value, lng: value }
     **/
    defaultCoords: {lat: 25.7753, lng: -80.2089}, /** set to miami, florida **/

    viewWillLoad: function () {
        var node = this.get("tag");
        node = document.createElement(node);
        this.viewDidLoad(node);
    },

    viewDidLoad: function (node) {
        node ? node : node = document.createElement(this.get("tag"));
        node.id = this.get('id');

        if (node) {
            this.viewWillAppear(node);
        }

        this._super(node);
    },

    viewWillAppear: function (node) {
        if (Healthbook.get('isTestMode')) {
            //do nothing
        } else {
            var address = this.get('destination') ? this.get('destination') : this.get('defaultCoords'),
                directionsService = new google.maps.DirectionsService(),
                directionsDisplay = new google.maps.DirectionsRenderer(),
                zoomNum = this.get('zoom'),
                iconPath = this.get('icon');

            createMap = function (start) {
                var travel = {
                        origin: (start.coords) ? new google.maps.LatLng(start.lat, start.lng) : address,
                        destination: address,
                        travelMode: google.maps.DirectionsTravelMode.DRIVING
                        // Exchanging DRIVING to WALKING above can prove quite amusing :-)
                    },

                    mapOptions = {
                        zoom: zoomNum,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };

                map = new google.maps.Map(node, mapOptions);
                directionsDisplay.setMap(map);

                directionsService.route(travel, function (result, status) {
                    if (status === google.maps.DirectionsStatus.OK) {
                        directionsDisplay.setDirections(result);
                    }
                });
            };

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                        createMap({
                            coords: true,
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        });
                    },
                    function () {
                        // default geolocation if permission is denied
                        var map = new google.maps.Map(node, {
                                zoom: zoomNum,
                                center: address
                            }),

                            marker = new google.maps.Marker({
                                position: address,
                                icon: iconPath,
                                map: map,
                                animation: google.maps.Animation.DROP,
                                optimized: false
                            });
                    }
                );
            } else {
                // exception case if permission is never asked
                var map = new google.maps.Map(node, {
                        zoom: zoomNum,
                        center: address
                    }),

                    marker = new google.maps.Marker({
                        position: address,
                        icon: iconPath,
                        map: map,
                        animation: google.maps.Animation.DROP,
                        optimized: false
                    });
            }
        }

        this.viewDidAppear(node);
    }
});