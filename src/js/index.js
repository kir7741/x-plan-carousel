import '../scss/carousel.scss';
import * as $ from 'jquery';
import carousel from './carousel';

(function() {

  window.$ = $;
  
  class XPlanCarousel {
    constructor(element, options) {
        const $element = $(element);
        
        $(window).scroll(function () {
            if ($(this).scrollTop() > options.offset) {
                $element.fadeIn();
            } else {
                $element.fadeOut();
            }
        });
        
        $element.click(function (e) {
            e.preventDefault();
            
            $('html, body').animate({
                scrollTop: 0
            }, options.speed);
        });
    }
  }
  
  XPlanCarousel.DEFAULTS = {
    offset: 100,
    speed: 500,
  };
  
  carousel(XPlanCarousel);

})()
