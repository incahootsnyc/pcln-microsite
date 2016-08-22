var hamburgerMenu = $('#hamburger-icon');
var mobileMenu = $('#navbar-mobile');
var menuHidden = true;


// window.onload = function() {	
// 	var screenWidth = document.documentElement.clientWidth;	  		  	
//   	if (screenWidth > 850) {
//   		hamburgerMenu.css('display', 'none');
//   	}

window.onresize = function() {	
	var screenWidth = document.documentElement.clientWidth;	  	
	if (screenWidth > 840) {
	  	hamburgerMenu.css('display', 'none');
	  	mobileMenu.css('display', 'none');
	  	hamburgerMenu.attr('src', 'images/hamburger.png');
	  	menuHidden = true;
	
	} else {
  		hamburgerMenu.css('display', 'block');
  	}
};  	


hamburgerMenu.click(function (){
	console.log("hello");

	if (menuHidden) {
		mobileMenu.toggle();
		hamburgerMenu.attr('src', 'images/menu-close.png');
		menuHidden = false;
	} else {
		mobileMenu.toggle();
		hamburgerMenu.attr('src', 'images/hamburger.png');

		menuHidden = true;
	}	
});
