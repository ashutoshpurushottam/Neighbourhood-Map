var map;

// Initialize the default infoWindow
var infoWindow = new google.maps.InfoWindow({
	// default content
	content: ''
});

var ViewModel = function() {
	'use strict';

	var self = this;

	self.restaurants = ko.observableArray([]);

	// load google map (synchronous call)
	self.loadMap = function() {
		map = new google.maps.Map(document.getElementById('map-container'), {
			center: {lat: 37.3861, lng: -122.0839},
			zoom: 12
    	});
	}

	// add restaurants 
	self.restaurantItems = function() {
		restaurants.forEach(function(item) {
			self.restaurants.push( new Restaurant(item) );
    	});
	}

	// listener for clicks on restaurants
	self.setRestaurantClicks = function() {
		self.restaurants().forEach(function(restaurant) {
			google.maps.event.addListener(restaurant.marker(), 'click', function() {
				self.clickRestaurantMarker(restaurant);
			});
		});
	};	

	self.clickRestaurantMarker = function(restaurant) {
		var modalContent = '<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' 
		+ '<div class="modal-dialog">' + '<div class="modal-content">' + '<div class="modal-header">' 
		+ '<h4 class="modal-title" id="myModalLabel">'+ restaurant.name() + '</h4>' + '</div>' 
		+ '<div class="modal-body">' + restaurant.description()
		+ '<div><span id="rating-text">Yelp Rating:</span>' + '<img id="rating-img">'+ '</div>' 
		+ '</div></div></div>';

		infoWindow.setContent(modalContent);
		infoWindow.open(map, restaurant.marker());

		self.yelpRequest(restaurant);
	}

	self.yelpRequest = function(restaurant) {
		// generate random string for oauth_nonce
		// https://blog.nraboy.com/2015/03/create-a-random-nonce-string-using-javascript/
		var generateNonce = function() {
			var text = "";
			var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
			for(var i = 0; i < 20; i++) {
		        text += characters.charAt(Math.floor(Math.random() * characters.length));
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

		var encodedSignature = oauthSignature.generate('GET', yelpURL, parameters, yelpKeyData.consumerSecret, yelpKeyData.tokenSecret);

		parameters.oauth_signature = encodedSignature;

		var ajaxSettings = {
			url: yelpURL,
			data: parameters,
			cache: true,
			dataType: 'jsonp',
			success: function(response) {
				console.log(response);
				$('#rating-img').attr("src", response.businesses[0].rating_img_url);
			},
			error: function() {
				$('#rating-text').html('Could not retrieve ratings from Yelp.');
			}
		};

		// Yelp request
		$.ajax(ajaxSettings);
	}


	google.maps.event.addDomListener(window, 'load', function() {
		// load map
		self.loadMap();
		// add restaurant markers
		self.restaurantItems();
		// add restaurant clicks
		self.setRestaurantClicks();

	});

}

// Apply ViewModel bindings
ko.applyBindings(new ViewModel());

