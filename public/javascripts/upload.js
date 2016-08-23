var pclnPicMe = pclnPicMe || {};


pclnPicMe.uploadModalDelegate = (function () {

	var droppedFile = false;

	return {
		addSubmitEvent: addSubmitEventFn,
		addDragAndDropCapabilities: addDragAndDropCapabilitiesFn,
		addImagePreviewEvent: addImagePreviewEventFn,
		addCloseEvent: addCloseEventFn
	};

	// form submit event for upload modal
	function addSubmitEventFn ($form) {
		var $fileInput = $form.find('input[type="file"]');

		$form.submit(function (e) {
			e.preventDefault();

		  	var formData = new FormData(this);
		  	formData.append('datetime', Date.now());

		  	if (droppedFile) {
			    formData.append($fileInput.attr('name'), droppedFile);
			}

			// if (!validForm($form, droppedFile)) {
			// 	return false;
			// }

		  	var requestConfig = {
				url: '/api/upload',
				type: 'POST',
				data: formData,
				contentType: false,
				processData: false,
				success: function (response) {
						alert(response.message);

						clearUploadForm($form);
					}
				};

			$.ajax(requestConfig);

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
			} else {
				filePreview = e.currentTarget.files[0];
				droppedFile = false;
			}
			
			// read file and set it as source of image when finished
			var reader = new FileReader();
		    reader.onload = function (event) {
		        $form.find('img#preview').attr('src', event.target.result);
		    }
		    reader.readAsDataURL(filePreview);		   
		}
	}


	function addCloseEventFn ($uploadModal) {

		var $uploadClose = $uploadModal.find('#upload-modal-close');
		var $overlay = $('#overlay');


			$uploadClose.click(function(){
				$uploadModal.hide();
				$overlay.hide();
				clearUploadForm($uploadModal.find('form'));
			});
	}

	function clearUploadForm ($form) {
		$form[0].reset();
		$form.find('img#preview').attr('src', '');
		droppedFile = false;
	}


	function validForm ($form) {
		console.log($form);
	}
	

})();


