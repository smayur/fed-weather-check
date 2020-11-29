(function() {

  var humberger = document.querySelector('.burger');
  var navbar = document.querySelector('.navbar');

  // Function to hide and show navbar on click of humberger icon.
  humberger.addEventListener('click', function() {
    navbar.classList.toggle('hide-navbar');
  });

})();