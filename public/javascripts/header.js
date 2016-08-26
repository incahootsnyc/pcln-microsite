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
	  	mobileMenu.css('right', '-320px');
	  	hamburgerMenu.attr('src', 'images/hamburger.png');
	  	menuHidden = true;

	
	} else {

  		hamburgerMenu.css('display', 'block');

  		// menuHidden = true;
  		// mobileMenu.css('display', 'block')
  	}
};  	


hamburgerMenu.click(function() {
  	if (menuHidden) {
  		hamburgerMenu.attr('src', 'images/menu-close.png');
      	mobileMenu.animate({
	      right: 0, opacity: 1
	    }, 100 );

	    menuHidden = !menuHidden;
  	} else {
  		hamburgerMenu.attr('src', 'images/hamburger.png');
    	mobileMenu.animate({
    	right: "-250px", opacity: 0
    	}, 100 );
   	 	menuHidden = !menuHidden;
  	}
});


