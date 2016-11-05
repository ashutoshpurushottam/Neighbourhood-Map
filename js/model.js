// Yelp Constants
var yelpKeyData = {
	consumerKey: 'F5APQyb0l7Em1n9zaVUNsQ',
	consumerSecret: '3dYrzpG46RBg4uk_uLuHyUwi1rI',
	token: 'EsMVBbm6XcJsvvAjbqPec7Fm6oibxnK9',
	tokenSecret: 'cZ57WmK7BvKmk-Irq6dFanfnqjA'
};



// Constructor for restaurant
var Restaurant = function(data) {
	// properties as observable
	this.name = ko.observable(data.name);
	this.lat = ko.observable(data.lat);
	this.lng = ko.observable(data.lng);
	this.description = ko.observable(data.description);
	this.address = ko.observable(data.address);

	// marker
	var marker;
	marker = new google.maps.Marker({
		position: new google.maps.LatLng(this.lat(), this.lng()),
		map: map,
		title: this.name()
	});

	// set marker as observable
	this.marker = ko.observable(marker);	

};