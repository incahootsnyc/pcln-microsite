pclnPicMe.uploadEventHandler = (function () {

	var droppedFile = false;
	var orientedFileName = undefined;
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
			pclnPicMe.unbindClickEvents([$confirmBtn, $cancelBtn, $closeBtn, $termsLink, $acceptTermsConfirmation]);

			var formData = new FormData(this);
			formData.append('datetime', Date.now());

			if (droppedFile) {
				if (orientedFileName) {
					formData.append($fileInput.attr('name'), droppedFile, orientedFileName);
				} else {
					formData.append($fileInput.attr('name'), droppedFile);
				}
			    
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

			$acceptTermsConfirmation.click(function (e) {
				var $target = $(e.target);

				if ($target.is('.modal-overlay')){
					$uploadModal.show();
					$acceptTermsConfirmation.hide();
				}
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
				orientedFileName = undefined;
				$form.find('#file').val('');
				$form.trigger('change');
			} else {
				filePreview = e.currentTarget.files[0];
				droppedFile = false;
			}

		    EXIF.getData(filePreview, function () {
		    	var orientedImage = new Image();
		    	var previewImage = new Image(140, 140);
			    var previewImageElement = $form.find('img#preview')[0];
				var orientation = EXIF.getTag(this,"Orientation");
				var canvasPreview = document.createElement("canvas");
				var canvasOriented = document.createElement("canvas");
				var ctxPreview = canvasPreview.getContext('2d');
				var ctxOriented = canvasOriented.getContext('2d');
				var URL = window.URL || window.webkitURL;
				var objectUrl = URL.createObjectURL(filePreview);

				if (!orientation) {

					var reader = new FileReader();
				    reader.onload = function (event) {
				        $form.find('img#preview').attr('src', event.target.result);
				    };

				    reader.readAsDataURL(filePreview);	

				} else {

					orientedImage.onload = function() {
						var dataURL = drawCanvas(orientedImage, orientation, canvasOriented, ctxOriented);
						orientedFileName = $form.find('#file').val();
						$form.find('#file').val('');
						droppedFile = dataURItoBlob(dataURL);
					};

					previewImage.onload = function() {
						var previewDataURL = drawCanvas(previewImage, orientation, canvasPreview, ctxPreview);
						previewImageElement.src = previewDataURL;
					};

					orientedImage.src = objectUrl;
					previewImage.src = objectUrl;

				}

			});	   
		}
	}


	function addCloseEventFn ($uploadModal) {

		var $uploadClose = $uploadModal.find('#upload-modal-close');

		$uploadClose.click(closeEvent);

		$uploadModal.click(function (e) {
			var $target = $(e.target);

			if ($target.is('.modal-overlay')){
				closeEvent();
			}
		});

		function closeEvent () {
			$('body').css('overflow-y', '');
			$uploadModal.hide();
			clearUploadForm($uploadModal.find('form'));
		}
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
		orientedFileName = undefined;
		droppedFile = false;
	}

	// http://stackoverflow.com/a/14930686
	function dataURItoBlob(dataURI) {
	    var byteString, 
	        mimestring;

	    if(dataURI.split(',')[0].indexOf('base64') !== -1 ) {
	        byteString = atob(dataURI.split(',')[1]);
	    } else {
	        byteString = decodeURI(dataURI.split(',')[1]);
	    }

	    mimestring = dataURI.split(',')[0].split(':')[1].split(';')[0];

	    var content = new Array();
	    for (var i = 0; i < byteString.length; i++) {
	        content[i] = byteString.charCodeAt(i);
	    }

	    return new Blob([new Uint8Array(content)], {type: mimestring});
	}

	// http://stackoverflow.com/a/37750456
	function drawCanvas (image, orientation, can, ctx) {
		if (image.width > 140) {
			var dimensions = calculateAspectRatioFit(image.width, image.height, 2048, 2048);
			image.width = dimensions.width;
			image.height = dimensions.height;
		}	

		can.width  = image.width;
		can.height = image.height;
		ctx.save();
		var width = can.width;  
		var styleWidth = can.style.width;
		var height = can.height; 
		var styleHeight = can.style.height;
		if (orientation > 4) {
			can.width = height; 
			can.style.width = styleHeight;
			can.height = width; 
			can.style.height = styleWidth;
		}
		switch (orientation) {
			case 2: ctx.translate(width, 0);     ctx.scale(-1,1); break;
			case 3: ctx.translate(width,height); ctx.rotate(Math.PI); break;
			case 4: ctx.translate(0,height);     ctx.scale(1,-1); break;
			case 5: ctx.rotate(0.5 * Math.PI);   ctx.scale(1,-1); break;
			case 6: ctx.rotate(0.5 * Math.PI);   ctx.translate(0,-height); break;
			case 7: ctx.rotate(0.5 * Math.PI);   ctx.translate(width,-height); ctx.scale(-1,1); break;
			case 8: ctx.rotate(-0.5 * Math.PI);  ctx.translate(-width,0); break;
		}

		ctx.drawImage(image,0,0,image.width,image.height);
		
		ctx.restore();
		
		return can.toDataURL();
	}

	// http://stackoverflow.com/a/14731922
	function calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {

	    var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

	    return { width: srcWidth*ratio, height: srcHeight*ratio };
	 }

})();


