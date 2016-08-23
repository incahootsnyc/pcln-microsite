(function () {

	$('#image-list').on('click', '.submissions__like-icon', function () {
		var $_this = $(this);
		var postId = $_this.closest('.submissions__img-container').find('.submissions__img').data('id');
		pclnPicMe.registerLike(postId, $_this.siblings('.like-value'));
	});

})();