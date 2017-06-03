// *************************************
//
//   Zip check
//   -> check for zip code tax info
//
// *************************************
const zipCheck = (function() {
  const $body = $(document.body);
  $('.btn--secondary.btn--full.cart__checkout').attr('id', 'checkout-btn');
  $body.on('submit', '.cart.ajaxcart', function(e) {
    e.preventDefault();
    $('.btn--secondary.btn--full.cart__checkout')
      .attr('disabled', 'disabled')
      .addClass('disabled');
    $('#warning-container').empty();

    const zipCode = $('#zip-input').val();
    const zipRegex = /^\d{5}$/;
    const isValidZip = zipRegex.test(zipCode);
    const id = parseInt(window.localStorage.getItem('taxId'));
    console.log('ID', id);
    if (id) {
      $.ajax({
        url: '/cart.js',
        contentType: 'application/json',
        dataType: 'json'
      })
        .then(function(data) {
          return data.items.filter(function(data) {
            return data.variant_id === id;
          });
        })
        .done(function(data) {
          if (data.length === 0) {
            $('#warning-container').empty();
            $('#warning-container').append(
              '<p class="warning">please enter a valid zip code to continue!!</p>'
            );
            $('.btn--secondary.btn--full.cart__checkout')
              .removeAttr('disabled', 'disabled')
              .removeClass('disabled');
            return false;
          } else {
            $('.cart.ajaxcart')[0].submit();
          }
        });
    } else if (isValidZip && !id) {
      $.ajax({
        url: '/cart.js',
        contentType: 'application/json',
        dataType: 'json'
      })
        .then(function(data) {
          const total = JSON.parse(data.total_price);
          return $.ajax({
            method: 'POST',
            url: 'http://fb426d6e.ngrok.io/compliance/check',
            data: { zip: zipCode, total: total }
          });
        })
        .then(function(response) {
          if (!response.data.compliant) {
            $('#warning-container').empty();
            $('#warning-container').append(
              '<p class="warning">we do not currently ship to that location.</p>'
            );
            $('.btn--secondary.btn--full.cart__checkout')
              .removeAttr('disabled')
              .removeClass('disabled');
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
      $('#warning-container').empty();
      $('#warning-container').append(
        '<p class="warning">please enter a valid zip code to continue</p>'
      );
    }
  });
})();
