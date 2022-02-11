class Navigation {

  /**
   * carousel 
   *
   * @memberof Navigation
   */
  _core = null;

  /**
   * 所有 DOM 控制項
   *
   * @memberof Navigation
   */
  _controls = {};

  /**
   * 複寫原功能
   *
   * @memberof Navigation
   */
  _overrides = {};

  constructor(carousel) {
    this.init(carousel)
  }

  // TODO: 上下一頁呼叫carousel的next 和 pre
  next() {
    this._overrides.next.bind(this._core)();
  }

  prev() {
    this._overrides.prev.bind(this._core)();
  }

  /**
   * 執行 x-plan-carousel to function
   *
   * @param {number} targetIdx - 目標索引
   * @memberof Navigation
   */
  to(targetIdx) {
    this._overrides.to.bind(this._core)(targetIdx);
  }

  init(carousel) {

    this._core = carousel;

    this._overrides = {
      next: this._core.next,
      prev: this._core.prev,
    }

		this._core._options = $.extend({}, Navigation.DEFAULTS, this._core._options);
    const setting = this._core._options;

    const container = setting.arrowContainer ? 
                      $(setting.arrowContainer) :
                      $('.' + setting.rootClass)

    this._controls.$previous = $('<button type="button">')
                                .addClass(setting.arrowClass[0])
                                .addClass(setting.arrowContainer ? '' : 'arrow')
                                .html(setting.arrowText[0])
                                .appendTo(container)
                                .on('click', () => this.prev())

    this._controls.$next = $('<button type="button">')
                              .addClass(setting.arrowClass[1])
                              .addClass(setting.arrowContainer ? '' : 'arrow')
                              .html(setting.arrowText[1])
                              .appendTo(container)
                              .on('click', () => this.next())

  } 

}

Navigation.DEFAULTS = {
  isArrowShow: true,
  arrowText: [
    '<i class="fas fa-chevron-left"></i>',
    '<i class="fas fa-chevron-right"></i>'
  ],
  arrowClass: [
    'x-plan-prev',
    'x-plan-next'
  ],
  navSpeed: false,

  // 如果要客製，自行丟入 jquery 可以抓到的dom
  arrowContainer: '',
  isDotsShow: true,

}

export default Navigation;
