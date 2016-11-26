// Yelp Constants
var yelpKeyData = {
        consumerKey: "6elNSWaVZM9nC76VherCWA",
        consumerSecret: "HfSD_E8RG-FGJb6Z2zJJdsCnYXo",
        token: "sYRyIBg8DOU7iID93eLUhLtEjS8J1WpJ",
        tokenSecret: "y4h0hIdiBdFZ2RsL4AWKpUFm2ak"
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
        animation: google.maps.Animation.BOUNCE,
        title: this.name()
    });

    // set marker as observable
    this.marker = ko.observable(marker);

};