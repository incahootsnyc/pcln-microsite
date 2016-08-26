pclnPicMe.updateEventHandler = (function () {

	var validationDictionary = {
	 	'map': ['#update-category-error', '#update-location-error'],
		'category[]': function (value) { if (!(value && value.length > 0)) return this.map[0]; },
		'location': function (value) { if (!(value && value.length > 0)) return this.map[1]; }
    };

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

			if (!pclnPicMe.isValidForm($form, formData, validationDictionary, 'no-image', true)) {
				return false;
			}

		  	var requestConfig = {
				url: '/api/update',
				type: 'POST',
				data: postData,
				success: function (response) {
						window.location.href = '/';
					}
				};

			$.ajax(requestConfig);

			return false;

		});
	}

	function addCloseEventFn ($updateModal) {
		var $updateClose = $updateModal.find('#update-modal-close');

		$updateClose.click(function () {
			$('body').css('overflow-y', '');
			$updateModal.hide();
		});
	}

	function addDeleteEventFn ($form, $detailsConfirmModal, imageData) {
		var $deleteButton = $form.find('.delete');

		$deleteButton.click(function (e) {
			e.preventDefault();

			var $confirmBtn = $detailsConfirmModal.find('.modal--sm__button--confirm');
			var $cancelBtn = $detailsConfirmModal.find('.modal--sm__button--cancel');
			var $closeBtn = $detailsConfirmModal.find('.modal__close');

			$confirmBtn.click(function () {
				var requestConfig = {
					url: '/api/remove/' + imageData.uniqueName,
					type: 'GET',
					success: function (response) {
						window.location.href = '/';
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

			$detailsConfirmModal.show();

		});
	}

	function addValidationEventFn ($form) {		

		$form.change(function () {
			var formData = new FormData(this);

			pclnPicMe.isValidForm($form, formData, validationDictionary, 'no-image');
		});

	}

	function populateUpdateModalFn ($modal, imageData) {
		var $form = $modal.find('form');
		$form[0].reset();

		$form.attr('data-id', imageData.uniqueName);
		$modal.find('.modal--lg__img-preview').attr('src', imageData.thumbUrl);
		$modal.find('.modal--lg__input').val(imageData.location);

		imageData.tags.forEach(function (tag) {
			$modal.find('#update-' + tag).prop('checked', true);
		});
	}

})();


