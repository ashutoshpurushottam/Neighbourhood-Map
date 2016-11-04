var map;

var ViewModel = function() {
	'use strict';

	var self = this;

	var initialize = function() {
		console.log("initMap called");
		map = new google.maps.Map(document.getElementById('map-container'), {
			center: {lat: 12.9716, lng: 77.5946},
			zoom: 10
    	});

	}

	google.maps.event.addDomListener(window, 'load', initialize);

}

ko.applyBindings(new ViewModel());



// var map;

// function initMap() {
	// map = new google.maps.Map(document.getElementById('map-container'), {
	// 	center: {lat: 12.9716, lng: 77.5946},
	// 	zoom: 10
 //    });

 //    var bengaluru = {lat: 12.9716, lng: 77.5946};
 //    var marker = new google.maps.Marker({
 //    	position: bengaluru,
 //    	map: map
 //    });

// }
