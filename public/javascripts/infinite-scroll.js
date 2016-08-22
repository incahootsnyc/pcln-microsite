(function () {

	function buildListItemHTML (imagePostObject) {
		var itemHTML = '<li class="submissions__img-container">' + 
					'<img class="submissions__img" data-id="' + imagePostObject.uniqueName + '" src="' + imagePostObject.thumbUrl + '">' + 
		 			'<div class="submission__info">'
		 				'<span class="submissions__username"><a href="">Val Geyvandvos</a></span> <span class="submissions__likes">Likes:' + imagePostObject.likesCount + '</span>' +
					'</div>' + 
				'</li>';

		return itemHTML;
	}
	
})();