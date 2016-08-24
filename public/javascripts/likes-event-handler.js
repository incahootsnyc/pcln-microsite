pclnPicMe.likesEventHandler = (function () {

	$('#image-list').on('click', '.submissions__icon-container', function () {
		var $_this = $(this);
		var postId = $_this.closest('.submissions__img-container').find('.submissions__img').data('id');
		registerLike(postId, $_this.siblings('.like-value'));
	});

	return {
		addLikeEvent: addLikeEventFn
	};

	function addLikeEventFn ($detailsModal) {
		// var $_this = $(this);
		// var postId = $_this.closest('.submissions__img-container').find('.submissions__img').data('id');
		//registerLike(postId, $_this.siblings('.like-value'));
	}

	function registerLike (postId, $likeValueContainer) {
	  var requestConfig = {
		url: '/api/like/' + postId,
		type: 'GET',
		success: function (response) {
				if (response.message) {
				//whoops
				} else {
					$likeValueContainer.text(response.likes);
				}
			}
		};

		$.ajax(requestConfig);
	};

})();

