// Constructor for restaurant
var Restaurant = function(data) {
	// properties as observable
	this.name = ko.observable(data.name);
	this.lat = ko.observable(data.lat);
	this.lng = ko.observable(data.lng);
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