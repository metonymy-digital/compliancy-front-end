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
