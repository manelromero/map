// Map bounds
var LOC_SW = [41.365, 2.123];
var LOC_NE = [41.414, 2.221];

// Model
var Location = function(data, marker, infoWindow) {
	this.id = data.id;
	this.name = ko.observable(data.name);
	this.address = ko.observable(data.address);
	this.show = ko.observable(true);
	this.icon = ko.observable(data.icon);
	this.position = ko.observable(data.position);
	this.marker = marker;
	this.infoWindow = infoWindow;
};

// Bounce marker
Location.prototype.bounce = function() {
	var obj;
	if (this.hasOwnProperty('marker')) {
		obj = this.marker;
	} else {
		obj = this;
	}
	obj.setAnimation(google.maps.Animation.BOUNCE);
		setTimeout(function() {
			obj.setAnimation(null);
	}, 750);
};

// Extra info
Location.prototype.extraInfo = function() {
	modalWindow = document.getElementsByClassName('modal')[0];
	// Delete modal window content
	document.getElementsByClassName('flickr-pictures')[0].innerHTML = '';
	document.getElementsByClassName('wiki-content')[0].innerHTML = '';
	// Open modal window
	modalWindow.style.display = 'block';
	// Listener for clicking the close 'x'
	document.getElementsByClassName('close')[0].addEventListener('click', function(){
		modalWindow.style.display = 'none';
	});
	// Load Flickr pictures
	var flickrUrl = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=dc610307d5d7e99c3a682062435787d5',
			picUrl;
	$.getJSON(flickrUrl, {
		text: this.name,
		per_page: 5,
		format: 'json',
		nojsoncallback: 1
	})
	.done(function(data) {
		if (data.photos.photo.length > 0) {
			$.each(data.photos.photo, function(i, item) {
				picUrl = 'http://farm' + item.farm + '.static.flickr.com/' + item.server + '/' + item.id + '_' + item.secret + '.jpg';
				flickrPictures.push({'pictureUrl': picUrl});
			});
		} else {
			document.getElementsByClassName('flickr-pictures')[0].innerHTML = '<div>Sorry, Flickr images could not be loaded</div>';
		}
	})
	.fail(function(error) {
		document.getElementsByClassName('flickr-images')[0].innerHTML = '<div>Sorry, Flickr images could not be loaded</div>';
	});
	// Load Wikipedia links
	//wikiLinks().length = 0;
	$.ajax({
		url: 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + this.name(),
		dataType: 'jsonp',
		headers: { 'Api-User-Agent': 'Example/1.0' },
		success: function(data) {
			var articles = data[1];
			if (articles.length > 0) {
				for (var i = 0; i < articles.length; i++) {
					var articleText = articles[i],
							wikiLink = 'http://en.wikipedia.org/wiki/' + articleText;
					wikiLinks.push({
						'linkName': articleText,
						'wikiLink': wikiLink,
					});
				}
			} else {
				document.getElementsByClassName('wiki-content')[0].innerHTML = 'Sorry, no links from Wikipedia for this location';
			}
		}
	});
};

// ViewModel
var ViewModel = function() {

	// Variables
	var self = this,
			filterField = document.getElementsByClassName('filter-field')[0],
			mapLocations = [];

	self.filterText = ko.observable();
	flickrPictures = ko.observableArray([]);
	wikiLinks = ko.observableArray([]);
	self.allLocations = ko.observableArray([]);
	self.map = new google.maps.Map(document.getElementsByClassName('map')[0]);

	// Store data in localStorage
	localStorage.mapLocations = JSON.stringify(locations);
	mapLocations = JSON.parse(localStorage.mapLocations);

	// Set map size
	function elemHeight() {
		document.getElementsByClassName('map')[0].style.height = window.innerHeight - 60 + 'px'; // 60 is the size of .name div
	}

	// Change map size if browser is resized
	window.onresize = function() {
		elemHeight();
	};

	// Close modal window when click outside it
	window.onclick = function(event) {
		if (event.target == modal) {
			modalWindow.style.display = 'none';
		}
	};

	// Create locations and place them in the map
	self.drawMap = function() {
		// Set map size
		elemHeight();

		// Extend map
		var locSW = new google.maps.LatLng(LOC_SW[0], LOC_SW[1]),
				locNE = new google.maps.LatLng(LOC_NE[0], LOC_NE[1]),
				bounds = new google.maps.LatLngBounds(locSW, locNE),
				locs = 0;
		self.map.fitBounds(bounds);

		// Create markers and its info windows
		mapLocations.forEach(function(data) {
			data.id = locs;
			var marker = new google.maps.Marker({
						position: data.position,
						map: self.map,
						icon: data.icon,
						title: data.name
					}),
					infoText = '<div class="map-name">' +	data.name +
					'</div><div class="map-address">' +	data.address + '</div>' +
					'<div><a class="info-link">+info</a></div>',
					infoWindow = new google.maps.InfoWindow({content: infoText});
			// New Location
			self.allLocations.push(new Location(data, marker, infoWindow));
			locs++;

			// Add event listener for info windows in map markers
			marker.addListener('click', function() {
				// Close all info windows
				for (var i = 0; i < self.allLocations().length; i++) {
					self.allLocations()[i].infoWindow.close();
				}
				// Open info window
				infoWindow.open(self.map, marker);
				document.getElementsByClassName('info-link')[0].addEventListener('click', function() {
					self.allLocations()[data.id].extraInfo();
				});
				self.allLocations()[data.id].bounce();
			});
		});
	};

	//Start listening for the filter text
	filterField.addEventListener('input', function() {
		self.filterText(self.value.toLowerCase());
	});

	// Toggle info window for list elements
	self.toggleInfo = function(loc) {
		google.maps.event.trigger(loc.marker, 'click');
	};

	// Filter locations
	self.filterLocations = ko.computed(function() {
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

	self.drawMap();

};

function startModel() {
	ko.applyBindings(new ViewModel());
}

function googleMapsError() {
	document.getElementsByClassName('map')[0].innerHTML = '<div class="google-error">Sorry, Google Map could not be loaded</div>';
}
