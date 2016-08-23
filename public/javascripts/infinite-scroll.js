(function () {

	var pageNumber = 1;
	var loadedResults = pageSize = pclnPicMe.pageSize;
	var loadMoreResults = true;
	var isLoading = false;

	$(window).scroll(function() {
		var startLoading = $(window).scrollTop() + $(window).height() > $(document).height() - 100;

	    if (startLoading && loadMoreResults && !isLoading) {

	    	var requestConfig = {
				url: '/api/fetchPosts/' + pageNumber + window.location.search,
				type: 'GET',
				success: function (response) {
					loadedResults = pageNumber * pageSize;
					loadMoreResults = loadedResults < response.totalPostCount;
					isLoading = false;

					pageNumber++;
					pclnPicMe.resultset = pclnPicMe.resultset.concat(response.images);
					response.images.forEach(function (imageObject) {
						$(buildListItemHTML(imageObject)).appendTo('#image-list');
					});
				}
			};

			isLoading = true;
			$.ajax(requestConfig);
	    }
	});

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