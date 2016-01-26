// Set map size
function elemHeight() {
	document.getElementById('map').style.height = window.innerHeight - 70 + 'px'; // 70 is the size of #name div
}
elemHeight();
// Set map size if browser is resized
window.onresize = function() {
	elemHeight();
};

// Initiate map
var myLatLng = {lat: 41.387537, lng: 2.168632}; // Barcelona coordinates
var map = new google.maps.Map(document.getElementById('map'), {
	center: myLatLng,
	zoom: 13
});

var Marker = function(data) {

	this.name = ko.observable(data.name);
	this.address = ko.observable(data.address);
	this.position = ko.observable(data.position);

	this.addMarker = ko.computed(function() {

		var infoText = '<div class="map-name">' +	this.name() +
				'</div><div class="map-address">' +	this.address() + '</div>';
		var	infoWindow = new google.maps.InfoWindow({
			content: infoText
		});

		var marker = new google.maps.Marker({
			position: this.position(),
			map: map,
			animation: google.maps.Animation.DROP,
			title: this.name()
		});

		marker.addListener('click', function() {
			infoWindow.open(map, marker);
		});

	}, this);

};

var ViewModel = function() {

	var self = this;

	this.allMarkers = ko.observableArray([]);

	mapMarkers.forEach(function(data) {
		self.allMarkers.push(new Marker(data));
	});

};

ko.applyBindings(new ViewModel());

