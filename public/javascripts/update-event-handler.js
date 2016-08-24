pclnPicMe.updateEventHandler = (function () {

	return {
		addCloseEvent: addCloseEventFn,
		populateUpdateModal: populateUpdateModalFn
	};

	function populateUpdateModalFn () {

	}

	function addCloseEventFn ($updateModal) {
		var $updateClose = $updateModal.find('#update-modal-close');
		var $overlay = $('#overlay');

		$updateClose.click(function(){
			$updateModal.hide();
			$overlay.hide();
		});
	}
	

})();


