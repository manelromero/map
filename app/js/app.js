// Model
var Location = function(data, marker, infoWindow) {
	this.name = ko.observable(data.name);
	this.address = ko.observable(data.address);
	this.show = ko.observable(data.show);
	this.position = ko.observable(data.position);
	this.marker = marker;
	this.infoWindow = infoWindow;
};
// ViewModel
var ViewModel = function() {
	// Variables
	var self = this,
			filterField = document.getElementById('filter-field');
	this.filterText = ko.observable();
	this.allLocations = ko.observableArray([]);
	// Set map size
	function elemHeight() {
		document.getElementById('map').style.height = window.innerHeight - 60 + 'px'; // 70 is the size of #name div
	}
	elemHeight();
	// Change map size if browser is resized
	window.onresize = function() {
		elemHeight();
	};
	// Initiate map
	this.map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 41.387537, lng: 2.168632}, // Barcelona coordinates,
		zoom: 13
	});
	// Create locations and place them in the map
	mapLocations.forEach(function(data) {
		// Create markers and its info windows
		var marker = new google.maps.Marker({
					position: data.position,
					map: self.map,
					title: data.name
				}),
				infoText = '<div class="map-name">' +	data.name +
				'</div><div class="map-address">' +	data.address + '</div>' +
				'<div><a class="map-link" href="#">Wikipedia</a></div>' +
				'<div><a class="map-link" href="#">FourSquare</a></div>',
				infoWindow = new google.maps.InfoWindow({content: infoText});
		marker.setAnimation(null);
		// Add event listener for info windows in map markers
		marker.addListener('click', function() {
			// Toggle info window
			var check = infoWindow.anchor;
			if (typeof check == 'undefined' || check === null) {
				infoWindow.open(self.map, marker);
			} else {
				infoWindow.close();
			}
		});
		self.allLocations.push(new Location(data, marker, infoWindow));
	});
	//Start listening for the filter text
	filterField.addEventListener('input', function() {
		self.filterText(this.value.toLowerCase());
	});

	// Toggle info window for markers
	this.toggleInfo = function(loc) {
		google.maps.event.trigger(loc.marker, 'click');
	};
	// Toggle map marker bounce
	this.toggleBounce = function(loc) {
		if (loc.marker.getAnimation() !== null) {
			loc.marker.setAnimation(null);
		} else {
		loc.marker.setAnimation(google.maps.Animation.BOUNCE);
		}
	};
	// Filter locations
	this.filterLocations = ko.computed(function() {
		var filter = self.filterText() || '';
		self.allLocations().forEach(function(data) {
			var name = data.name().toLowerCase();
			if (name.indexOf(filter) == -1) {
				data.show(false);
				data.marker.setMap(null);
			} else {
				data.show(true);
				data.marker.setMap(self.map);
			}
		});
		return;
	});

};

ko.applyBindings(new ViewModel());


