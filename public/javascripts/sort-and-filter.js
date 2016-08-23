(function () {
	$('.submissions__sort').change(function (e) {

		var url = pclnPicMe.updateQueryStringParameter(window.location.href, 'sort', $(this).find('option:selected').val() );

		window.location.href = url;

	});

	// $('.sidebar__categories li').click(function (e) {
	// 	var tags = 'test,test1';
	// 	var url = pclnPicMe.updateQueryStringParameter(window.location.href, 'tags', tags);
	// 	window.location.href = url;
	// }); 
})();