(function () {

	var pageNumber = 1;
	var loadedResults = pageSize = pclnPicMe.pageSize;
	var loadMoreResults = true;
	var isLoading = false;

	$(window).scroll(function() {
		var startLoading = $(window).scrollTop() + $(window).height() > $(document).height() - 200;
		var sendUid = pclnPicMe.scrollType == 'mypics';
		var query = window.location.search.length > 0 ? '&uid=' + pclnPicMe.uid : '?uid=' + pclnPicMe.uid;
		var url = '/api/fetchPosts/' + pageNumber + window.location.search;

	    if (startLoading && loadMoreResults && !isLoading) {

	    	if (sendUid) {
	    		url += query;
	    	}

	    	var requestConfig = {
				url: url,
				type: 'GET',
				success: function (response) {
					loadedResults = pageNumber * pageSize;
					loadMoreResults = loadedResults < response.totalPostCount;
					isLoading = false;

					pageNumber++;
					if (response.images.length > 0) {
						pclnPicMe.resultset = pclnPicMe.resultset.concat(response.images);
						response.images.forEach(function (imageObject) {
							$(buildListItemHTML(imageObject)).appendTo('#image-list');
						});

						pclnPicMe.lazyLoad(loadedResults);
					}	
				}
			};

			isLoading = true;
			$.ajax(requestConfig);
	    }
	});

	function buildListItemHTML (imagePostObject) {
		var itemHTML = '<li class="submissions__img-container">' + 
					'<img class="submissions__img" data-id="' + imagePostObject.uniqueName + '" src="">' + 
		 			'<div class="submission__info">' + 
		 				'<span class="submissions__username"><a href="">' + imagePostObject.username + '</a></span>' +
		 				'<span class="submissions__icon-container">' + 
		 					'<img class="submissions__like-icon" src="/images/hand.svg"/>' + 
		 					'</span>Likes: <span class="like-value">' + imagePostObject.likesCount + '</span>' + 
		 				'</span>' +
					'</div>' + 
				'</li>';

		return itemHTML;
	}
	
})();