(function () {
	$('.submissions__sort').change(function (e) {

		var url = pclnPicMe.updateQueryStringParameter(window.location.href, 'sort', $(this).find('option:selected').val() );

		window.location.href = url;

	});
})();