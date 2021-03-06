var ViewModel = function() {
    'use strict';
    var self = this;

    // store all restaurants
    self.restaurants = ko.observableArray([]);
    // store restaurants for search string
    self.filteredRestaurants = ko.observableArray([]);
    // add all restaurants to the list
    self.restaurantItems = function() {
        restaurants.forEach(function(item) {
            var restaurant = new Restaurant(item);
            self.restaurants.push(restaurant);
            // drop animation on all markers
            restaurant.marker().setAnimation(google.maps.Animation.DROP);
        });
    };

    self.searchString = ko.observable('');

    self.worker = ko.computed(function() {
        if (self.searchString()) self.restaurantFilter();
    }, this);

    // filtering of restaurants
    self.restaurantFilter = function() {
        self.filteredRestaurants([]);
        // length of list of restaurants
        var listLength = self.restaurants().length;
        // search string 
        //var searchString = $('#search-string').val().toLowerCase();
        var search = self.searchString();

        for (var i = 0; i < listLength; i++) {
            // each restaurant name 
            var restaurantName = self.restaurants()[i].name().toLowerCase();
            // each restaurant address
            var address = self.restaurants()[i].address().toLowerCase();
            // remove spaces from restaurant address using regex
            address = address.replace(/\s+/g, '');

            // add to the filtered list if name or address matches
            if (restaurantName.indexOf(search) > -1 ||
                address.indexOf(search) > -1) {
                self.filteredRestaurants.push(self.restaurants()[i]);
                // Set the map property of the marker to the map
                self.restaurants()[i].marker().setVisible(true);
            } else {
                // for others make them null to be invisible
                self.restaurants()[i].marker().setVisible(false);
            }
        }
    };

    // listener for clicks on restaurants
    self.setRestaurantClicks = function() {
        self.restaurants().forEach(function(restaurant) {
            google.maps.event.addListener(restaurant.marker(),
                'click',
                function() {
                    self.clickRestaurantMarker(restaurant);
                });
        });
    };

    self.clickRestaurantMarker = function(restaurant) {
        // Animation on marker
        restaurant.marker().setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            restaurant.marker().setAnimation(null);
        }, 500);
        // pan to clicked restaurant
        map.panTo(new google.maps.LatLng(restaurant.lat(), restaurant.lng()));
        // request for retrieving restaurant yelp rating
        self.yelpRequest(restaurant);
    };

    self.yelpRequest = function(restaurant) {
        // generate random string for oauth_nonce
        // https://blog.nraboy.com/2015/03/create-a-random-nonce-string-using-javascript/
        var generateNonce = function() {
            var text = "";
            var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for (var i = 0; i < 20; i++) {
                text += characters.charAt(Math.floor(
                    Math.random() * characters.length));
            }
            return text;
        };

        var yelpURL = 'http://api.yelp.com/v2/search/';

        var parameters = {
            oauth_consumer_key: yelpKeyData.consumerKey,
            oauth_token: yelpKeyData.token,
            oauth_nonce: generateNonce(),
            oauth_timestamp: Math.floor(Date.now() / 1000),
            oauth_signature_method: 'HMAC-SHA1',
            oauth_version: '1.0',
            callback: 'cb',
            term: restaurant.name(),
            location: 'Mountain View, CA',
            limit: 1
        };


        var encodedSignature = oauthSignature.generate('GET',
            yelpURL,
            parameters,
            yelpKeyData.consumerSecret,
            yelpKeyData.tokenSecret);

        parameters.oauth_signature = encodedSignature;

        var ajaxSettings = {
            url: yelpURL,
            data: parameters,
            timeout: 3000,
            cache: true,
            dataType: 'jsonp',
            success: function(response) {
                var infoWindow = new google.maps.InfoWindow({
                    // default content
                    content: ''
                });
                var imageUrl = response.businesses[0].rating_img_url;
                var url = response.businesses[0].url;
                var modalContent;
              

                if (imageUrl && url) {
                    // modal dialog (getbootstrap.net)
                    modalContent = '<div class="modal fade" id="myModal" tabindex="-1"' +
                        'role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
                        '<div class="modal-dialog">' + '<div class="modal-content">' +
                        '<div class="modal-header">' +
                        '<h4 class="modal-title" id="myModalLabel">' +
                        restaurant.name() + '</h4>' + '</div>' + '<div class="modal-body">' +
                        restaurant.address() + '<br>' + restaurant.description() +
                        '<div><a id="url-yelp" target="_blank" class="yelp-link" href="' + 
                        url + '">' + '<br><span id="rating-text">Yelp Rating: </span></a>' 
                        + '<img src="' + imageUrl + '">' + '</div>' + '</div></div></div>';
                } else {
                    modalContent = '<div class="modal fade" id="myModal" tabindex="-1"' +
                        'role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
                        '<div class="modal-dialog">' + '<div class="modal-content">' +
                        '<div class="modal-header">' +
                        '<h4 class="modal-title" id="myModalLabel">' +
                        restaurant.name() + '</h4>' + '</div>' + '<div class="modal-body">' +
                        restaurant.address() + '<br>' + restaurant.description() +
                        '<br><div><span id="rating-text">Could not retrieve yelp rating</span></a>' 
                        + '</div></div></div>';
                }
                infoWindow.setContent(modalContent);
                infoWindow.open(map, restaurant.marker());

            },
            error: function() {
                var infoWindow = new google.maps.InfoWindow({
                    // default content
                    content: ''
                });

                // modal dialog (getbootstrap.net)
                var modalContent = '<div class="modal fade" id="myModal" tabindex="-1"' +
                    'role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
                    '<div class="modal-dialog">' + '<div class="modal-content">' +
                    '<div class="modal-header">' +
                    '<h4 class="modal-title" id="myModalLabel">' +
                    restaurant.name() + '</h4>' + '</div>' + '<div class="modal-body">' +
                    restaurant.address() + '<br>' + restaurant.description() +
                    '<br><div><span id="rating-text">Could not retrieve yelp rating</span></a>' 
                    + '</div></div></div>';

                infoWindow.setContent(modalContent);
                infoWindow.open(map, restaurant.marker());
            }
        };

        // Yelp request
        $.ajax(ajaxSettings);
    };


    google.maps.event.addDomListener(window, 'load', function() {
        self.restaurantItems();
        // restaurant clicks
        self.setRestaurantClicks();
        // initialize with all restaurants
        self.filteredRestaurants(self.restaurants());
    });

};

var map;

function loadMap() {
    map = new google.maps.Map(document.getElementById('map-container'), {
        center: {
            lat: 37.3899,
            lng: -122.0839
        },
        zoom: 13
    });

    ko.applyBindings(new ViewModel());
}

function googleError() {
    alert("Error in loading google map");
}