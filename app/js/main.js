window.onload = function() {

	var map;

	function initMap() {
		map = new google.maps.Map(document.getElementById('map'), {
			center: {lat: 41.39, lng: 2.17},
			zoom: 13
		});
	}

	initMap();

}