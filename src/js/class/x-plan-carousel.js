class XPlanCarousel {

  $element = null;

  /**
   * 確認是否有事件正在執行
   */
  _supress = {};

  /**
   * 額外功能plugin
   */
  _plugins = {}

  /**
   * 設定檔
   */
  _options = {};

  constructor(element, options) {

    this.init(element, options);

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
  init(element, options) {

    this.$element = $(element);
    this.$element.addClass(XPlanCarousel.DEFAULTS.rootClass);
    this._options = options;

    $.each(XPlanCarousel.Plugins, $.proxy(function(key, plugin) {
      this._plugins[key.charAt(0).toLowerCase() + key.slice(1)] = new plugin(this);
    }, this));
    
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

}

XPlanCarousel.DEFAULTS = {
  offset: 100,
  speed: 500,
  rootClass: 'x-plan-carousel'
};

XPlanCarousel.Plugins = {};

export default XPlanCarousel;