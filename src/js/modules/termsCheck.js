// *************************************
//
//   Terms check
//   -> Prevents form submit unless T&C checkbox is checked
//
// *************************************
var termsCheck = (function() {
  function requireChecked($toSubmit) {
    $toSubmit.submit(function(e) {
      var $checkbox = $(this).find('.terms-check input:checkbox');
      var $label = $(this).find('.terms-check label');
      if (!$checkbox.is(':checked')) {
        e.preventDefault();
        $label.css({ color: '#B33A3A' });
      }
    });
  }

  requireChecked($('#create_customer'));
  requireChecked($('#CartContainer'));
})();
