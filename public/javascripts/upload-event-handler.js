pclnPicMe.uploadEventHandler = (function () {

	var droppedFile = false;
	var validationDictionary = {
		'map': ['#image-error', '#category-error', '#location-error'],
		'image': function (value) { if (!(value && value.size > 0) && !droppedFile) return this.map[0]; },
		'category[]': function (value) { if (!(value && value.length > 0)) return this.map[1]; },
		'location': function (value) { if (!(value && value.length > 0)) return this.map[2]; }
    };

	return {
		addSubmitEvent: addSubmitEventFn,
		addDragAndDropCapabilities: addDragAndDropCapabilitiesFn,
		addImagePreviewEvent: addImagePreviewEventFn,
		addCloseEvent: addCloseEventFn,
		addValidationEvent: addValidationEventFn
	};

	// form submit event for upload modal
	function addSubmitEventFn ($modal, $acceptTermsConfirmation) {
		var $form = $modal.find('form');
		var $fileInput = $form.find('input[type="file"]');
		var isSubmitting = false;

		var $confirmBtn = $acceptTermsConfirmation.find('.modal--sm__button--confirm');
		var $cancelBtn = $acceptTermsConfirmation.find('.modal--sm__button--cancel');
		var $closeBtn = $acceptTermsConfirmation.find('.modal__close');

		$form.submit(function (e) {
			e.preventDefault();

			var formData = new FormData(this);
			formData.append('datetime', Date.now());

			if (droppedFile) {
			    formData.append($fileInput.attr('name'), droppedFile);
			}

			if (!pclnPicMe.isValidForm($form, formData, validationDictionary, droppedFile, true)) {
				return false;
			}

			$modal.hide();

			$confirmBtn.click(function () {
				if (!isSubmitting) {
					var $loader = $(this).find('.loader--white');
					$loader.removeClass('ishidden');
					isSubmitting = true;

				  	var requestConfig = {
						url: '/api/upload',
						type: 'POST',
						data: formData,
						contentType: false,
						processData: false,
						success: function (response) {
							isSubmitting = false;

							if (response.error) {
								alert(response.error);
								clearUploadForm($form);
								$loader.addClass('ishidden');
								$acceptTermsConfirmation.hide();
							} else {
								window.location.href = '/';
							}
							
						},
						error: function () {
							isSubmitting = false;
							clearUploadForm($form);
							$loader.addClass('ishidden');
							$acceptTermsConfirmation.hide();
						}
					};

					$.ajax(requestConfig);

				}
			});

			$cancelBtn.click(function () {
				$modal.show();
				$acceptTermsConfirmation.hide();
			});

			$closeBtn.click(function () {
				$modal.show();
				$acceptTermsConfirmation.hide();
			});

			$acceptTermsConfirmation.show();
		  	
			return false;

		});
	}

	// drag and drop events for modal
	function addDragAndDropCapabilitiesFn ($form) {
		var $dragAndDropArea = $form.find('.drag-n-drop');

		$dragAndDropArea.on('drag dragstart dragend dragover dragenter dragleave drop', function (e) {
			e.preventDefault();
			e.stopPropagation();
		})
		.on('dragover dragenter', function () {
			$form.addClass('is-dragover');
		})
		.on('dragleave dragend drop', function () {
			$form.removeClass('is-dragover');
		})
		.on('drop', previewFile($form));
	}

	// image preview event for modal
	function addImagePreviewEventFn ($form) {
		var $fileInput = $form.find('#file');

		$fileInput.change(previewFile($form));
	}

	// common function that returns the event handler when upload file 
	// is changed via drag and drop or native upload
	function previewFile ($form) {

		return previewFileEventHandler;

		function previewFileEventHandler (e) {
			// check how the file was added
			var addedByDragAndDrop = e.originalEvent.dataTransfer;
			var filePreview;

			if (addedByDragAndDrop) {
				droppedFile = e.originalEvent.dataTransfer.files[0];
				filePreview = droppedFile;
				// clear any existing file that may have 
				// been added via native upload
				$form.find('#file').val('');
				$form.trigger('change');
			} else {
				filePreview = e.currentTarget.files[0];
				droppedFile = false;
			}
			
			// read file and set it as source of image when finished
			var reader = new FileReader();
		    reader.onload = function (event) {
		        $form.find('img#preview').attr('src', event.target.result);
		    };
		    reader.readAsDataURL(filePreview);		   
		}
	}


	function addCloseEventFn ($uploadModal) {

		var $uploadClose = $uploadModal.find('#upload-modal-close');

		$uploadClose.click(function(){
			$('body').css('overflow-y', '');
			$uploadModal.hide();
			clearUploadForm($uploadModal.find('form'));
		});
	}

	function addValidationEventFn ($form) {		

		$form.change(function () {
			var formData = new FormData(this);

			pclnPicMe.isValidForm($form, formData, validationDictionary, droppedFile);
		});

		$form.find('input[name="location"]').keyup(function () {
			var formData = new FormData($form[0]);

			pclnPicMe.isValidForm($form, formData, validationDictionary, droppedFile);
		});

	}

	function clearUploadForm ($form) {
		$form[0].reset();
		$form.find('img#preview').attr('src', '');
		$form.find('button[type="submit"]').addClass('disabled');
		$form.parent().find('.modal--lg__error-message').addClass('ishidden');
		droppedFile = false;
	}
	

})();


