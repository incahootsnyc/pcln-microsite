pclnPicMe.likesEventHandler = (function () {

	$('#image-list').on('click', '.submissions__icon-container', function () {
		var $_this = $(this);
		var postId = $_this.closest('.submissions__img-container').find('.submissions__img').attr('data-id');
		registerLike(postId, $_this.siblings('.like-value'));
	});

	return {
		addLikeEvent: addLikeEventFn
	};

	function addLikeEventFn ($detailsModal) {
		$detailsModal.find('.modal--details__like-content img').click(function () {
			var postId = $detailsModal.find('.modal--details__container').attr('data-id');
			registerLike(postId, $detailsModal.find('.details--modal__like-count'));
		});
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
					pclnPicMe.updateLocalLikes(postId, response.likes);
				}
			}
		};

		$.ajax(requestConfig);
	};

})();

