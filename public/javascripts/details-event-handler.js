pclnPicMe.detailsEventHandler = (function () {

	var currentDetailsIndex = 0;

	return {
		addCloseEvent: addCloseEventFn,
		addShiftEvents: addShiftEventsFn,
		populateDetailsModal: populateDetailsModalFn
	};

	function addCloseEventFn ($detailsModal) {

		var $detailsClose = $detailsModal.find('#details-modal-close');

		$detailsClose.click(function () {
			$('body').css('overflow-y', '');
			$detailsModal.hide();
		});
	}

	function addShiftEventsFn ($detailsModal) {
		$detailsModal.find('.modal--details__arrow-right').click(function () {
			var nextIndex = currentDetailsIndex + 1;
			if (nextIndex < pclnPicMe.resultset.length) {
				populateDetailsModalFn($detailsModal, pclnPicMe.resultset[nextIndex]);
			}

			currentDetailsIndex = nextIndex;
		});

		$detailsModal.find('.modal--details__arrow-left').click(function () {
			var prevIndex = currentDetailsIndex - 1;
			if (prevIndex >= 0) {
				populateDetailsModalFn($detailsModal, pclnPicMe.resultset[prevIndex]);
			}

			currentDetailsIndex = prevIndex;
		});
	}

	function populateDetailsModalFn ($modal, imageData) {
		var $tagContainer = $modal.find('.modal--details__img-categories');
		var $editPost = $modal.find('.modal--details__edit');

		$tagContainer.empty();
		pclnPicMe.setLike($modal.find('.modal--details__icon-container'), imageData);

		$modal.find('.modal--details__img').attr('src', imageData.detailsUrl);
		$modal.find('.details--modal__like-count').text(imageData.likesCount);
		$modal.find('.modal--details__container').attr('data-id', imageData.uniqueName);
		$modal.find('.modal--details__img-submitter').text(imageData.username);
		$modal.find('.modal--details__arrow-left').toggleClass('ishidden', imageData.index == 0);
		$modal.find('.modal--details__arrow-right').toggleClass('ishidden', imageData.index == pclnPicMe.resultset.length-1);

		if (pclnPicMe.uid != imageData.uid) {
			$editPost.hide();
		} else {
			$editPost.show();
		}

		imageData.tags.forEach(function (tag) {
			$tagContainer.append('<span class="modal--details__category">#' + pclnPicMe.tagDictionary[tag] + '</span>');
		});
		
		currentDetailsIndex = imageData.index;
	}

})();


