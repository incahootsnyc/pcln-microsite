pclnPicMe.detailsEventHandler = (function () {

	return {
		addCloseEvent: addCloseEventFn,
		addShiftEvents: addShiftEventsFn
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

	function addShiftEventsFn () {

	}

	function clearDetailsData ($detailsModal) {
		// clear info fields here
	}
	

})();


