// *************************************
//
//   Home Nav
//   -> sets styling logic for home top nav
//
// *************************************
var homeNav = (function() {

  function styleSwap() {
    if ($(document.body).scrollTop() !== 0) {
      $('#nav').css({'background-color': 'rgba(55, 55, 55, 0.5)'})
    } else {
      $('#nav').css({'background-color': 'rgba(0, 0, 0, 0)'})
    }
  }

  $(window).scroll(function() {
    styleSwap();
  });

  $(document).ready(function() {
    styleSwap();
  });

})();
