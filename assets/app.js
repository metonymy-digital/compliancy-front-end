$(function() {
  $(window).scroll(function() {
    console.log('scrolling');
    if ($(document.body).scrollTop() !== 0) {
      $('#nav').css({'background-color': 'rgba(55, 55, 55, 0.5)'})
    } else {
      $('#nav').css({'background-color': 'rgba(0, 0, 0, 0)'})
    }
  })

  if (window.location.pathnamne !== '/') {
    console.log('not home');
    $('#nav').css({'background-color': 'rgba(55, 55, 55, 0.5)'})
  }

  $('ul.product-tabs').each(function(){
    var active, content, links = $(this).find('a');
    active = links.first().addClass('active');
    content = $(active.attr('href'));
    links.not(':first').each(function () {
      $($(this).attr('href')).hide();
    });
    $(this).find('a').click(function(e){
      active.removeClass('active');
      content.hide();
      active = $(this);
      content = $($(this).attr('href'));
      active.addClass('active');
      content.show();
      return false;
    });
  });

  $('ul.featured-wines__nav').each(function(){
    var active, content, links = $(this).find('a');
    active = links.first().addClass('active');
    content = $(active.attr('href'));
    links.not(':first').each(function () {
      $($(this).attr('href')).hide();
    });
    $(this).find('a').click(function(e){
      active.removeClass('active');
      content.hide();
      active = $(this);
      content = $($(this).attr('href'));
      active.addClass('active');
      content.show();
      return false;
    });
  });
});
