import '../scss/carousel.scss';
import * as $ from 'jquery';
import generateCarouselPlugin from './generate-carousel-plugin';
import XPlanCarousel from './class/x-plan-carousel';
import Navigation from './class/navigation';

(function() {

  /**
   * jQuery
   */
  window.$ = $;

  // 將 XPlanCarousel 綁到 jQuery fn 上
  generateCarouselPlugin(XPlanCarousel);
	XPlanCarousel.Plugins.Navigation = Navigation;

})();
