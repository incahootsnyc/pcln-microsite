(function () {
  var $hamburgerMenu = $('#hamburger-icon');
  var $mobileMenu = $('#navbar-mobile');
  var menuHidden = true;


  // window.onload = function() { 
  //  var screenWidth = document.documentElement.clientWidth;           
  //    if (screenWidth > 850) {
  //      $hamburgerMenu.css('display', 'none');
  //    }

  window.onresize = function() {  
    var screenWidth = document.documentElement.clientWidth;     
    
    if (screenWidth > 840) {
        $hamburgerMenu.css('display', 'none').attr('src', 'images/hamburger.png');
        $mobileMenu.css('display', 'none').removeClass('slideInAnimation');
        menuHidden = true;    

    
    } else {

        $hamburgerMenu.css('display', 'block');
        $mobileMenu.css('display', 'block');
      }
  };    


  $hamburgerMenu.click(function() {
      if (menuHidden) {

      $mobileMenu.addClass("slideInAnimation");
      $hamburgerMenu.attr('src', 'images/menu-close.png');

      menuHidden = !menuHidden;

      } else {
        $mobileMenu.removeClass("slideInAnimation");
         $hamburgerMenu.attr('src', 'images/hamburger.png');

        menuHidden = !menuHidden;
      }
  });

})();

