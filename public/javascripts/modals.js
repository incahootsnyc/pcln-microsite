(function () {

	// order has to coincide with order of 
	// children in the templates tag in index.html
	var templateDictionary = {
		'upload-modal': 0,
		'upload-success': 1,
		'delete-confirm': 2,
		'update-modal': 3,
		'details-modal': 4
	};

	$('#upload-image').click(function (e) {
		var $uploadModal = $('#upload-modal');

		// if first time creating modal, add events
		// otherwise just show existing modal
		if ($uploadModal.length < 1) {
			$uploadModal = grabTemplateByName('upload-modal');
			var $uploadForm = $uploadModal.find('form');

			// assign events for modal
			if (pclnPicMe.supportsDragAndDrop) {
				pclnPicMe.uploadEventHandler.addDragAndDropCapabilities($uploadForm);
			}

			pclnPicMe.uploadEventHandler.addCloseEvent($uploadModal);
			pclnPicMe.uploadEventHandler.addImagePreviewEvent($uploadForm);
			pclnPicMe.uploadEventHandler.addSubmitEvent($uploadForm);

			showModalWithOverlay($uploadModal);
		} else {
			showModalWithOverlay($uploadModal);
		}
	});

	$('#delete-image').click(function (e) {
		var $deleteModal = grabTemplateByName('delete-confirm');
	});

	$('#image-list').on('click', '.submissions__img', function () {
		var $_this = $(this);
		var $detailsModal = $('#details-modal');
		var imagePostData = pclnPicMe.resultset.find(function (imagePost) {
			return imagePost.uniqueName == $_this.data('id');
		});

		if ($detailsModal.length < 1) {
			$detailsModal = grabTemplateByName('details-modal');

			pclnPicMe.detailsEventHandler.addCloseEvent($detailsModal);
			pclnPicMe.detailsEventHandler.addShiftLeftEvent($detailsModal);
			pclnPicMe.detailsEventHandler.addShiftRightEvent($detailsModal);

			pclnPicMe.likesEventHandler.addLikeEvent($detailsModal);

			showModalWithOverlay($detailsModal, imagePostData);

		} else {
			showModalWithOverlay($detailsModal, imagePostData);
		}
    });


	function grabTemplateByName (name) {
		var templateHtml = $('template').html().trim();
		var $template = $(templateHtml);

		var allTemplates = [];
		for (var i = 0; i < $template.length; i++) {
			if ($template[i].nodeName != '#text') {
				allTemplates.push($template[i]);
			}
		}

		var index = templateDictionary[name];
		var $templatePartial = $(allTemplates[index])
		return $templatePartial.appendTo('body');
	}

	function showModalWithOverlay($modal, imageData) {
		var overlay = $('#overlay');

		if (imageData) {
			populateDetailsModal($modal, imageData);
		}

		overlay.show();
		$modal.show();
	}

	function populateDetailsModal ($modal, imageData) {
		// set details info here
	}

})();

