// Model
var Location = function(data, marker, infoWindow) {
	this.name = ko.observable(data.name);
	this.address = ko.observable(data.address);
	this.show = ko.observable(data.show);
	this.icon = ko.observable(data.icon);
	this.position = ko.observable(data.position);
	this.marker = marker;
	this.infoWindow = infoWindow;
};

// ViewModel
var ViewModel = function() {

	// Variables
	var self = this,
			filterField = document.getElementsByClassName('filter-field')[0],
			modalWindow = document.getElementsByClassName('modal')[0],
			mapLocations = [];

	this.filterText = ko.observable();
	this.allLocations = ko.observableArray([]);
	this.flickrPictures = ko.observableArray([]);
	this.wikiLinks = ko.observableArray([]);
	this.map = new google.maps.Map(document.getElementsByClassName('map')[0]);

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
	this.drawMap = function() {
		elemHeight();
		if (!this.map) {
			document.getElementsByClassName('map')[0].innerHTML = 'Sorry, map could not be loaded';
		}

		// Extend map
		var locSW = new google.maps.LatLng(41.365, 2.123),
				locNE = new google.maps.LatLng(41.414, 2.221),
				bounds = new google.maps.LatLngBounds(locSW, locNE);
		this.map.fitBounds(bounds);

		mapLocations.forEach(function(data) {
			// Create markers and its info windows
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
			// Add event listener for info windows in map markers
			marker.addListener('click', function() {
				// Toggle info window
				var check = infoWindow.anchor;
				if (typeof check == 'undefined' || check === null) {
					infoWindow.open(self.map, marker);
					var links = document.getElementsByClassName('info-link');
					links[links.length - 1].addEventListener('click', function() {
						self.extraInfo(marker);
					});
					self.bounce(marker);
					} else {
					infoWindow.close();
				}
			});
			self.allLocations.push(new Location(data, marker, infoWindow));
		});
	};

	//Start listening for the filter text
	filterField.addEventListener('input', function() {
		self.filterText(this.value.toLowerCase());
	});

	// Extra info
	this.extraInfo = function(loc) {
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
			text: loc.title,
			per_page: 5,
			format: 'json',
			nojsoncallback: 1
		})
		.done(function(data) {
			if (data.photos.photo.length > 0) {
				$.each(data.photos.photo, function(i, item) {
					picUrl = 'http://farm' + item.farm + '.static.flickr.com/' + item.server + '/' + item.id + '_' + item.secret + '.jpg';
					self.flickrPictures.push({'pictureUrl': picUrl});
				});
			} else {
				document.getElementsByClassName('flickr-pictures')[0].innerHTML = '<div>Sorry, Flickr images could not be loaded</div>';
			}
		})
		.fail(function(error) {
			document.getElementsByClassName('flickr-images')[0].innerHTML = '<div>Sorry, Flickr images could not be loaded</div>';
		});
		// Load Wikipedia links
		self.wikiLinks([]);
		$.ajax({
			url: 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + loc.title,
			dataType: 'jsonp',
			headers: { 'Api-User-Agent': 'Example/1.0' },
			success: function(data) {
				var articles = data[1];
				if (articles.length > 0) {
					for (var i = 0; i < articles.length; i++) {
						var articleText = articles[i],
								wikiLink = 'http://en.wikipedia.org/wiki/' + articleText;
						self.wikiLinks.push({
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

	// Toggle info window for list elements
	this.toggleInfo = function(loc) {
		google.maps.event.trigger(loc.marker, 'click');
	};

	// Bounce marker
	this.bounce = function(loc) {
		var obj;
		if (loc.hasOwnProperty('marker')) {
			obj = loc.marker;
		} else {
			obj = loc;
		}
		obj.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function() {
				obj.setAnimation(null);
		}, 750);
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

	this.drawMap();

};

function startModel() {
	ko.applyBindings(new ViewModel());
}
