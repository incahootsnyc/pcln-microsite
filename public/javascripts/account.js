(function  () {
	var $passwordResetPageForm = $('#reset-password-form');

	if ($passwordResetPageForm.length > 0) {

		$passwordResetPageForm.submit(function () {
			var passwordConfirmation = $('input[name="password-confirm"]').val(),
				password = $('input[name="password"]').val();

			if (!isValidPassword(password) || password != passwordConfirmation) {
				return false;
			}
		});

	} else {
		var $accountModal = $('#signin-modal'),
			$resetPasswordModal = $('#reset-password'),
			$form = $accountModal.find('form'),
			$registerMessage = $accountModal.find('#register-message'),
			$registerLink = $accountModal.find('#register-message a'),
			$loginLink = $accountModal.find('#login-message a'),
			$resetPasswordLink = $accountModal.find('#forgot-password a'),
			$loginErr = $accountModal.find('#login-error'),
			$passportError = $accountModal.find('#passport-error'),
			$registerErr = $accountModal.find('#register-error'),
			$signinBtn = $accountModal.find('#signin'),
			$registerBtn = $accountModal.find('#register'),
			$pwConfirm = $accountModal.find('input[name="password-confirm"]'),
			$resetErr = $resetPasswordModal.find('#reset-error'),
			search = location.search.substring(1),
			searchQueryObject,
			hasMessage,
			loginErrorMap = {
				'00': 'Incorrect username.',
				'01': 'Incorrect password.',
				'02': 'User email is invalid.',
				'03': 'User already exists.',
				'04': 'Check your email to complete your registration!',
				'05': 'User could not be found.',
				'06': 'Oops, something went wrong. Please try again.',
				'07': 'Check your email to complete password reset!'
			};

		if (search.length > 0) {
			searchQueryObject = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
			hasMessage = searchQueryObject && searchQueryObject.e;
			if (searchQueryObject && searchQueryObject.e) {
				$passportError.text(loginErrorMap[searchQueryObject.e]).removeClass('ishidden');
			}

			if (hasMessage && (searchQueryObject.e == '04' || searchQueryObject.e == '07')) {
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
				if (!isValidPassword(password) ||
					!isValidEmail(username)) {

					$loginErr.removeClass('ishidden');
					return false;
				}
			} else {
				if (!isValidPassword(password) ||
					password != $pwConfirm.val() || 
					!isValidEmail(username)) {

					$registerErr.removeClass('ishidden');
					return false;
				}
			}

			$('.modal--signin__button .loader--white').removeClass('ishidden');
			
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

		$resetPasswordLink.click(function (e) {
			e.preventDefault();
			var $closeBtn = $resetPasswordModal.find('.modal--resetpw__close');

			$resetPasswordModal.find('form').submit(function () {
				var $this = $(this),
					username = $this.find('input[name="username"]').val();

				if (!isValidEmail(username)) {
					$resetErr.removeClass('ishidden');
					return false;
				}
			});

			$closeBtn.click(function () {
				$accountModal.show();
				$resetErr.addClass('ishidden');
				$resetPasswordModal.hide();
			});

			$accountModal.hide();
			$resetPasswordModal.show();
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
			var hasText = email != undefined && email.trim().length > 0;
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

			// return hasText && isPCLN && validTokens;
			return hasText && validTokens;
		}

	}

	function isValidPassword (password) {
		return password != undefined && password.trim().length > 6;
	}

	
})();
