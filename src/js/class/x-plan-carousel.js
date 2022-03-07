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
   * 複製資料長度
   */
  _copyItemLength = 0;

  /**
   * 現在顯示的圖片索引
   */
  _currentIndex = 0;

  /**
   * 計算用的 current index （會有負值）
   */
  _calcIndex = 0;

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
    this.to(this._calcIndex + 1, 'right');
  }

  // TODO: 寫入上一頁
  prev() {
    this.to(this._calcIndex - 1, 'left');
  }

  /**
   * 滑動至指定目標
   *
   * @param {number} targetIdx - 目標索引
   * @memberof XPlanCarousel
   */
  to(targetIdx) {

    const realTarget = (targetIdx + this._realItemLength) % this._realItemLength;

    if (
      this._isAnimate ||
      this._currentIndex === realTarget ||
      (
        !this._options.loop &&
        ((targetIdx < 0) || (targetIdx >= this._realItemLength))
      )
    ) {
      return;
    }
    
    this._isAnimate = true;
    this.updateDots(realTarget);
    const movingDistance = this.getPosition(targetIdx);
    // 取得 transform 的參數
    const leftLimit = this._calcIndex === -(this._copyItemLength / 2);
    const rightLimit = this._calcIndex === this._realItemLength + (this._copyItemLength / 2) - 1;
    let reset = false;

    if (leftLimit || rightLimit) {
      // 碰到 right 的限制時，要往左邊移動＝>加 initialPosition
      // 碰到 left 的限制時，要往右邊移動＝>減 initialPosition
      this.resetCarouselPosition();
      reset = true;
    }

    // transitonend 監聽 css transition 結束後的事件 
    const transformMatrix = this.getCurrentTransForm();
    const stageX = +transformMatrix[4];
    const coordinate = stageX + movingDistance;

    this._controls.$stage
      .css({
        transform: 'translate3d(' + coordinate + 'px,0px,0px)',
        transtion: 'all',
        transitionDuration: this._options.duringTime + 'ms'
      })
      .addClass('animate')
      .one('transitionend', (e) => { 
        this._calcIndex = reset ? realTarget : targetIdx;
        this._currentIndex = realTarget;
        this._controls.$stage.removeClass('animate');
        this._isAnimate = false;
        this.$element.trigger({
          type: 'pageChanged',
          currentIndex: this._currentIndex
        });
      })

  }

  /**
   * 取得stage transform 的matrix
   *
   * @memberof XPlanCarousel
   */
  getCurrentTransForm() {
    return transformMatrix = this._controls.$stage.css('transform').replace(/[a-z]|\(|\)| */g, '').split(',');
  }

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
    const leftPartLength = this.copyCarouselItem();

    this._copyItemLength = leftPartLength * 2;
    this._controls.$outer = $('<div class="carousel-item-outer">').html(this._controls.$stage);

    $.each(this._controls.$stage.children(), (index, item) => {
      $(item).css('width', singleWidth + 'px');
      totalWidth += singleWidth;
    });

    this._controls.$stage
      .css({
        width: totalWidth + 'px',
				transform: 'translate3d(' + (-singleWidth * leftPartLength) + 'px,0px,0px)',
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
  
  /**
   * 計算位移距離
   */
  getPosition(targetIndex) {

    const difference = targetIndex - this._calcIndex;
    const singleWidth = this.$element.width() / this._options.slidePerView;
    const movingDistance = singleWidth * difference;

    return -movingDistance;

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
    const half = Math.ceil(copiedLength / 2); // 3
    let rightPart = null;
    let leftPart = null;

    if (half >= this._options.slidePerView) {
      rightPart = firstCopiedItem.slice(0, half).addClass('cloned');
      leftPart = secondCopiedItem.slice(Math.floor(copiedLength / 2)).addClass('cloned');
    } else {
      rightPart = firstCopiedItem.slice(0, this._options.slidePerView).addClass('cloned');
      leftPart = secondCopiedItem.slice(copiedLength - this._options.slidePerView, copiedLength ).addClass('cloned');
    }

    stage.prepend(leftPart);
    stage.append(rightPart);

    return leftPart.length;

  }

  /**
   * 重置 carousel 的動畫位置
   *
   * @memberof XPlanCarousel
   */
  resetCarouselPosition() {

    if (this._isAnimate) {
      return;
    }

    const singleWidth = this.$element.width() / this._options.slidePerView;
    const initialPosition = -singleWidth * (this._copyItemLength / 2 + this._currentIndex);

    this
      ._controls
      .$stage
      .css({
        transtion: 'none',
        transitionDuration: 0 + 'ms',
        transform: 'translate3d(' + initialPosition + 'px,0px,0px)',
      });

    this._calcIndex = this._currentIndex;

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