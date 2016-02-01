// Function for showing extra content in modal window
var extraInfo = function(loc) {
	// Empty content
	$('#flickr-images').empty();
	$('#wiki-content').empty();
	// Listener for clicking the close x
	$('#close').click(function() {
		$('#modal').css('display', 'none');
	});
	// Show modal window
	$('#modal').css('display', 'block');
	// Listener for clicking outside the modal window
	$(window).click(function(event) {
		if (event.target == modal) $('#modal').css('display', 'none');
	});
	// Load flickr pictures
	var flickrUrl = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=dc610307d5d7e99c3a682062435787d5',
			picUrl,
			numPictures = Math.round($(window).width() / 200);
	$.getJSON(flickrUrl, {
		text: loc.title,
		per_page: numPictures,
		format: 'json',
		nojsoncallback: 1
	})
	.done(function(data) {
		$.each(data.photos.photo, function(i, item) {
			picUrl = 'http://farm' + item.farm + '.static.flickr.com/' + item.server + '/' + item.id + '_' + item.secret + '.jpg';
			$('<div class="flickr-picture">').css('background-image', 'url(' + picUrl + ')').appendTo('#flickr-images');
    });
	})
	.fail(function(error) {
		$('#flickr-images').append('<div>Sorry, Flickr images could not be loaded</div>');
	});
	// Load Wikipedia links
	$.ajax({
		url: 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + loc.title,
		dataType: 'jsonp',
		headers: { 'Api-User-Agent': 'Example/1.0' },
		success: function(data) {
			var articles = data[1];
			for (var i = 0; i < articles.length; i++) {
				var articleText = articles[i],
						wikiUrl = 'http://en.wikipedia.org/wiki/' + articleText;
				$('#wiki-content').append('<li><a href="' + wikiUrl + '"" target="_blank">' + articleText + '</li>');
			}
		}
	})
	.fail(function(error) {
		$('#wiki-content').append('Sorry, links from Wikipedia could not be loaded');
	});
};
