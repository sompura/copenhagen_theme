document.addEventListener('DOMContentLoaded', function() {
  function closest (element, selector) {
    if (Element.prototype.closest) {
      return element.closest(selector);
    }
    do {
      if (Element.prototype.matches && element.matches(selector)
        || Element.prototype.msMatchesSelector && element.msMatchesSelector(selector)
        || Element.prototype.webkitMatchesSelector && element.webkitMatchesSelector(selector)) {
        return element;
      }
      element = element.parentElement || element.parentNode;
    } while (element !== null && element.nodeType === 1);
    return null;
  }

  // social share popups
  Array.prototype.forEach.call(document.querySelectorAll('.share a'), function(anchor) {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      window.open(this.href, '', 'height = 500, width = 500');
    });
  });

  // In some cases we should preserve focus after page reload
  function saveFocus() {
    var activeElementId = document.activeElement.getAttribute("id");
    sessionStorage.setItem('returnFocusTo', '#' + activeElementId);
  }
  var returnFocusTo = sessionStorage.getItem('returnFocusTo');
  if (returnFocusTo) {
    sessionStorage.removeItem('returnFocusTo');
    var returnFocusToEl = document.querySelector(returnFocusTo);
    returnFocusToEl && returnFocusToEl.focus && returnFocusToEl.focus();
  }

  // show form controls when the textarea receives focus or backbutton is used and value exists
  var commentContainerTextarea = document.querySelector('.comment-container textarea'),
    commentContainerFormControls = document.querySelector('.comment-form-controls, .comment-ccs');

  if (commentContainerTextarea) {
    commentContainerTextarea.addEventListener('focus', function focusCommentContainerTextarea() {
      commentContainerFormControls.style.display = 'block';
      commentContainerTextarea.removeEventListener('focus', focusCommentContainerTextarea);
    });

    if (commentContainerTextarea.value !== '') {
      commentContainerFormControls.style.display = 'block';
    }
  }

  // Expand Request comment form when Add to conversation is clicked
  var showRequestCommentContainerTrigger = document.querySelector('.request-container .comment-container .comment-show-container'),
    requestCommentFields = document.querySelectorAll('.request-container .comment-container .comment-fields'),
    requestCommentSubmit = document.querySelector('.request-container .comment-container .request-submit-comment');

  if (showRequestCommentContainerTrigger) {
    showRequestCommentContainerTrigger.addEventListener('click', function() {
      showRequestCommentContainerTrigger.style.display = 'none';
      Array.prototype.forEach.call(requestCommentFields, function(e) { e.style.display = 'block'; });
      requestCommentSubmit.style.display = 'inline-block';

      if (commentContainerTextarea) {
        commentContainerTextarea.focus();
      }
    });
  }

  // Mark as solved button
  var requestMarkAsSolvedButton = document.querySelector('.request-container .mark-as-solved:not([data-disabled])'),
    requestMarkAsSolvedCheckbox = document.querySelector('.request-container .comment-container input[type=checkbox]'),
    requestCommentSubmitButton = document.querySelector('.request-container .comment-container input[type=submit]');

  if (requestMarkAsSolvedButton) {
    requestMarkAsSolvedButton.addEventListener('click', function () {
      requestMarkAsSolvedCheckbox.setAttribute('checked', true);
      requestCommentSubmitButton.disabled = true;
      this.setAttribute('data-disabled', true);
      // Element.closest is not supported in IE11
      closest(this, 'form').submit();
    });
  }

  // Change Mark as solved text according to whether comment is filled
  var requestCommentTextarea = document.querySelector('.request-container .comment-container textarea');

  if (requestCommentTextarea) {
    requestCommentTextarea.addEventListener('input', function() {
      if (requestCommentTextarea.value === '') {
        if (requestMarkAsSolvedButton) {
          requestMarkAsSolvedButton.innerText = requestMarkAsSolvedButton.getAttribute('data-solve-translation');
        }
        requestCommentSubmitButton.disabled = true;
      } else {
        if (requestMarkAsSolvedButton) {
          requestMarkAsSolvedButton.innerText = requestMarkAsSolvedButton.getAttribute('data-solve-and-submit-translation');
        }
        requestCommentSubmitButton.disabled = false;
      }
    });
  }

  // Disable submit button if textarea is empty
  if (requestCommentTextarea && requestCommentTextarea.value === '') {
    requestCommentSubmitButton.disabled = true;
  }

  // Submit requests filter form on status or organization change in the request list page
  Array.prototype.forEach.call(document.querySelectorAll('#request-status-select, #request-organization-select'), function(el) {
    el.addEventListener('change', function(e) {
      e.stopPropagation();
      saveFocus();
      closest(this, 'form').submit();
    });
  });

  // Submit requests filter form on search in the request list page
  var quickSearch = document.querySelector('#quick-search');
  quickSearch && quickSearch.addEventListener('keyup', function(e) {
    if (e.keyCode === 13) { // Enter key
      e.stopPropagation();
      saveFocus();
      closest(this, 'form').submit();
    }
  });

  function toggleNavigation(toggle, menu) {
    var isExpanded = menu.getAttribute('aria-expanded') === 'true';
    menu.setAttribute('aria-expanded', !isExpanded);
    toggle.setAttribute('aria-expanded', !isExpanded);
  }

  function closeNavigation(toggle, menu) {
    menu.setAttribute('aria-expanded', false);
    toggle.setAttribute('aria-expanded', false);
    toggle.focus();
  }

  /*var burgerMenu = document.querySelector('.header .menu-button');
  var userMenu = document.querySelector('#user-nav');

  burgerMenu.addEventListener('click', function(e) {
    e.stopPropagation();
    toggleNavigation(this, userMenu);
  });


  userMenu.addEventListener('keyup', function(e) {
    if (e.keyCode === 27) { // Escape key
      e.stopPropagation();
      closeNavigation(burgerMenu, this);
    }
  });

  if (userMenu.children.length === 0) {
    burgerMenu.style.display = 'none';
  }*/

  // Toggles expanded aria to collapsible elements
  var collapsible = document.querySelectorAll('.collapsible-nav, .collapsible-sidebar');

  Array.prototype.forEach.call(collapsible, function(el) {
    var toggle = el.querySelector('.collapsible-nav-toggle, .collapsible-sidebar-toggle');

    el.addEventListener('click', function(e) {
      toggleNavigation(toggle, this);
    });

    el.addEventListener('keyup', function(e) {
      if (e.keyCode === 27) { // Escape key
        closeNavigation(toggle, this);
      }
    });
  });

  // Submit organization form in the request page
  var requestOrganisationSelect = document.querySelector('#request-organization select');

  if (requestOrganisationSelect) {
    requestOrganisationSelect.addEventListener('change', function() {
      closest(this, 'form').submit();
    });
  }

  // If a section has more than 6 subsections, we collapse the list, and show a trigger to display them all
  const seeAllTrigger = document.querySelector("#see-all-sections-trigger");
  const subsectionsList = document.querySelector(".section-list");

  if (subsectionsList && subsectionsList.children.length > 6) {
    seeAllTrigger.setAttribute("aria-hidden", false);

    seeAllTrigger.addEventListener("click", function(e) {
      subsectionsList.classList.remove("section-list--collapsed");
      seeAllTrigger.parentNode.removeChild(seeAllTrigger);
    });
  }

  // If multibrand search has more than 5 help centers or categories collapse the list
  const multibrandFilterLists = document.querySelectorAll(".multibrand-filter-list");
  Array.prototype.forEach.call(multibrandFilterLists, function(filter) {
    if (filter.children.length > 6) {
      // Display the show more button
      var trigger = filter.querySelector(".see-all-filters");
      trigger.setAttribute("aria-hidden", false);

      // Add event handler for click
      trigger.addEventListener("click", function(e) {
        e.stopPropagation();
        trigger.parentNode.removeChild(trigger);
        filter.classList.remove("multibrand-filter-list--collapsed")
      })
    }
  });
});

var BO_JS = {

  init: function(){
    
    console.log('BO_JS initiated');

    this.globalSettings = window.BO_settings;

    this.locale = $('html').attr('lang');
    this.$articleVotesContainer = $('.article-votes');
    this.$articleBody = $('#article-container').find('.article-body');
    this.$modalBoxTrigger = $('.modalTrigger');
    this.$modalBackdrop = $('.c_modal-backdrop');
    this.$modalClose = $('.c_modal-close');
    this.$productsContainer = $('.c_products');
    this.$heroHeaderContainer = $('.c_hero');

    this._setProductsSection();
    this._setVideoResponsive();   
    this._setParalax(); 
    //this._fetchCategories();
    //this._fetchGlobalArticles();
    this._bindEvents();

  },

  _debounce: function(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
  },

  _handleResize: function() {    
    
    //update product section height
    var productContainerWidth = this.$productsContainer.find('.c_products-itemVisual').width();
    this.$productsContainer.find('.c_products-itemVisual').height(productContainerWidth);

  },

  _setProductsSection: function() {
    
    //set product section height
    var productContainerWidth = this.$productsContainer.find('.c_products-itemVisual').width();
    this.$productsContainer.find('.c_products-itemVisual').height(productContainerWidth);

    //replace placeholder image
    var productImages = this.$productsContainer.find('.c_products-itemVisual > img');    
    productImages.each(function(index, image) {                  
      var visualDynamicImage = "{{asset '" + $(image).attr("data-image") + ".png'}}";        
      var visualImage = $(image).attr("src").substring(0, $(image).attr("src").lastIndexOf("/")+1) + $(image).attr("data-image") + ".png";
      //$(image).attr("src", visualDynamicImage);
    }.bind(this));

    //replace hero header image
    var heroHeaderImages = this.$heroHeaderContainer.find('.c_hero-visual > img');    
    heroHeaderImages.each(function(index, image) {            
      var visualDynamicImage = "{{asset '" + $(image).attr("data-image") + ".png'}}";        
      var visualImage = $(image).attr("src").substring(0, $(image).attr("src").lastIndexOf("/")+1) + $(image).attr("data-image") + ".jpg";
      //$(image).attr("src", visualDynamicImage);
    }.bind(this));

  },

  _setParalax: function() {

  // I know that the code could be better.
  // If you have some tips or improvement, please let me know.

  $('.c_paralax-image').each(function(){
    var img = $(this);
    var imgParent = $(this).parent();
    
    function parallaxImg () {
      var speed = img.data('speed');
      var imgY = imgParent.offset().top;
      var winY = $(this).scrollTop();
      var winH = $(this).height();
      var parentH = imgParent.innerHeight();

      // The next pixel to show on screen      
      var winBottom = winY + winH;

      // If block is shown on screen
      if (winBottom > imgY && winY < imgY + parentH) {
        // Number of pixels shown after block appear
        var imgBottom = ((winBottom - imgY) * speed);
        // Max number of pixels until block disappear
        var imgTop = winH + parentH;
        // Porcentage between start showing until disappearing
        var imgPercent = ((imgBottom / imgTop) * 100) + (50 - (speed * 50));
      }

      img.css({
        top: imgPercent + '%',
        transform: 'translate(-50%, -' + imgPercent + '%)'
      });
    }

    $(document).on({
      scroll: function () {
        parallaxImg();
      }, ready: function () {
        parallaxImg();
      }
    });

  });

  },

  _fetchGlobalArticles: function() {

    var self = this;   

    var customArticleTemplate = $('#custom-template').html().replace(/\[/g, '{').replace(/]/g, '}');
    var theTemplate = Handlebars.compile(customArticleTemplate);     

    $.ajax({
      url: "/api/v2/help_center/" + self.locale.toLowerCase() +"/categories/360002291372/articles.json",      
      success: function(data){
        console.log(data);
        $.each(data.articles, function(index, el) {
          if(el.id == self.globalSettings.customize_article_id) {            
            var compileTemplate = theTemplate(el);             
            $('.custom-article-template').html(compileTemplate)
          }
        });
      }
    });

  },

  _fetchCategories: function() {

    var self = this;        

    $.ajax({
      url: "/api/v2/help_center/" + self.locale.toLowerCase() +"/categories.json",      
      success: function(data){
        console.log(data);
      }
    });

  },
  
  _setVideoResponsive: function() {

    if($("#article-container .article-body iframe[src*='www.youtube-nocookie.com']").length > 0) {
      // Find all YouTube videos
      var $allVideos = this.$articleBody.find("iframe[src*='www.youtube-nocookie.com']");
  
      // Adding wrapper and styles to enable responsive behavior
      $allVideos.each(function() {
        var $el = $(this);
  
        $el.wrap('<div class="videoWrapper">');
  
        $(this).css({
          'position': 'absolute',
          'top': '0',
          'left': '0',
          'width': '100%',
          'height': '100%'
        })
  
        $(this).parent().css({
          'position' : 'relative',
          'padding-bottom' : '56.25%',
          'padding-top' : '25px',
          'height' : '0',
          'margin-bottom' : '15px'
        });
      });
    } 

  },

  _bindEvents: function() {
    var self = this;  
    
    var debounceResize = self._debounce(function() {                
      self._handleResize();
    }, 50);

    $(window).resize(debounceResize);

    this.$modalBoxTrigger.on('click', function(e) {
      e.preventDefault();
      var modal = $(this).attr('data-modal');
      self.$modalBackdrop.show();
      $('#' + modal).fadeIn(500);      
    });

    this.$modalBackdrop.on('click', function(e) {
      $(this).hide();
      $('.c_modal').fadeOut(300);
    });

    this.$modalClose.on('click', function() {
      self.$modalBackdrop.hide();
      $('.c_modal').fadeOut(300);
    });

  }
  
}

$(document).ready(function() {  
  //init the JS
  BO_JS.init();
  
});