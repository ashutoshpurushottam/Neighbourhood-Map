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
			center: {lat: 12.9716, lng: 77.5946},
			zoom: 11
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
		+ '<div class="modal-body">' + restaurant.description() + '</div>' + '</div></div></div>';

		infoWindow.setContent(modalContent);
		infoWindow.open(map, restaurant.marker());
	}

	var modalContent = 

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

