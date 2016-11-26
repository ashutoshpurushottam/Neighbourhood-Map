$(document).ready(function(){
  // Navigation Menu Slider
  $('#nav-expander').on('click',function(e){
    e.preventDefault();
    $('body').toggleClass('nav-expanded');
  });
  $('.mobile-menu').on('click', function(e) {
    e.preventDefault();
    $('body').toggleClass('nav-expanded');
  })

});