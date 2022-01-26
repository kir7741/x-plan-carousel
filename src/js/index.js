import '../scss/carousel.scss';
import * as $ from 'jquery';
import carousel from './carousel';

(function() {

  /**
   * jQuery
   */
  window.$ = $;


  class XPlanCarousel {

    $element = null;

    /**
     * 確認是否有事件正在執行
     */
    _supress = {};

    plugs = {}

    
  

    constructor(element, options) {
      this.$element = $(element);
      
      // $(window).scroll(function () {
      //     if ($(this).scrollTop() > options.offset) {
      //       $element.fadeIn();
      //     } else {
      //       $element.fadeOut();
      //     }
      // });
      
      // $element.click(function (e) {
      //     e.preventDefault();
          
      //     $('html, body').animate({
      //       scrollTop: 0
      //     }, options.speed);
      // });
    }

    /**
     * 將指定事件狀態設為處理中
     *
     * @memberof XPlanCarousel
     */
    suppress(events) {
      $.each(events, $.proxy(function(index, event) {
        this._supress[event] = true;
      }, this));
    };

    /**
     * 將指定事件狀態釋放出來
     *
     * @memberof XPlanCarousel
     */
    release(events) {
      $.each(events, $.proxy(function(index, event) {
        delete this._supress[event];
      }, this));
    };
    // TODO: 寫入下一頁事件
    next() {
      console.log(arguments);
    }

    // TODO: 寫入上一頁
    pre() {
      console.log(arguments);
    }

    /**
     * TODO: 初始化元件包含其他Plugins 
     * 參考 owl.carousel 161行 將carousel本身 傳給新的物件
     * 創立一個navifation物件處理箭頭 載入dom即事件監聽
     *
     * @memberof XPlanCarousel
     */
    init() {

    }


  }
  
  XPlanCarousel.DEFAULTS = {
    offset: 100,
    speed: 500,
  };
  
  carousel(XPlanCarousel);

})()
