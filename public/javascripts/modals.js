(function () {

	// order has to coincide with order of 
	// children in the templates tag in index.html
	var templateDictionary = {
		'upload-modal': 0,
		'upload-success': 1,
		'delete-confirm': 2,
		'update-modal': 3,
		'details-modal': 4,
		'signin-modal': 5
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
			pclnPicMe.uploadEventHandler.addValidationEvent($uploadForm);

			showModal($uploadModal);
		} else {
			showModal($uploadModal);
		}
	});

	$('#delete-image').click(function (e) {
		var $deleteModal = grabTemplateByName('delete-confirm');
	});

	$('#image-list').on('click', '.submissions__img', function () {
		var $_this = $(this);
		var $detailsModal = $('#details-modal');
		var imagePostData = pclnPicMe.resultset.find(function (imagePost) {
			return imagePost.uniqueName == $_this.attr('data-id');
		});

		if ($detailsModal.length < 1) {
			$detailsModal = grabTemplateByName('details-modal');

			pclnPicMe.detailsEventHandler.addCloseEvent($detailsModal);
			pclnPicMe.detailsEventHandler.addShiftEvents($detailsModal);

			pclnPicMe.likesEventHandler.addLikeEvent($detailsModal);

			addEditEventListener($detailsModal);

			showModal($detailsModal, { detailsImageData: imagePostData } );

		} else {
			showModal($detailsModal, { detailsImageData: imagePostData });
		}
    });

    $('.navbar--user__link').click(function (e) {
    	e.preventDefault();
    	var $signinModal = $('#signin-modal');

    	if ($signinModal.length < 1) {
			$signinModal = grabTemplateByName('signin-modal');
			showModal($signinModal);
		} else {
			showModal($signinModal);
		}
    });

    function addEditEventListener ($modal) {
    	$modal.find('.modal--details__edit').click(function (e) {
    		e.preventDefault();

    		var $currentTarget = $(e.currentTarget);
    		var $updateModal = $('#update-modal');
    		var imagePostData = pclnPicMe.resultset.find(function (imagePost) {
				return imagePost.uniqueName == $currentTarget.parents('.modal--details__container').attr('data-id');
			});

    		$modal.hide();
    		if ($updateModal.length < 1) {
				$updateModal = grabTemplateByName('update-modal');

				pclnPicMe.updateEventHandler.addCloseEvent($updateModal);

				showModal($updateModal, { updateImageData: imagePostData } );
			} else {
				showModal($updateModal, { updateImageData: imagePostData } );
			}
    	});
    }

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

	function showModal($modal, options) {

		if (options && options.detailsImageData) {
			pclnPicMe.detailsEventHandler.populateDetailsModal($modal, options.detailsImageData);
		} else if (options && options.updateImageData) {
			pclnPicMe.updateEventHandler.populateUpdateModal($modal, options.updateImageData);
		}

		$modal.show();
	}

})();

