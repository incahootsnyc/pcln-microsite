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

	$('#upload-image').click(function (e) {
		var $uploadModal = $('#upload-modal');

		// if first time creating modal, add events
		// otherwise just show existing modal
		if ($uploadModal.length < 1) {
			$uploadModal = grabTemplateByName('upload-modal');
			var $uploadForm = $uploadModal.find('form');

			// assign events for modal
			if (pclnPicMe.supportsDragAndDrop) {
				pclnPicMe.uploadModalDelegate.addDragAndDropCapabilities($uploadForm);
			}

			pclnPicMe.uploadModalDelegate.addCloseEvent($uploadModal);
			pclnPicMe.uploadModalDelegate.addImagePreviewEvent($uploadForm);
			pclnPicMe.uploadModalDelegate.addSubmitEvent($uploadForm);
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
		var postId = $_this.data('id');
		var $detailsModal = $('#details-modal');

		if ($detailsModal.length < 1) {
			$detailsModal = grabTemplateByName('details-modal');
			showModalWithOverlay($detailsModal);
		} else {
			showModalWithOverlay($detailsModal);
		}
    });


	function showModalWithOverlay($modal) {
		var overlay = $('#overlay');
		overlay.show();
		$modal.show();
	}

})();

