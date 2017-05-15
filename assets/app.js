$(function() {
  $(window).scroll(function() {
    console.log('scrolling');
    if ($(document.body).scrollTop() !== 0) {
      $('#nav').css({'background-color': 'rgba(55, 55, 55, 0.5)'})
    } else {
      $('#nav').css({'background-color': 'rgba(0, 0, 0, 0)'})
    }
  })
   $("#my-menu").mmenu({});
});
