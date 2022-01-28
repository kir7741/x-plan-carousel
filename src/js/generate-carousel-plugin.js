import $ from 'jquery';


export default function generateCarouselPlugin(className, shortHand = false) {

  const pluginName = 'XPlanCarousel'
  let dataName = `_${pluginName}`;
  let old = $.fn[pluginName];

  $.fn[pluginName] = function (option) {
    return this.each(function () {

      // 抓取的 DOM
      let $this = $(this);

      // 抓取 DOM上的 data attribute
      let data = $this.data(dataName);

      // 設定套件參數
      let options = $.extend({}, className.DEFAULTS, $this.data(), typeof option === 'object' && option);

      // 若無資料，則新增一個新資料給他

      if (!data) {
        data = new className(this, options);
        $this.data(dataName, data);

        $.each([
          'next', 'prev'
          // , 'to', 'destroy', 'refresh', 'replace', 'add', 'remove'
        ], function(i, event) {
          // data.register({ type: Owl.Type.Event, name: event });
          // $.proxy => bind
          data.$element.on(event + '.XPlanCarousel', $.proxy(function(e) {

            // if (e.namespace && e.relatedTarget !== this) {
            this.suppress([ event ]);
            data[event].apply(this, [].slice.call(arguments, 1));
            this.release([ event ]);
            // }
          }, data));
        });
        
      }

      $this.data('joseph', 'gay')

      if (typeof option === 'string') {
        data[option]();
      }
    
    });
  };

  // - Short hand
  if (shortHand) {
    $[pluginName] = (options) => $({})[pluginName](options);
  }

  // - No conflict
  $.fn[pluginName].noConflict = () => $.fn[pluginName] = old;

}