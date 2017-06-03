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
    $('.template-list-collections')[0]||
    $('.template-collection')[0];

  if (navIsVariable) {
    $(window).scroll(function() {
      styleSwap();
    });

    $(document).ready(function() {
      styleSwap();
    });
  }

})();

// *************************************
//
//   Zip check
//   -> check for zip code tax info
//
// *************************************
var zipCheck = (function() {
  var $body = $(document.body);
  console.log($('.btn--secondary.btn--full.cart__checkout'));
  $('.btn--secondary.btn--full.cart__checkout').attr('id', 'checkout-btn');
  // $body.on('submit', '.cart.ajaxcart', function(e) {
  //   e.preventDefault();
  //   var id = parseInt(window.localStorage.getItem('taxId'));
  //   $.ajax({
  //     url: '/cart.js',
  //     contentType: 'application/json',
  //     dataType: 'json'
  //   })
  //     .then(function(data) {
  //       return data.items.filter(function(data) {
  //         return data.variant_id === id;
  //       });
  //     })
  //     .done(function(data) {
  //       if (data.length === 0) {
  //         console.log('tax id not present');
  //         return false;
  //       } else {
  //         console.log('submitting...');
  //       }
  //     });
  // });
  $body.on('submit', '.cart.ajaxcart', function(e) {
    e.preventDefault();
    $('.btn--secondary.btn--full.cart__checkout')
      .attr('disabled', 'disabled')
      .addClass('disabled');
    var zipCode = $('#zip-input').val();
    const zipRegex = /^\d{5}$/;
    const isValidZip = zipRegex.test(zipCode);

    if (isValidZip) {
      $.ajax({
        url: '/cart.js',
        contentType: 'application/json',
        dataType: 'json'
      })
        .then(function(data) {
          var total = JSON.parse(data.total_price);
          return $.ajax({
            method: 'POST',
            url: 'http://fb426d6e.ngrok.io/compliance/check',
            data: { zip: zipCode, total: total }
          });
        })
        .then(function(response) {
          if (!response.data.compliant) {
            $('.zip-check').append(
              '<p class="warning">we do not currently ship to that location.</p>'
            );
            return;
          }
          localStorage.setItem('taxId', response.data.id);
          $.ajax({
            method: 'POST',
            url: '/cart/add.js',
            dataType: 'json',
            data: {
              quantity: 1,
              id: response.data.id
            }
          }).done(function() {
            $('.cart.ajaxcart')[0].submit();
          });
        });
    } else {
      $('.zip-check').append(
        '<p class="warning">please enter a valid zip code to continue</p>'
      );
    }
  });
})();
