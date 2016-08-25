(function  () {
	var $accountModal = $('#signin-modal'),
		$form = $accountModal.find('form'),
		registerLink = $accountModal.find('#register-message a'),
		loginLink = $accountModal.find('#login-message a'),
		loginErr = $accountModal.find('#login-error')
		registerErr = $accountModal.find('#register-error'),
		signinBtn = $accountModal.find('#signin'),
		registerBtn = $accountModal.find('#register'),
		pwConfirm = $accountModal.find('input[name="password-confirm"]');


	$form.submit(function (e) {
		var $this = $(this),
			username = $this.find('input[name="username"]').val(),
			password = $this.find('input[name="password"]').val();

		hideErrors();

		if ($form.attr('action') == '/api/login') {
			if (username == undefined || username.trim().length == 0 ||
				password == undefined || password.trim().length == 0 ) {

				loginErr.removeClass('ishidden');
				return false;
			}
		} else {
			if (username == undefined || username.trim().length == 0 || 
				password == undefined || password.trim().length == 0 ||
				password != pwConfirm.val()) {

				registerErr.removeClass('ishidden');
				return false;
			}
		}
		
	});

	registerLink.click(function (e) {
		e.preventDefault();
		toggleFormType();
		$form.attr('action', '/api/signup');
	});

	loginLink.click(function (e) {
		e.preventDefault();
		toggleFormType();
		$form.attr('action', '/api/login');
	}); 


	function toggleFormType () {
		loginLink.parent().toggleClass('ishidden');
		registerLink.parent().toggleClass('ishidden');
		signinBtn.toggleClass('ishidden');
		registerBtn.toggleClass('ishidden');
		pwConfirm.toggleClass('ishidden');
		hideErrors();
	}

	function hideErrors () {
		loginErr.addClass('ishidden');
		registerErr.addClass('ishidden');
	}

})();
