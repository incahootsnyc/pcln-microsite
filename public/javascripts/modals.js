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
		var $uploadModal = grabTemplateByName('upload-modal');

		plcnPicMe.uploadEventDelegate.addSubmitEvent($uploadModal.find('form'));
	});

	$('#delete-image').click(function (e) {
		var $deleteModal = grabTemplateByName('delete-confirm');
	});

})();

