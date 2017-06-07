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
  // $('.btn--secondary.btn--full.cart__checkout').attr('id', 'checkout-btn');
  $body.on('click', '#check-zip', function(e) {
    const zipCode = $('#zip-input').val();
    const id = parseInt(window.localStorage.getItem('taxId'));
    const isValidZip = validateZip(zipCode);

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
        url: 'http://a9e19b84.ngrok.io/compliance/check',
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
      localStorage.setItem('verified', true);
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
        localStorage.setItem('verified', false);
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
