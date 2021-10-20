(function($) {
  'use strict';

  if ( typeof(AOS) !== 'undefined' ) {
    AOS.init({
      easing: 'ease-in-out-sine',
      delay: 100,
      once: true,
      disable: 'mobile'
    });
  }



  var portfolio_galleries = $('.portfolio-gallery');

  for (var i = 0; i < portfolio_galleries.length; i++) {
    var gallery = $(portfolio_galleries[i])
    var filter = $(gallery).find('ul.filter')[0];

    if ( !filter ) { continue; }

    var links = $(filter).find('a');

    for (var j = 0; j < links.length; j++) {
      var link = links[j];
      $(link).on('click', function() {

        $(this).closest('ul.filter').find('li').removeClass('current');
        $(this).closest('li').addClass('current');

        var href = $(this).attr('href');
        var className = href.substring(1);
        var works = $(this).closest('.portfolio-gallery').find('.work');

        if ( className == 'all') {
          $(works).removeClass('dim');

        } else {
          for (var k = 0; k < works.length; k++) {
            var work = works[k];

            if ( $(work).hasClass(className) ) {
              $(work).removeClass('dim');
            } else {
              $(work).addClass('dim');
            }

          }

        }

        return false;
      });
    }

  }


  var $contact_forms = $('form.blahlab_contact_form');

  for (var i = 0; i < $contact_forms.length; i++) {

    $($contact_forms[i]).validate({
      messages: { },
      submitHandler: function(form) {
        $.ajax({
          type: 'POST',
          url: 'send.php',
          data: $(form).serialize(),
          success: function(data) {
            if(data.match(/success/)) {
              $(form).trigger('reset');
              $(form).find('p.thanks').removeClass('hide').show().fadeOut(5000);
            }
          }
        });
        return false;
      }
    });

  }


  $(".navbar-burger").on('click', function() {

    $(".navbar-burger").toggleClass("is-active");
    $(".navbar-menu").toggleClass("is-active");

  });



  $.extend($.easing, {
    easeInBack: function (x, t, b, c, d, s) {
      if (s == undefined) s = 1.70158;
      return c*(t/=d)*t*((s+1)*t - s) + b;
    }
  });

  $(document).ready(function() {

    if ( $(window).scrollTop() > $(window).height() * 3/5 ) {
      $('.scroll-hint').addClass('flip');
    }

    setTimeout(function() {
      $('.scroll-hint').addClass('enable-animation');
    }, 200);

    $('.scroll-hint').css('visibility', 'visible');
  });

  // scroll hint
  $(window).on('scroll', function() {
    if ( $(window).scrollTop() > $(window).height() * 3/5 ) {
      $('.scroll-hint').addClass('flip');
    } else {
      $('.scroll-hint').removeClass('flip');
    }
    // console.log($(document).height() - ($(window).scrollTop() + $(window).height()));
  });

  $('.scroll-hint .arrow').on('click', function() {

    if ( $(this).closest('.scroll-hint').hasClass('flip') ) {
      // whether scroll near the bottom
      if ( $(document).height() - ($(window).scrollTop() + $(window).height()) < 300 ) {
        var easing = 'swing';
      } else {
        var easing = 'easeInBack';
      }

      $('html').animate({ scrollTop: 0 },  700, easing);
    }

    return false;
  });


  $('.hero').on("mousemove", function(e) {

    // return;

    var mask = $('#reveal-mask circle')[0];

    var maskWidth = $(mask).attr('r');

    var heroOffset = $('.hero').offset();

    var cx = e.pageX - heroOffset.left;
    var cy = e.pageY - heroOffset.top;

    mask.setAttribute("cy", cy + 'px');
    mask.setAttribute("cx", cx + 'px');

  });

  $('.toggler').on('click', function() {

     $(this).closest('.post').toggleClass('show-excerpt');

     return false;

  });

  $('.meta-title').on('click', function() {

     $(this).closest('.post').toggleClass('show-excerpt');

     return false;

  });

  if ( $('.featured-posts.owl-carousel').length > 0 ) {

    $(".featured-posts.owl-carousel").owlCarousel({
      loop: false,
      dots: false,
      items: 1,
      navText: ['&xlarr;', '&xrarr;'],
      nav: true
    });

  }


  if ( $(".carousel .owl-carousel").length > 0 ) {

    function checkOwlImageSize() {

      var image = $(".carousel .owl-carousel img")[0];
      var imageContainer = $(image).closest('.owl-item');

      if ( image.naturalHeight > 0 ) {

        if ( $(imageContainer).height() * 1.0 / image.naturalHeight < 0.8 ) {
          console.log('not big');

          $('.carousel .owl-carousel .owl-stage').removeClass('flex');
          $(".carousel .owl-carousel").trigger('refresh.owl.carousel');
          $('.carousel .owl-carousel .owl-stage').addClass('flex');

        }

      } else {
        console.log('not load');
        setTimeout(checkOwlImageSize, 500);
      }

    }

    // setInterval(checkOwlImageSize, 100);

    $(".carousel .owl-carousel").on('initialized.owl.carousel', function() {
      $(this).find('.owl-stage').addClass('flex');

      var stageHeight = $(this).find('.owl-stage').height();
      var items = $(this).find('.owl-item');

    });

    $(".carousel .owl-carousel").on('refreshed.owl.carousel', function() {
      checkOwlImageSize();
    });

    $(".carousel .owl-carousel").owlCarousel({
      loop: false,
      dots: false,
      autoWidth: true,
      // lazyLoad: true,
      responsive: {
        0: {
          items: 1,
          nav: true,
          margin: 30,
          navText: ['&xlarr;', '&xrarr;']
        },
        768: {
          items: 2,
          margin: 60,
          center: true,
          nav: true,
          navText: ['&xlarr;', '&xrarr;']
        }
      }
    });


    // overwrite Owl.prototype.maximum in owl.carousel.js
    $(".carousel .owl-carousel").data('owl.carousel').maximum = function(relative) {
      var settings = this.settings,
        maximum = this._coordinates.length,
        iterator,
        reciprocalItemsWidth,
        elementWidth;

      if (settings.loop) {
        maximum = this._clones.length / 2 + this._items.length - 1;
      } else if (settings.autoWidth || settings.merge) {
        iterator = this._items.length;
        if (iterator) {
          reciprocalItemsWidth = this._items[--iterator].width();
          elementWidth = this.$element.width();
          while (iterator--) {
            reciprocalItemsWidth += this._items[iterator].width() + this.settings.margin;

            // overwrite
            var theLength;
            if ( settings.center ) {

              if ( iterator - 1 < 0 ) {
                theLength = elementWidth / 2.0;
              } else {
                theLength = elementWidth / 2.0 - ( this._items[iterator - 1].width() + this.settings.margin ) / 2.0;
              }

            } else {
              theLength = elementWidth;
            }

            if (reciprocalItemsWidth > theLength) {
              break;
            }

          }
        }

        // overwrite
        if ( settings.items == 1 ) {
          maximum = iterator + 1;
        } else {
          maximum = iterator;
        }


      } else if (settings.center) {
        maximum = this._items.length - 1;
      } else {
        maximum = this._items.length - settings.items;
      }

      if (relative) {
        maximum -= this._clones.length / 2;
      }

      return Math.max(maximum, 0);
    };


    // // overwrite Owl.prototype.maximum in owl.carousel.js
    // $(".carousel .owl-carousel").data('owl.carousel').maximum = function(relative) {
    //   var settings = this.settings,
    //     maximum = this._coordinates.length,
    //     iterator,
    //     reciprocalItemsWidth,
    //     elementWidth;

    //   if (settings.loop) {
    //     maximum = this._clones.length / 2 + this._items.length - 1;
    //   } else if (settings.autoWidth || settings.merge) {
    //     iterator = this._items.length;
    //     if (iterator) {
    //       reciprocalItemsWidth = this._items[--iterator].width();
    //       elementWidth = this.$element.width();
    //       while (iterator--) {
    //         reciprocalItemsWidth += this._items[iterator].width() + this.settings.margin;
    //         if (reciprocalItemsWidth > elementWidth) {
    //           break;
    //         }
    //       }
    //     }
    //     maximum = iterator + 1;
    //   } else if (settings.center) {
    //     // overwrite, the 1/3 left by the 2/3 in function coordinates
    //     maximum = this._items.length - Math.ceil(settings.items * 1.0 / 3);
    //   } else {
    //     maximum = this._items.length - settings.items;
    //   }

    //   if (relative) {
    //     maximum -= this._clones.length / 2;
    //   }

    //   return Math.max(maximum, 0);
    // };

    // // overwrite Owl.prototype.coordinates in owl.carousel.js
    // $(".carousel .owl-carousel").data('owl.carousel').coordinates = function(position) {
    //   var multiplier = 1,
    //     newPosition = position - 1,
    //     coordinate;

    //   if (position === undefined) {
    //     return $.map(this._coordinates, $.proxy(function(coordinate, index) {
    //       return this.coordinates(index);
    //     }, this));
    //   }

    //   if (this.settings.center) {
    //     if (this.settings.rtl) {
    //       multiplier = -1;
    //       newPosition = position + 1;
    //     }

    //     coordinate = this._coordinates[position];
    //     coordinate += (this.width() - coordinate + (this._coordinates[newPosition] || 0)) / 2 * multiplier;

    //     // overwrite
    //     coordinate = this.width() * 2 / 3 + ( this._coordinates[position] + (this._coordinates[newPosition] || 0) ) / 2
    //     coordinate = coordinate * multiplier;

    //   } else {
    //     coordinate = this._coordinates[newPosition] || 0;
    //   }

    //   coordinate = Math.ceil(coordinate);

    //   return coordinate;
    // };

    // $(".carousel .owl-carousel").data('owl.carousel').refresh();

  }



})(jQuery);