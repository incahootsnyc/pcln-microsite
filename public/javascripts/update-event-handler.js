pclnPicMe.updateEventHandler = (function () {

	var validationDictionary = {
	 	'map': ['#update-category-error', '#update-location-error'],
		'category[]': function (value) { if (!(value && value.length > 0)) return this.map[0]; },
		'location': function (value) { if (!(value && value.length > 0)) return this.map[1]; }
    };

    var currentImagePostData = {};

	return {
		addCloseEvent: addCloseEventFn,
		populateUpdateModal: populateUpdateModalFn,
		addSubmitEvent: addSubmitEventFn,
		addDeleteEvent: addDeleteEventFn,
		addValidationEvent: addValidationEventFn
	};

	// form submit event for upload modal
	function addSubmitEventFn ($form) {

		$form.submit(function (e) {
			e.preventDefault();

			$('<input />').attr('type', 'hidden')
	          .attr('name', 'uniquename')
	          .attr('value', $(this).attr('data-id'))
	          .appendTo(this);

		  	var formData = new FormData(this);
		  	var postData = $(this).serializeArray();
		  	var $loader = $(this).find('button[type="submit"] .loader--white');

			if (!pclnPicMe.isValidForm($form, validationDictionary, 'no-image', true)) {
				return false;
			}

			$loader.removeClass('ishidden');

		  	var requestConfig = {
				url: '/api/update',
				type: 'POST',
				data: postData,
				success: function (response) {
						if (response.error) {
							alert(response.error);
							$loader.addClass('ishidden');
						} else {
							pclnPicMe.redirectHome();
						}
					}
				};

			$.ajax(requestConfig);

			return false;

		});
	}

	function addCloseEventFn ($updateModal) {
		var $updateClose = $updateModal.find('#update-modal-close');

		$updateClose.click(closeEvent);

		$updateModal.click(function (e) {
			var $target = $(e.target);

			if ($target.is('.modal-overlay')){
				closeEvent();
			}
		});

		function closeEvent () {
			$('body').css('overflow-y', '');
			$updateModal.hide();
		}
	}

	function addDeleteEventFn ($form, $detailsConfirmModal) {
		var $deleteButton = $form.find('.delete');
		var $confirmBtn = $detailsConfirmModal.find('.modal--sm__button--confirm');
		var $cancelBtn = $detailsConfirmModal.find('.modal--sm__button--cancel');
		var $closeBtn = $detailsConfirmModal.find('.modal__close');

		$deleteButton.click(function (e) {
			e.preventDefault();
			// unbind events so they dont pile up 
			pclnPicMe.unbindClickEvents([$confirmBtn, $cancelBtn, $closeBtn, $detailsConfirmModal]);

			$confirmBtn.click(function () {
				var $loader = $(this).find('.loader--white');
				$loader.removeClass('ishidden');

				var requestConfig = {
					url: '/api/remove/' + currentImagePostData.uniqueName,
					type: 'GET',
					success: function (response) {
						if (response.error) {
							alert(response.error);
							$loader.addClass('ishidden');
						} else {
							pclnPicMe.redirectHome();
						}
						
					}
				};

				$.ajax(requestConfig);
			});

			$cancelBtn.click(function () {
				$detailsConfirmModal.hide();
			});

			$closeBtn.click(function () {
				$detailsConfirmModal.hide();
			});

			$detailsConfirmModal.click(function (e) {
				var $target = $(e.target);

				if ($target.is('.modal-overlay')){
					$detailsConfirmModal.hide();
				}
			});

			$detailsConfirmModal.show();

		});
	}

	function addValidationEventFn ($form) {		

		$form.change(function () {
			pclnPicMe.isValidForm($form, validationDictionary, 'no-image');
		});

	}

	function populateUpdateModalFn ($modal, imageData) {
		var $form = $modal.find('form');
		currentImagePostData = imageData;
		$form[0].reset();

		$form.attr('data-id', currentImagePostData.uniqueName);
		$modal.find('.modal--lg__img-preview').attr('src', currentImagePostData.thumbUrl);
		$modal.find('.modal--lg__input').val(currentImagePostData.location);

		currentImagePostData.tags.forEach(function (tag) {
			$modal.find('#update-' + tag).prop('checked', true);
		});
	}

})();


