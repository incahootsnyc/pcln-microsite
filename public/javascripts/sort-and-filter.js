(function () {

	setCurrentFilterTag();

	$('.submissions__sort').change(function (e) {

		var url = pclnPicMe.updateQueryStringParameter(window.location.href, 'sort', $(this).find('option:selected').val() );

		window.location.href = url;

	});

	$('.sidebar__categories_input').change(function () {
		var finalUrl;
		var selectedTag = $('.sidebar__categories_input[name="category[]"]:checked');
		var tagUrl = pclnPicMe.updateQueryStringParameter(window.location.href, 'tag', selectedTag.val());
		if (tagUrl.indexOf('user') > -1) {
			finalUrl = pclnPicMe.updateQueryStringParameter(tagUrl, 'user', '');
		} else {
			finalUrl = tagUrl;
		}
		window.location.href = finalUrl;
	});

	$('.submissions__username a').click(function (e) {
		e.preventDefault();

		var finalUrl;
		var userUrl = pclnPicMe.updateQueryStringParameter(window.location.href, 'user', $(this).text().replace(' ', '.'));
		if (userUrl.indexOf('tag') > -1) {
			finalUrl = pclnPicMe.updateQueryStringParameter(userUrl, 'tag', '');
		} else {
			finalUrl = userUrl;
		}
		window.location.href = finalUrl;
	});

	function setCurrentFilterTag () {
		var chosenTag = pclnPicMe.getParameterByName('tag') || 'all';
		var tagValues;
		var filterValues = [];
		var $selectedUser = $('.sidebar__categories_input[name="user"]');

		// clear all checkbox values before setting them based on query string
		$('.sidebar__categories_input').prop('checked', false);

		if (chosenTag && chosenTag.trim().length > 0 && $selectedUser.length < 1) {
			var radioButton = $('.sidebar__categories_input[value="' + chosenTag + '"]');
			radioButton.prop('checked', true);
			radioButton.next().addClass('checkedtag');
			$('.main-filters-list').append('<span>: ' + radioButton.next().text().replace('#', '') + '</span>');
		} else if ($selectedUser.length > 0) {
			$selectedUser.prop('checked', true);
			$selectedUser.next().addClass('checkedtag');
			$('.main-filters-list').append('<span>: ' + $selectedUser.val().replace('.', ' ') + '</span>');
		}

		
	}

})();