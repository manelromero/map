// Modal window control, when an infoWindow is opened
function modalWindow(loc) {
	// Listeners
	$('.info-link').click(function() {
		$('#flickr-images').html('');
		$('#wiki-content').html('');
		$('#modal').css('display', 'block');
		extraInfo();
	});
	$('#close').click(function() {
		$('#modal').css('display', 'none');
	});
	$(window).click(function(event) {
		if (event.target == modal) $('#modal').css('display', 'none');
	});
	extraInfo = function() {
	console.log('loc: ', loc);
		// Load flickr pictures
		var flickrUrl = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=dc610307d5d7e99c3a682062435787d5&text=' + loc + '&per_page=5&format=json&nojsoncallback=1';
		var src;

		$.getJSON(flickrUrl, function(data) {
			$.each(data.photos.photo, function(i, item) {
				src = 'http://farm' + item.farm + '.static.flickr.com/' + item.server + '/' + item.id + '_' + item.secret + '.jpg';
				$('<div class="flickr-picture">').css('background-image', 'url(' + src + ')').appendTo('#flickr-images');
	    });
		});
		// Load Wikipedia links
		$.ajax({
			url: 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + loc,
			// data: queryData,
			dataType: 'jsonp',
			//type: 'POST',
			headers: { 'Api-User-Agent': 'Example/1.0' },
			success: function(data) {
				var articles = data[1];
				for (var i = 0; i < articles.length; i++) {
					articleText = articles[i];
					var wikiUrl = 'http://en.wikipedia.org/wiki/' + articleText;
					$('#wiki-content').append('<li><a href="' + wikiUrl + '"" target="_blank">' + articleText + '</li>');
				}
			}
		});
	};

}






