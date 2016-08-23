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
		
	}

	function clearDetailsData ($detailsModal) {
		// clear info fields here
	}
	

})();


