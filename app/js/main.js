window.onload = function() {

	// Set map size
	function elemHeight() {
		document.getElementById('map').style.height = window.innerHeight - 70 + 'px'; // 70 is the size of #name div
	}
	elemHeight();
	// Set map size if browser is resized
	window.onresize = function() {
		elemHeight();
	}

	// Add a marker
	function addMarker() {
		for (var i = 0; i < mapMarkers.length; i++) {
			var marker = new google.maps.Marker({
				position: mapMarkers[i].position,
				map: map,
				title: mapMarkers[i].title
			})
		}
	}

	//document.getElementById('name').addEventListener('click', addMarker);

}