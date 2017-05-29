// *************************************
//
//   Terms check
//   -> Prevents form submit unless T&C checkbox is not checked
//
// *************************************
var termsCheck = (function() {

  function requireChecked($formId) {
    $(document).submit(function(e){
      var $checkbox = $(document).find($formId + ' .terms-check input:checkbox');
      var $label = $(document).find($formId + ' .terms-check label');
      if (!$checkbox.is(':checked')) {
        console.log($formId)
        e.preventDefault();
        $label.css({color:'red'});
      }
    });
  }

  // only activates age check if on sign up page
  if ($('#create-account')[0]) {
    requireChecked('#create_customer');
  }

  // only activates cart age check if cart is visible
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if ($('#CartDrawer').is(':visible')) {
        requireChecked('#cart-form');
      }
    });
  });

  var observerConfig = {
    attributes: true,
    childList: true,
    characterData: true
  };

  var targetNode = document.getElementById('CartContainer');
  observer.observe(targetNode, observerConfig);

})();
