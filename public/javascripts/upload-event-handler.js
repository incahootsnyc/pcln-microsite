pclnPicMe.uploadEventHandler = (function () {

	var droppedFile = false;
	var validationDictionary = {
		'map': ['#image-error', '#category-error', '#location-error'],
		'image': function (value) { if (!(value && value.length > 0) && !droppedFile) return this.map[0]; },
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
	function addSubmitEventFn ($uploadModal, $acceptTermsConfirmation) {
		var $form = $uploadModal.find('form');
		var $fileInput = $form.find('input[type="file"]');
		var $confirmBtn = $acceptTermsConfirmation.find('.modal--sm__button--confirm');
		var $termsLink = $acceptTermsConfirmation.find('#terms-link');
		var $cancelBtn = $acceptTermsConfirmation.find('.modal--sm__button--cancel');
		var $closeBtn = $acceptTermsConfirmation.find('.modal__close');
		var isSubmitting = false;

		$form.submit(function (e) {
			e.preventDefault();
			// unbind events so they dont pile up 
			pclnPicMe.unbindClickEvents([$confirmBtn, $cancelBtn, $closeBtn, $termsLink]);

			var formData = new FormData(this);
			formData.append('datetime', Date.now());

			if (droppedFile) {
			    formData.append($fileInput.attr('name'), droppedFile);
			}

			if (!pclnPicMe.isValidForm($form, validationDictionary, droppedFile, true)) {
				return false;
			}

			$uploadModal.hide();

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
								pclnPicMe.redirectHome();
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

			$termsLink.click(function (e) {
				e.preventDefault();
				$acceptTermsConfirmation.find('.modal--smal__text').toggle();
			});

			$cancelBtn.click(function () {
				$uploadModal.show();
				$acceptTermsConfirmation.hide();
			});

			$closeBtn.click(function () {
				$uploadModal.show();
				$acceptTermsConfirmation.hide();
			});

			$acceptTermsConfirmation.find('.modal--smal__text').hide();
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

		$dragAndDropArea.click(function () {
			$form.find('#file').trigger('click');
		});
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

		//   $('body').on('click', '.modal-overlay', function (e) {
		// 	var $target = $(e.target);

		// 	if ($target.is('.modal-overlay')){
		// 		$(this).hide();
		// 	}
		    
		// });
	}

	function addValidationEventFn ($form) {		

		$form.change(function () {
			pclnPicMe.isValidForm($form, validationDictionary, droppedFile);
		});

		$form.find('input[name="location"]').keyup(function () {
			pclnPicMe.isValidForm($form, validationDictionary, droppedFile);
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


