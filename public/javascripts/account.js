(function  () {
	var $accountModal = $('#signin-modal'),
		$form = $accountModal.find('form'),
		$registerMessage = $accountModal.find('#register-message'),
		$registerLink = $accountModal.find('#register-message a'),
		$loginLink = $accountModal.find('#login-message a'),
		$loginErr = $accountModal.find('#login-error'),
		$passportError = $accountModal.find('#passport-error'),
		$registerErr = $accountModal.find('#register-error'),
		$signinBtn = $accountModal.find('#signin'),
		$registerBtn = $accountModal.find('#register'),
		$pwConfirm = $accountModal.find('input[name="password-confirm"]'),
		search = location.search.substring(1),
		searchQueryObject,
		hasMessage,
		loginErrorMap = {
			'00': 'Incorrect username.',
			'01': 'Incorrect password.',
			'02': 'User email is invalid.',
			'03': 'User already exists.',
			'04': 'Check your email to complete your registration!'
		};

	if (search.length > 0) {
		searchQueryObject = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
		hasMessage = searchQueryObject && searchQueryObject.e;
		if (searchQueryObject && searchQueryObject.e) {
			$passportError.text(loginErrorMap[searchQueryObject.e]).removeClass('ishidden');
		}

		if (hasMessage && searchQueryObject.e == '04') {
			$form.hide();
			$registerMessage.hide();
		}
	}

	$form.submit(function (e) {
		var $this = $(this),
			username = $this.find('input[name="username"]').val(),
			password = $this.find('input[name="password"]').val();

		hideErrors();

		if ($form.attr('action') == '/api/login') {
			if (username == undefined || username.trim().length == 0 ||
				password == undefined || password.trim().length == 0 ||
				!isValidEmail(username)) {

				$loginErr.removeClass('ishidden');
				return false;
			}
		} else {
			if (username == undefined || username.trim().length == 0 || 
				password == undefined || password.trim().length == 0 ||
				password != $pwConfirm.val() || !isValidEmail(username)) {

				$registerErr.removeClass('ishidden');
				return false;
			}
		}
		
	});

	$registerLink.click(function (e) {
		e.preventDefault();
		toggleFormType();
		$form.attr('action', '/api/signup');
	});

	$loginLink.click(function (e) {
		e.preventDefault();
		toggleFormType();
		$form.attr('action', '/api/login');
	}); 


	function toggleFormType () {
		$loginLink.parent().toggleClass('ishidden');
		$registerLink.parent().toggleClass('ishidden');
		$signinBtn.toggleClass('ishidden');
		$registerBtn.toggleClass('ishidden');
		$pwConfirm.toggleClass('ishidden');
		hideErrors();
	}

	function hideErrors () {
		$loginErr.addClass('ishidden');
		$registerErr.addClass('ishidden');
		$passportError.addClass('ishidden');
	}

	function isValidEmail (email) {
		var atIndex = email.indexOf('@');
		var isPCLN = email.indexOf('priceline.com') > -1;
		var emailName = email.substring(0, atIndex);
		var nameTokens = emailName.split('.');
		var validTokens = nameTokens.length > 1;

		for (var i = nameTokens.length - 1; i >= 0; i--) {
			if (nameTokens[i].trim().length < 1) {
				validTokens = false;
				break;
			}
		}

		// return isPCLN && validTokens;
		return validTokens;
	}

})();
