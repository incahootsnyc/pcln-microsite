var pclnPicMe = pclnPicMe || {};


pclnPicMe.detailsModalDelegate = (function () {

	return {
		addCloseEvent: addCloseEventFn,
		addLikeEvent: addLikeEventFn
	};

	function addCloseEventFn ($detailsModal) {

		var $detailsClose = $detailsModal.find('#details-modal-close');
		var $overlay = $('#overlay');


		$detailsClose.click(function(){
			$detailsModal.hide();
			$overlay.hide();
			clearDetailsData($detailsModal);
		});
	}

	function addLikeEventFn ($detailsModal) {
		// var $_this = $(this);
		// var postId = $_this.closest('.submissions__img-container').find('.submissions__img').data('id');
		// pclnPicMe.registerLike(postId, $_this.siblings('.like-value'));
	}

	function clearDetailsData ($detailsModal) {
		// clear info fields here
	}
	

})();


