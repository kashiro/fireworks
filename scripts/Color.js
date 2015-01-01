(function(exports) {

  'use strict';

  function Color(min){
    var min = min || 0;
    this.r = colorValue(min);
    this.g = colorValue(min);
    this.b = colorValue(min);
    this.style = createColorStyle(this.r, this.g, this.b);
  }

  function colorValue(min){
    // min 以上 254 未満
    return Math.floor(Math.random() * 255 + min);
  }

  function createColorStyle(r, g, b){
    return 'rgba(' + r + ',' + g + ',' + b + ',' + '0.8)';
  }

  exports.Color = Color;

})(window);
