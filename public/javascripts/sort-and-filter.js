(function () {

	setCurrentFilterTags();

	$('.submissions__sort').change(function (e) {

		var url = pclnPicMe.updateQueryStringParameter(window.location.href, 'sort', $(this).find('option:selected').val() );

		window.location.href = url;

	});

	$('.sidebar__categories_input').change(function () {
		if ($(this).attr('name') == 'user') {
			var url = pclnPicMe.updateQueryStringParameter(window.location.href, 'user', '');
			window.location.href = url;
		} else {
			var selectedTags = $('.sidebar__categories_input:checked');
			var tagList = [];

			for (var i = selectedTags.length - 1; i >= 0; i--) {
				tagList.push(selectedTags[i].value);
			}

			var url = pclnPicMe.updateQueryStringParameter(window.location.href, 'tags', tagList.join(','));
			window.location.href = url;
		}
		
	});

	$('.submissions__username a').click(function (e) {
		e.preventDefault();

		var url = pclnPicMe.updateQueryStringParameter(window.location.href, 'user', $(this).text().replace(' ', '.'));
		window.location.href = url;
	});

	function setCurrentFilterTags () {
		var chosenTags = pclnPicMe.getParameterByName('tags');
		var tagValues;
		var filterValues = [];
		var $selectedUser = $('.sidebar__categories_input[name="user"]');

		// clear all checkbox values before setting them based on query string
		$('.sidebar__categories_input').prop('checked', false);

		if (chosenTags && chosenTags.length > 0) {
			tagValues = chosenTags.split(',');

			tagValues.forEach(function (tag) {
				var checkbox = $('.sidebar__categories_input[value="' + tag + '"]');
				checkbox.prop('checked', true);
				checkbox.next().addClass('checkedtag');
				filterValues.push(checkbox.next().text().replace('#', ''));
			});
		}

		if ($selectedUser.length > 0) {
			filterValues.unshift($selectedUser.val().replace('.', ' '));
		}

		if (filterValues.length > 0) {
			$('.main-filters-list').append('<span>: ' + filterValues.join(', ') + '</span>');
		}
		
	}

})();