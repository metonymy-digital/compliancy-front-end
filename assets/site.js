// *************************************
//
//   Pre-register check
//   -> Prevents registration if the T&C checkbox is not clicked
//
// *************************************
var preRegisterCheck = (function() {
  var $checkbox = $('#pre-register-check').find('input');
  var $label = $('#pre-register-check').find('label');
  
  $('#create_customer').submit(function(e){
    if (!$checkbox.is(':checked')) {
      e.preventDefault();
      $label.css({color:'red'});
    }
  });
})();

// *************************************
//
//   Variable Nav
//   -> sets styling logic for nav bars that switch styles depending on scroll postion
//
// *************************************

var variableNav = (function() {

  var isVariable = $('.template-index')[0] || $('.how-it-works')[0];

  function styleSwap() {
    if ($(document.body).scrollTop() !== 0) {
      $('#nav').css({'background-color': 'rgba(55, 55, 55, 0.5)'})
    } else {
      $('#nav').css({'background-color': 'rgba(0, 0, 0, 0)'})
    }
  }

  if (isVariable) {
    $(window).scroll(function() {
      styleSwap();
    });

    $(document).ready(function() {
      styleSwap();
    });
  }

})();
