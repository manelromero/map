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
// Model
var Location = function(data, marker, infoWindow) {
	this.name = ko.observable(data.name);
	this.address = ko.observable(data.address);
	this.position = ko.observable(data.position);
	this.marker = ko.observable(marker);
	this.infoWindow = ko.observable(infoWindow)
};
// ViewModel
var ViewModel = function() {

	var self = this;

	this.allMarkers = ko.observableArray([]);

	mapMarkers.forEach(function(data) {
		var marker = new google.maps.Marker({
			position: data.position,
			map: map,
			animation: google.maps.Animation.DROP,
			title: data.name
		});
		var infoText = '<div class="map-name">' +	data.name +
				'</div><div class="map-address">' +	data.address + '</div>';
		var infoWindow = new google.maps.InfoWindow({
					content: infoText
				});

		marker.addListener('click', function() {
			infoWindow.open(map, marker);
		});

		self.allMarkers.push(new Location(data, marker, infoWindow));

	});

	this.showInfo = function(loc) {
		loc.infoWindow().open(map, loc.marker());
	}

	this.hideInfo = function(loc) {
		loc.infoWindow().close();
	}

};

ko.applyBindings(new ViewModel());

