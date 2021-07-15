/***********************************************************
* @file     jquery.i18n.js
* @author   Michael Krocka
* @version  0.0
*
* @brief    Translation.
***********************************************************/
"use strict";
// *********************************************************
(function($) {
  const REG  = /^[ \r\n\t]*|[ \r\n\t]*$/g;
  // -------------------------------------------------------
  $.fn.i18n = function(obj) {
    return this.each(function() {
      if (obj == undefined || obj.vocabulary == undefined)
         return;
      // ...................................................
      for (let Prop of ["title", "label", "placeholder"]) {
        let Class = `.lang-${Prop}`;

        $(Class, this)
        .filter((ix, el) => $(el).prop(Prop) != "")
        .each(function() {
          if ($(this).data(Class) == undefined)
            $(this).data(Class, $(this).prop(Prop));
          $(this).prop(Prop, getText(this, $(this)
            .data(Class)));
        });
      }
      // ...................................................
      $('.lang', this)
      .filter((ix, el) => $(el).text() != "")
      .each(function() {
//        let txt = $(this).text().replace(REG, "");
        let txt = $(this).html().trim();
        
        if ($(this).data("lang") == undefined)
          $(this).data("lang", txt);
        $(this).html(getText(this, $(this).data("lang")));
      });
      // ...................................................
      $('.lang-value', this)
      .filter((ix, el) => $(el).val() != "")
      .each(function() {
        let txt = $(this).val().replace(REG, "");
        
        if ($(this).data("lang-value") == undefined)
          $(this).data("lang-value", txt);
        $(this).val(getText(this, $(this)
          .data("lang-value")));
      });
    });
    // .....................................................
    function getText(el, T){
      if(obj.lang != "en-en"){
        if(obj.vocabulary[T] == undefined)
          console.log("i18n", T, el, $(el).data());
        else
          T = obj.vocabulary[T];
      }
      return T;
    }
  }
  // -------------------------------------------------------
  $.i18n = function(text, obj) {
    return obj.vocabulary[text] == undefined ?
           text : obj.vocabulary[text];
  }
})(jQuery);
