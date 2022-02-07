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


  constructor(carousel) {
    this.init(carousel)
  }

  // TODO: 上下一頁呼叫carousel的next 和 pre
  next() {
    console.log('next');
  }

  prev() {
    console.log('pre');
  }

  init(carousel) {

    this._core = carousel;
		this._core._options = $.extend({}, Navigation.DEFAULTS, this._core._options);
    const setting = this._core._options;

    const container = setting.arrowContainer ? 
                      $(setting.arrowContainer) :
                      $('.' + setting.rootClass)

    this._controls.$previous = $('<button type="button" class="arrow">')
                                .addClass(setting.arrowClass[0])
                                .html(setting.arrowText[0])
                                .appendTo(container)
                                .on('click', $.proxy(function(e) {
                                  this.prev();
                                }, this))

    this._controls.$next = $('<button' + 'type="button" class="arrow"' + '>')
                              .addClass(setting.arrowClass[1])
                              .html(setting.arrowText[1])
                              .appendTo(container)
                              .on('click', $.proxy(function(e) {
                                this.next();
                              }, this))

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
