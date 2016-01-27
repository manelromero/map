// Set map size
function elemHeight() {
	document.getElementById('map').style.height = window.innerHeight - 60 + 'px'; // 70 is the size of #name div
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
// Model
var Location = function(data, marker, infoWindow) {
	this.name = ko.observable(data.name);
	this.address = ko.observable(data.address);
	this.position = ko.observable(data.position);
	this.marker = ko.observable(marker);
	this.infoWindow = ko.observable(infoWindow);
};
// ViewModel
var ViewModel = function() {

	var self = this;
	this.allMarkers = ko.observableArray([]);

	mapMarkers.forEach(function(data) {
		// Create markers and its info windows
		var marker = new google.maps.Marker({
					position: data.position,
					map: map,
					title: data.name
				}),
				infoText = '<div class="map-name">' +	data.name +
				'</div><div class="map-address">' +	data.address + '</div>',
				infoWindow = new google.maps.InfoWindow({content: infoText});
		marker.setAnimation(null);
		// Add event listener for info windows to map icons
		marker.addListener('click', function() {
			infoWindow.open(map, marker);
		});

		self.allMarkers.push(new Location(data, marker, infoWindow));

	});
	// Toggle info window for markers
	this.toggleInfo = function(loc) {
		var check = loc.infoWindow().anchor;
		if (typeof check == 'undefined' || check === null) {
			loc.infoWindow().open(map, loc.marker());
		} else {
			loc.infoWindow().close();
		}
	};
	// Toggle map marker bounce
	this.toggleBounce = function(loc) {
		if (loc.marker().getAnimation() !== null) {
			loc.marker().setAnimation(null);
		} else {
		loc.marker().setAnimation(google.maps.Animation.BOUNCE);
		}
	};

};

ko.applyBindings(new ViewModel());

