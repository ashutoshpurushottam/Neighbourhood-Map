var map;

// Initialize the default infoWindow
// Used for showing restaurant information
var infoWindow = new google.maps.InfoWindow({
    // default content
    content: ''
});

var ViewModel = function() {
    'use strict';
    var self = this;

    // store all restaurants
    self.restaurants = ko.observableArray([]);
    // store restaurants for search string
    self.filteredRestaurants = ko.observableArray([]);

    // load google map
    self.loadMap = function() {
        map = new google.maps.Map(document.getElementById('map-container'), {
            center: {
                lat: 37.3899,
                lng: -122.0839
            },
            zoom: 13
        });
    }

    // add all restaurants to the list
    self.restaurantItems = function() {
        restaurants.forEach(function(item) {
            var restaurant = new Restaurant(item);
            self.restaurants.push(restaurant);
            // drop animation on all markers
            restaurant.marker().setAnimation(google.maps.Animation.DROP);
        });
    }

    // listener for clicks on restaurants
    self.setRestaurantClicks = function() {
        self.restaurants().forEach(function(restaurant) {
            google.maps.event.addListener(restaurant.marker(), 
                'click', function() {
                self.clickRestaurantMarker(restaurant);
            });
        });
    };

    self.clickRestaurantMarker = function(restaurant) {
        // request for retrieving restaurant yelp rating
        self.yelpRequest(restaurant);

        // modal dialog (getbootstrap.net)
        var modalContent = '<div class="modal fade" id="myModal" tabindex="-1"\
         role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' + 
         '<div class="modal-dialog">' + '<div class="modal-content">' + 
         '<div class="modal-header">' + 
         '<h4 class="modal-title" id="myModalLabel">' + 
         restaurant.name() + '</h4>' + '</div>' + '<div class="modal-body">' + 
         restaurant.address() + '<br>' + restaurant.description() + 
         '<div><a id="url-yelp" target="_blank" class="yelp-link">\
         <span id="rating-text">Yelp Rating:</span></a>' 
         + '<img id="rating-img">' + '</div>' + '</div></div></div>';

        infoWindow.setContent(modalContent);
        infoWindow.open(map, restaurant.marker());

    };

    self.yelpRequest = function(restaurant) {
        // generate random string for oauth_nonce
        // https://blog.nraboy.com/2015/03/create-a-random-nonce-string-using-javascript/
        var generateNonce = function() {
            var text = "";
            var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghi\
            klmnopqrstuvwxyz0123456789";
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
            cache: true,
            dataType: 'jsonp',
            success: function(response) {
                console.log(response);
                $('#rating-img').attr("src", 
                    response.businesses[0].rating_img_url);
                $('#url-yelp').attr("href", 
                    response.businesses[0].url);
            },
            error: function() {
                $('#rating-text').html('Could not retrieve ratings from Yelp.');
            }
        };

        // Yelp request
        $.ajax(ajaxSettings);
    }



    // filtering of restaurants
    self.restaurantFilter = function() {
        self.filteredRestaurants([]);
        // length of list of restaurants
        var listLength = self.restaurants().length;
        // search string 
        var searchString = $('#search-string').val().toLowerCase();

        for (var i = 0; i < listLength; i++) {
            // each restaurant name 
            var restaurantName = self.restaurants()[i].name().toLowerCase();
            // each restaurant address
            var address = self.restaurants()[i].address().toLowerCase();
            // remove spaces from restaurant address using regex
            address = address.replace(/\s+/g, '');

            // add to the filtered list if name or address matches
            if (restaurantName.indexOf(searchString) > -1 ||
                address.indexOf(searchString) > -1) {
                self.filteredRestaurants.push(self.restaurants()[i]);
                // Set the map property of the marker to the map
                self.restaurants()[i].marker().setMap(map);
            } else {
                // for others make them null to be invisible
                self.restaurants()[i].marker().setMap(null);
            }
        }
    };


    google.maps.event.addDomListener(window, 'load', function() {
        // load map
        self.loadMap();
        // add restaurants 
        self.restaurantItems();
        // restaurant clicks
        self.setRestaurantClicks();
        // initialize with all restaurants
        self.filteredRestaurants(self.restaurants());
    });

}

// Apply ViewModel bindings
ko.applyBindings(new ViewModel());