// *************************************
//
//   Home Nav
//   -> sets styling logic for home top nav
//
// *************************************
var homeNav = (function() {

  // set logic to decide if the current page is home
  var isHome = $('.template-index')[0];

  function styleSwap() {
    if ($(document.body).scrollTop() !== 0) {
      $('#nav').css({'background-color': 'rgba(55, 55, 55, 0.5)'})
    } else {
      $('#nav').css({'background-color': 'rgba(0, 0, 0, 0)'})
    }
  }

  if (isHome) {
    $(window).scroll(function() {
      styleSwap();
    });

    $(document).ready(function() {
      styleSwap();
    });
  }

})();
