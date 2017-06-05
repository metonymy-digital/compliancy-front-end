// *************************************
//
//   Zip check
//   -> check for zip code tax info
//
// *************************************
const zipCheck = (() => {
  const $body = $(document.body);
  // $('.btn--secondary.btn--full.cart__checkout').attr('id', 'checkout-btn');
  $body.on('click', '#check-zip', function(e) {
    const zipCode = $('#zip-input').val();
    const id = parseInt(window.localStorage.getItem('taxId'));
    const isValidZip = validateZip(zipCode);

    console.log(createForm(id));

    disable();

    if (!isValidZip) {
      const message = 'please enter a valid zip code to continue';
      displayError(message);
      enable();
    } else if (isValidZip && !id) {
      getTaxProduct(zipCode);
    } else if (id) {
      verifyId(id, zipCode);
    } else {
      const message = 'please enter a valid zip code to continue';
      displayError(message);
    }
  });

  // $body.on('submit', '.add-tax-form', e => {
  //   e.preventDefault();
  //   BOLD.helpers.triggerAddToCartEvent(e);
  // });
})();

const getTaxProduct = (zip, evt) => {
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
      if (response.data.compliant === false) {
        const message = 'We currently do not ship to your state.';
        displayError(message);
        enable();
        return;
      } else if (response.data.validZip === false) {
        const message = 'The zip code you entered is not a valid US zip code.';
        displayError(message);
        enable();
        return;
      }
      localStorage.setItem('taxId', response.data.id);
      createForm(response.data.id).submit();
      enable();
      return;
    });
};

const verifyId = (id, zip) => {
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
        getTaxProduct(zip);
      } else {
        console.log('tax has already been calculated.');
        enable();
        return;
      }
    });
};

const validateZip = zip => {
  const zipRegex = /^\d{5}$/;
  return zipRegex.test(zip);
};

const displayError = message => {
  $('#warning-container').empty();
  $('#warning-container').append(`<p class="warning">${message}</p>`);
};

const disable = () => {
  $('#warning-container').empty();
  $('.btn--secondary.btn--full.cart__checkout')
    .attr('disabled', 'disabled')
    .addClass('disabled');
};

const enable = () => {
  $('.btn--secondary.btn--full.cart__checkout')
    .removeAttr('disabled')
    .removeClass('disabled');
};

const createForm = id => {
  $form = $('<form></form>')
    .addClass('form__buy hide add-tax-form')
    .attr('id', 'AddToCartForm')
    .attr('method', 'POST')
    .attr('action', '/cart/add')
    .attr('enctype', 'multipart/form-data');
  $select = $('<select></select>')
    .addClass('product-single__variants no_ro_widge')
    .attr('name', 'id')
    .attr('id', 'productSelect');
  $option = $('<option></option>')
    .attr('selected', 'selected')
    .attr('value', id)
    .attr('data-sku', 'TAX');
  $input = $('<input />')
    .addClass('js-qty__num')
    .attr('name', 'quantity')
    .attr('id', 'Quantity')
    .attr('value', '1');

  $select.append($option);
  $form.append($select);
  $form.append($input);
  $(document.body).append($form);
  return $form;
};
