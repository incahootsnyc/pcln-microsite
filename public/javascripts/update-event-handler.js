pclnPicMe.updateEventHandler = (function () {

	return {
		addCloseEvent: addCloseEventFn,
		populateUpdateModal: populateUpdateModalFn
	};

	function addCloseEventFn ($updateModal) {
		var $updateClose = $updateModal.find('#update-modal-close');
		var $overlay = $('#overlay');

		$updateClose.click(function(){
			$updateModal.hide();
			$overlay.hide();
		});
	}

	function populateUpdateModalFn ($modal, imageData) {
		$modal.find('.modal--lg__img-preview').attr('src', imageData.thumbUrl);
		$modal.find('.modal--lg__input').val(imageData.location);
		imageData.tags.forEach(function (tag) {
			$modal.find('#' + tag).prop('checked', true);
		});
	}

})();


