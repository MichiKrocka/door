/***********************************************************
* @file     jquery.dialog.js
* @author   Michael Krocka
* @version  0.0
*
* @brief    Modal dialog window.
***********************************************************/
(function($) {
  // #######################################################
  $.alert = function(text, options) {
    opts = $.extend({
      alert_class:"w3-red"
    }, options);
    var dia = $(
      '<div class="w3-padding w3-left-align '+
        opts.alert_class+'">'+
        text+
      '</div>'
    ).dialog("open", opts);
    return dia;
  };
  // #######################################################
  $.fn.dialog = function(action, options) {
    var self = this;
    return this.each(function() {
      var elem  = $(this),
          opts  = {},
          nPage = $('.page:not(.hidden)', elem).length,
          iPage = 0;

      self.close = close;
      // ---------------------------------------------------
      function close(){
        $(window).off("resize", resize);
        elem.hide();
        opts = elem.data("opts");
        if(typeof opts == "undefined")
          return;
        opts.prev.after(elem);
        $('*', self).off();
        opts.element.off().remove();
      }
      // ---------------------------------------------------
      function resize(ev){
        if(elem.resize_t)
          clearTimeout(elem.resize_t);
        elem.resize_t = setTimeout(move, 500);
      }
      // ---------------------------------------------------
      function move(){
        var modal = elem.closest('.w3-modal'),
            cont  = elem.closest('.w3-modal-content'),
            H     = $(window).innerHeight(),
            t     = parseInt((H - cont.height()) / 2);

        modal.css("padding-top", Math.max(0, t)+"px");
      }
      // ---------------------------------------------------
      switch(action){
        case "open": // ************************************
          $('.hidden', elem).hide();
          elem.show();
          $(window).on("resize", resize);
          opts = $.extend( {}, $.fn.dialog.defaults, options);
          opts.element = $(opts.html);
          opts.prev    = $(this).prev();
          // content .......................................
          $('.w3-modal-content', opts.element)
          .css(opts.css)
          .drags({handle: 'header'});
          // label .........................................
          $('header span.title', opts.element)
          .html(opts.title)
          .addClass(opts.lang);
          // paging ........................................
          if(nPage > 1){
            $('header', opts.element).append(
              '<button title="Next page" data-key="Alt-PageDown" '+
                 'data-dc="PG_UP" '+
                 'class="PG_UP lang-title btn-narrow w3-bar-item '+
                    'w3-button w3-right">'+
                '<i class="fas fa-fw fa-step-forward"></i>'+
              '</button>'+
              '<button title="Previous page" data-key="Alt-PageUp" '+
                 'data-dc="PG_DN" '+
                 'class="PG_DN lang-title btn-narrow w3-bar-item '+
                    'w3-button w3-right">'+
                '<i class="fas fa-fw fa-step-backward"></i>'+
              '</button>'+
              '<span class="page-info text-truncate w3-bar-item '+
                'w3-right w3-hide-medium w3-hide-small" '+
                'style="max-width:10em"></span>'
            );
          }
          // buttons header ................................
          if(!$.isEmptyObject(opts.headerButtons)){
            var B = [];

            for(var b in opts.headerButtons){
              B.push(
                $(opts.headerButtons[b]).length ?
                opts.headerButtons[b] :
                '<button class="lang w3-bar-item w3-button w3-right"'+
                    ' data-dc="'+b+'">'+
                  opts.headerButtons[b]+
                '</button>'
              );
            }
            $('header', opts.element).append(B.join(""));
          }
          // buttons footer ................................
          if(!$.isEmptyObject(opts.buttons)){
            var B = [];

            for(var b in opts.buttons){
              if(opts.buttons[b] != "")
                B.push(
                  $(opts.buttons[b]).length ?
                  opts.buttons[b] :
                  '<button class="lang w3-bar-item w3-button w3-right"'+
                      ' data-dc="'+b+'">'+
                    opts.buttons[b]+
                  '</button>'
                );
            }
            $('footer', opts.element).html(B.join(""));
          }
          // insert html ...................................
          $('main',               opts.element).html(elem);
          $('.page:not(.hidden)', opts.element).hide();
          var title2 = $('.page:not(.hidden)', opts.element)
            .eq(0)
            .show()
            .end()
            .prop("title");

          $('header span.title2', opts.element)
          .html(title2 ? `&nbsp;-&nbsp;${title2}` : "");
          $('w3-modal', opts.element).addClass(opts.animate);
          // events ........................................
          $(opts.element)
          // ...............................................
          .on("click", 'input[type=range][data-dc],button[data-dc],.w3-button[data-dc],.w3-btn[data-dc],.w3-hoverable[data-dc]',
          function(ev){
            if($(this).hasClass("PG_UP")){ // ..............
              iPage = (iPage + 1) % nPage;
              $('.page:not(.hidden)', opts.element)
              .removeClass("w3-animate-left")
              .addClass("w3-animate-right")
              .hide();
              var title2 = $('.page:not(.hidden)', opts.element)
                .eq(iPage)
                .removeClass("w3-animate-left")
                .addClass("w3-animate-right")
                .show()
                .prop("title");

              $('header span.title2', opts.element)
              .html(title2 ? `&nbsp;-&nbsp;${title2}` : "");

              $('.page-info', opts.element)
              .text((iPage+1)+" / "+nPage)
              $('input,textarea,select', opts.element)
              .filter(':enabled:visible:not(.unselect)')
              .eq(0).select();
              $(elem).trigger("dialog:page", ["PG_UP", iPage]);
              return;
            }
            if($(this).hasClass("PG_DN")){ // ..............
              iPage = (nPage + iPage - 1) % nPage;
              $('.page:not(.hidden)', opts.element)
              .removeClass("w3-animate-right")
              .addClass("w3-animate-left")
              .hide();
              var title2 = $('.page:not(.hidden)', opts.element)
                .eq(iPage)
                .removeClass("w3-animate-right")
                .addClass("w3-animate-left")
                .show()
                .prop("title");

              $('header span.title2', opts.element)
              .html(title2 ? `&nbsp;-&nbsp;${title2}` : "");

              $('.page-info', opts.element)
              .text((iPage+1)+" / "+nPage)
              $('input,textarea,select', opts.element)
              .filter(':enabled:visible:not(.unselect)')
              .eq(0).select();
              $(elem).trigger("dialog:page", ["PG_DN", iPage]);
              return;
            }
            opts.iPage = iPage;
            var ret = opts.callBack ?
                      opts.callBack(ev, this) : 1;

            if($(this).hasClass("dialog-close") || ret){
              if(opts.cleanFun)
                opts.cleanFun();
              close();
            }
          })
          // ...............................................
          .on("change focusout keyup",
              '.dc-change[data-dc],.dc-focusout[data-dc],.dc-keyup[data-dc]', 
          function(ev){
            if(!$(this).hasClass("dc-"+ev.type))
              return;
            var ret = opts.callBack ?
                      opts.callBack(ev, this) : 1;

            return ret;
          });
          // translate, place and show element .............
          if(typeof oLang == "undefined")
            oLang = {vocabulary:{}};
          opts.element.i18n(oLang).appendTo('body').show();
          $('.page-info', opts.element)
          .text((iPage+1)+" / "+nPage)
          // save opts .....................................
          elem.data("dialog", opts.element);
          elem.data("opts",   opts);
          // default focus + select
          setTimeout(function(){
            $('input,textarea,select', opts.element)
            .filter(':enabled')
            .eq(0).focus();
            $('input,textarea,select', opts.element)
            .filter(':enabled:not(.unselect)')
            .eq(0).select();
          }, 500);
          move();
          break;
        case "close":  // **********************************
          if(opts.cleanFun)
            opts.cleanFun();
          close();
          break;
        case "ooptions": // *********************************
          return opts;
      }
    });
  };
  // #######################################################
  $.fn.dialog.defaults = {
    html:
      '<div class="w3-modal">'+
        '<div class="w3-modal-content w3-card-4 w3-theme-l5 w3-animate-zoom">'+
          '<header class="w3-container w3-bar w3-theme">'+
            '<span class="text-truncate w3-bar-item w3-left" '+
              'style="max-width:calc(100% - 120px);padding:8px">'+
              '<span class="title"></span>'+
              '<span class="title2"></span>'+
            '</span>'+
            '<button class="lang-title w3-button btn-narrow w3-bar-item '+
              'w3-right dialog-close" title="Close" data-dc="CLOSE">'+
              '<i class="fas fa-fw fa-times"></i>'+
            '</button>'+
          '</header>'+
          '<main></main>'+
          '<footer class="w3-container w3-theme">'+
            '<button data-key="Esc" data-dc="CLOSE" title="Close" '+
              'class="lang-title w3-bar-item w3-button w3-right">'+
              '<i class="fas fa-fw fa-times"></i>'+
              '<span class="lang w3-hide-small" '+
                'style="margin-left:0.5em">Close</span>'+
            '</button>'+
          '</footer>'+
        '</div>'+
      '</div>',
    animate: "w3-animate-opacity",
    title: "",
    lang: "lang",
    headerButtons: {},
    buttons: {},
    css: {
      "position": "relative",
      "top": 0,
      "width":"50%"
    }
  };
})(jQuery);
