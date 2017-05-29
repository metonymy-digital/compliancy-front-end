// *************************************
//
//   Terms check
//   -> check for zip code tax info
//
// *************************************
var zipCheck = (function() {
  var $body = $(document.body)
    console.log($('.btn--secondary.btn--full.cart__checkout'));
    $('.btn--secondary.btn--full.cart__checkout').attr('id', 'checkout-btn')
  $body.on('submit', '.cart.ajaxcart', function(e) {
    e.preventDefault()
    var id = parseInt(window.localStorage.getItem('taxId'))
    $.ajax({
      url: '/cart.js',
      contentType: 'application/json',
      dataType: 'json',
    }).then(function(data) {
      return data.items.filter(function(data) {
        return data.variant_id === id
      })
    }).done(function(data) {
      if (data.length === 0) {
        console.log('tax id not present');
        return false
      } else {
        console.log('submitting...');
        $('.cart.ajaxcart')[0].submit()
      }

    })
  })
  $body.on('submit', '#cart-form', function(e) {
    e.preventDefault()
    var zipCode = $('#zip-input').val()

    $.ajax({
      url: '/cart.js',
      contentType: 'application/json',
      dataType: 'json',
    }).then(function(data) {
      var total = JSON.parse(data.total_price)
       return $.ajax({
          method: "POST",
          url: 'http://cec38c4d.ngrok.io/compliance/check',
          data: { zip: zipCode, total: total },
        })
    }).then(function(response) {
      if (!response.data.compliant) {
        console.log('NOT COMPLIANT');
        return
      }
      localStorage.setItem('taxId', response.data.id);
      $.ajax({
        method: "POST",
        url: '/cart/add.js',
        dataType: 'json',
        data: {
          quantity: 1,
          id: response.data.id
        }
      }).then(function() {
        console.log('were done here');
      })
    })
  });

})();
