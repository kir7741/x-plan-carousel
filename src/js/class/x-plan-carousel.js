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

  /**
   * Dom ref
   */
  _controls = {};

  /**
   * 真實資料長度
   */
  _realItemLength = 0;

  /**
   * 現在顯示的圖片索引
   */
  _currentIndex = null;

  /**
   * 是否正在動畫中
   */
  _isAnimate = false;

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
    // console.log(arguments);
    this.to(this._currentIndex + 1);
  }

  // TODO: 寫入上一頁
  prev() {
    // console.log(arguments);
    this.to(this._currentIndex - 1);
  }

  /**
   * 滑動至指定目標
   *
   * @param {number} targetIdx - 目標索引
   * @memberof XPlanCarousel
   */
  to(targetIdx) {

    // transitonend 監聽 css transition 結束後的事件 

    // 取得位移距離

    // TODO: 最後完成時，

    if (
      this._isAnimate ||
      this._currentIndex === targetIdx
    ) {
      return;
    }

    const distance = $(this._controls.$outer.children()[0]).width();
    this._isAnimate = true;
    this.updateDots(targetIdx);

    $.each(this._controls.$outer.children(), (index, item) => {

      const preCoordinate = $(item).css('left') || '';
      const left = +preCoordinate.replace(/px/g, '') - distance * (targetIdx - this._currentIndex) ;
      // TODO: 之後可增加 slidePerView 增加滑動張數

      $(item)
        .one('transitionend', (e) => {
          $(item).removeClass('animate')
          // TODO: 動畫完後 偷偷換位置（無限輪播用）

          if (index === this._controls.$outer.children().length - 1) {
            this._currentIndex = targetIdx;
            this._isAnimate = false;
            this.$element.trigger({
              type: 'pageChanged',
              currentIndex: this._currentIndex
            });
            this.updateCarousel();
          }

        })
        .css('left', left)
        .css('transition-duration', this._options.duringTime + 'ms')
        .addClass('animate');

    });

  }

  //  -2 -1 01234 567
  //   4  5 12345 123
  /**
   * TODO: 初始化元件包含其他Plugins 
   * 參考 owl.carousel 161行 將carousel本身 傳給新的物件
   * 創立一個navifation物件處理箭頭 載入dom即事件監聽
   *
   * @memberof XPlanCarousel
   */
  init(element, options) {

    // 先複製 抓要顯示個寬度 算總長度 設每個item寬度

    this.$element = $(element);
    this.$element.addClass(XPlanCarousel.DEFAULTS.rootClass);
    this._options = options;
    this._realItemLength = $(this.$element.children()).length;

    const realItems = this.$element.children();

    this._controls.$stage = $('<div class="carousel-item-stage">');

    $.each(realItems, (index, item) => {
      this._controls.$stage.append($('<div class="carousel-item">').append($(item)));
    })

    const singleWidth = this.$element.width() / this._options.slidePerView;
    let totalWidth = 0;
    const initialTarget = this.copyCarouselItem();

    this._controls.$outer = $('<div class="carousel-item-outer">').html(this._controls.$stage);

    $.each(this._controls.$stage.children(), (index, item) => {
      $(item).css('width', singleWidth + 'px');
      totalWidth += singleWidth;
    });

    this._controls.$stage
      .css({
        width: totalWidth + 'px',
				transform: 'translate3d(' + (-singleWidth * initialTarget) + 'px,0px,0px)',
				// transition: (this.speed() / 1000) + 's' + (
				// 	this.settings.slideTransition ? ' ' + this.settings.slideTransition : ''
				// )
			})

    this.$element.html(this._controls.$outer);

    $.each(XPlanCarousel.Plugins, $.proxy(function(key, plugin) {
      this._plugins[key.charAt(0).toLowerCase() + key.slice(1)] = new plugin(this);
    }, this));

  }

  /**
   * 更新 dot class 狀態
   *
   * @memberof XPlanCarousel
   */
  updateDots(targetIndex) {
    const dots = this._plugins.navigation._controls.$dots;

    $.each(dots, (index, dot) => {
      index === targetIndex ? $(dot).addClass('active') : $(dot).removeClass('active');
    });

  }

  getPosition(targetIndex) {

    let returnPosition = 0;

    // if (this._currentIndex < targetIndex) {
    //   for (let i = this._currentIndex ; i < ) {

    //   }
    // }

  }

  /**
   * 複製輪播內容
   *
   * @returns
   * @memberof XPlanCarousel
   */
  copyCarouselItem() {

    const stage = this._controls.$stage;
    const firstCopiedItem = stage.clone().children();
    const secondCopiedItem = stage.clone().children();
    const copiedLength = firstCopiedItem.length;
    const half = Math.ceil(copiedLength / 2);
    const rightPart = firstCopiedItem.slice(0, half).addClass('cloned');
    const leftPart = secondCopiedItem.slice(Math.floor(copiedLength / 2)).addClass('cloned');

    stage.prepend(leftPart);
    stage.append(rightPart);

    return half;

  }

  updateCarousel() {

    // item.clone().prependTo(outer);


    // Remove A cloned Items


    // clone new Items to front and back

  }

}

XPlanCarousel.DEFAULTS = {
  rootClass: 'x-plan-carousel',
  duringTime: 1000, // 滑動時間
  autoPlay: null,
  // {
    // delay: 3000, // 每張圖停幾秒
    // disabledOnInteraction: false // 跟畫面有互動時，不觸發 autoplay
  // }
  loop: false, 
  slidePerView: 1, // 畫面上一次顯示幾張
  arrowButton: true,
  showDot: true,
};

XPlanCarousel.Plugins = {};

export default XPlanCarousel;