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

// *************************************
//
//   Variable Nav
//   -> sets styling logic for nav bars that switch styles depending on scroll postion
//
// *************************************

var variableNav = (function() {

  // define style swap function
  function styleSwap() {
    if ($(document.body).scrollTop() !== 0) {
      $('#nav').css({'background-color': 'rgba(55, 55, 55, 0.5)'})
    } else {
      $('#nav').css({'background-color': 'rgba(0, 0, 0, 0)'})
    }
  }

  // scope to the pages that should have variable navbar
  var navIsVariable =
    $('.template-index')[0] ||
    $('.how-it-works')[0] ||
    $('.template-list-collections')[0];

  if (navIsVariable) {
    $(window).scroll(function() {
      styleSwap();
    });

    $(document).ready(function() {
      styleSwap();
    });
  }

})();
