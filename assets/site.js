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
const zipCheck = (() => {
  const $body = $(document.body);
  $('.btn--secondary.btn--full.cart__checkout').attr('id', 'checkout-btn');
  $body.on('submit', '.cart.ajaxcart', function(e) {
    e.preventDefault();
    disable();
    $('#warning-container').empty();

    const zipCode = $('#zip-input').val();
    const zipRegex = /^\d{5}$/;
    const isValidZip = zipRegex.test(zipCode);
    const id = parseInt(window.localStorage.getItem('taxId'));

    if (!isValidZip) {
      const message = 'please enter a valid zip code to continue';
      validation(message);
      enable();
    } else if (isValidZip && !id) {
      getTaxProduct(zipCode);
    } else if (id) {
      $.ajax({
        url: '/cart.js',
        contentType: 'application/json',
        dataType: 'json'
      })
        .then(data => {
          return data.items.filter(function(data) {
            return data.variant_id === id;
          });
        })
        .done(data => {
          if (data.length === 0) {
            window.localStorage.removeItem('taxId');
            getTaxProduct(zipCode);
          } else {
            $('.cart.ajaxcart')[0].submit();
          }
        });
    } else {
      const message = 'please enter a valid zip code to continue';
      validation(message);
    }
  });
})();

const getTaxProduct = zip => {
  $.ajax({
    url: '/cart.js',
    contentType: 'application/json',
    dataType: 'json'
  })
    .then(data => {
      const total = JSON.parse(data.total_price);
      return $.ajax({
        method: 'POST',
        url: 'http://fb426d6e.ngrok.io/compliance/check',
        data: { zip, total }
      });
    })
    .then(response => {
      if (!response.data.compliant) {
        const message = 'we currently do not ship to your location.';
        validation(message);
        enable();
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
      }).done(() => {
        $('.cart.ajaxcart')[0].submit();
      });
    });
};

const validation = message => {
  $('#warning-container').empty();
  $('#warning-container').append(`<p class="warning">${message}</p>`);
};

const disable = () => {
  $('.btn--secondary.btn--full.cart__checkout')
    .attr('disabled', 'disabled')
    .addClass('disabled');
};

const enable = () => {
  $('.btn--secondary.btn--full.cart__checkout')
    .removeAttr('disabled')
    .removeClass('disabled');
};
