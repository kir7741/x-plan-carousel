import $ from 'jquery';


export default function Carousel(className, shortHand = false) {

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

          // TODO: 綁定事件
          
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