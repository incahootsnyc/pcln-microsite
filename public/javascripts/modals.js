(function () {

	// order has to coincide with order of 
	// children in the templates tag in index.html
	var templateDictionary = {
		'upload-modal': 0,
		'upload-success': 1,
		'delete-confirm': 2
	};

	function grabTemplateByName (name) {
		var templateHtml = $('template').html();
		var $template = $(templateHtml);
		var index = templateDictionary[name];
		var $templatePartial = $($template[index])
		return $templatePartial.appendTo('body');
	}

	$('#upload-image').click(function (e) {
		var $uploadModal = $('#upload-modal');

		// if first time creating modal, add events
		// otherwise just show existing modal
		if ($uploadModal.length < 1) {
			var $uploadModal = grabTemplateByName('upload-modal');
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


	function showModalWithOverlay($modal) {
		var overlay = $('#overlay');
		overlay.show();
		$modal.show();
	}

})();

