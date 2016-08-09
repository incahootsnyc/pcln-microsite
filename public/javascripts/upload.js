(function () {

	$('#upload-form').submit(function (e) {
		e.preventDefault();

	  	var formData = new FormData(this);

	  	var requestConfig = {
			url: '/api/upload',
			type: 'POST',
			data: formData,
			contentType: false,
			processData: false,
			success: function (response) {
					console.log(response);
				}
			};

		$.ajax(requestConfig);

		return false;

	});

})();

