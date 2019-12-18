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

    this.locale = $('html').attr('lang');
    this.$articleVotesContainer = $('.article-votes');
    this.$articleBody = $('#article-container').find('.article-body');
    this.$modalBoxTrigger = $('.modalTrigger');
    this.$modalBackdrop = $('.c_modal-backdrop');
    this.$modalClose = $('.c_modal-close');
    this.$productsContainer = $('.c_products');
    this.$supportContainer = $('.c_support');
    this.$heroHeaderContainer = $('.c_hero');
    this.$header = $('.c_header');
    this.$headerMenuTrigger = $('.c_header-menu');
    this.$headerCloseTrigger = $('.c_header-close');
    this.$headerNavigation = $('.c_header-navigation');
    this.$contactContainer = $('.c_contact');
    this.$footerContainer = $('.c_footer');
    this.$promotedArticleContainer = $('.c_promoted-articles');
    this.$sectionCategoryContainer = $('.c_section-category');
    this.$chatIcon = $('.c_chat-icon');
    this.$chatContainer = $('.c_chat');
    this.$chatOverlay = $('.c_chat-overlay');

    this.lastScrollTop = $(window).scrollTop();

    this._setProductsSection();
    this._setVideoResponsive();   
    this._setParalax(); 
    //this._fetchUserGuideArticles();
    //this._fetchCategories();
    //this._fetchGlobalArticles();
    this._equalHeightBoxes();
    this._initializeChat();
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

    //update support section height
    var supportContainerWidth = this.$supportContainer.find('.c_support-item').width();
    this.$supportContainer.find('.c_support-item').height(supportContainerWidth);

    //update the equal height boxes
    this._equalHeightBoxes();

  },

  _setProductsSection: function() {
    
    //set product section height
    var productContainerWidth = this.$productsContainer.find('.c_products-itemVisual').width();
    this.$productsContainer.find('.c_products-itemVisual').height(productContainerWidth);

    //update support section height
    var supportContainerWidth = this.$supportContainer.find('.c_support-item').width();
    this.$supportContainer.find('.c_support-item').height(supportContainerWidth);

  },

  _equalHeightBoxes: function() {

    var self = this;
    
    //remove the inline style so it can be set again on resize
    this.$contactContainer.find('.c_contact-item').removeAttr('style');
    this.$promotedArticleContainer.find('.c_promoted-articles-item').removeAttr('style');
    this.$sectionCategoryContainer.find('.c_section-category-item').removeAttr('style');

    //set the equal height for the contact blocks
    var contactHighestBox = 0; 
    this.$contactContainer.find('.c_contact-item').each(function(){        
      if($(this).height() > contactHighestBox) {
        contactHighestBox = $(this).height(); 
      } 
    });
    
    //set the highest height to the contact blocks    
    this.$contactContainer.find('.c_contact-item').height(contactHighestBox);

    //set the equal height for the promoted articles blocks
    var promotedHighestBox = 0; 
    this.$promotedArticleContainer.find('.c_promoted-articles-item').each(function(){        
      if($(this).height() > promotedHighestBox) {
        promotedHighestBox = $(this).height(); 
      } 
    });

    //set the highest height to the promoted articles blocks    
    this.$promotedArticleContainer.find('.c_promoted-articles-item').height(promotedHighestBox);

    //set the equal height for the section category blocks
    var sectionCategoryHighestBox = 0; 
    this.$sectionCategoryContainer.find('.c_section-category-item').each(function(){        
      if($(this).height() > sectionCategoryHighestBox) {
        sectionCategoryHighestBox = $(this).height(); 
      } 
    });

    //set the highest height to the section category blocks   
    this.$sectionCategoryContainer.find('.c_section-category-item').height(sectionCategoryHighestBox);

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

  _fetchUserGuideArticles: function() {

    var self = this; 

    this.userManualSections = [];
    this.userManualSectionArticles = [];
    
    $.ajax({
      url: "/api/v2/help_center/" + self.locale.toLowerCase() +"/categories/360002430331/sections.json",      
      success: function(data){
        console.log(data.sections);   
        $.each(data.sections, function(index, el) {          
          self.userManualSections.push(el.id);
        });
        console.log(self.userManualSections);  
        
        $.each(self.userManualSections, function(index, el) {
          $.ajax({
            url: "/api/v2/help_center/" + self.locale.toLowerCase() +"/sections/" + el + "/articles.json?per_page=60",      
            success: function(data){
              var sectionArticles = {
                "section": el,
                "articles" : data
              }
              self.userManualSectionArticles.push(sectionArticles);              
            }
          });
        });

        console.log(self.userManualSectionArticles);

      }
    });    
    
    /*$.ajax({
      url: "/api/v2/help_center/" + self.locale.toLowerCase() +"/sections/360007501511/articles.json?per_page=60",      
      success: function(data){
        console.log(data);        
      }
    });*/

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

  _initializeChat: function() {    

    const styleSet = window.WebChat.createStyleSet({
      backgroundColor: 'White',
      bubbleBackground: '#FAFAFA',
      bubbleBorderColor: '#E0E0E0',
      bubbleFromUserBackground: '#FAFAFA',
      bubbleFromUserBorderColor: '#E0E0E0',
      botAvatarInitials: 'BANG & OLUFSEN',
      userAvatarInitials: 'YOU'      
    });

    styleSet.textContent = {
      ...styleSet.textContent,
      fontFamily: "'Gotham A', 'Gotham B', Arial, Helvetica, sans-serif"         
    };

    const store = window.WebChat.createStore();

    window.WebChat.renderWebChat({
      directLine: window.WebChat.createDirectLine({
        token: 'Dp8DTK0tue4.Pg1NZ9B5a7ufSyCgAT7ryBVYLgbkbenHBpkDNDaZamk'
      }),
      store,
      styleSet
    }, this.$chatContainer.get(0));

    this.$chatContainer.find('> *').focus();

  },

  _displayWebChat: function() {
    this.$chatContainer.show();
    this.$chatOverlay.show();
    this.$chatIcon.hide();
  },

  _handleScroll: function() {    

    var scrollTop = $(window).scrollTop();

    if(scrollTop > this.lastScrollTop) {
      if(scrollTop > this.$header.outerHeight()) {
        this.$header.addClass('c_header--sticky');
      }      
    } else {
      this.$header.removeClass('c_header--sticky');
    }

    this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;

  },

  _bindEvents: function() {
    var self = this;  
    
    var debounceResize = self._debounce(function() {                
      self._handleResize();
    }, 50);

    var debounceScroll = self._debounce(function() {                
      self._handleScroll();
    }, 10);

    $(window).resize(debounceResize);
    $(window).scroll(debounceScroll);

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

    this.$productsContainer.find('.c_products-itemLink--disabled').on('click', function(e) {
      e.preventDefault();
      var modal = $(this).attr('data-modal');
      self.$modalBackdrop.show();
      $('#' + modal).fadeIn(500);  
    });

    this.$headerNavigation.find('.c_header-navigation--disabled').on('click', function(e) {
      e.preventDefault();
      var modal = $(this).attr('data-modal');
      self.$modalBackdrop.show();
      $('#' + modal).fadeIn(500);  
    });

    this.$footerContainer.find('.c_footer-link--disabled').on('click', function(e) {
      e.preventDefault();
      var modal = $(this).attr('data-modal');
      self.$modalBackdrop.show();
      $('#' + modal).fadeIn(500);  
    });

    this.$headerMenuTrigger.on('click', function(e) {
      e.preventDefault();
      $(this).addClass('c_header-menu--hidden');
      self.$headerCloseTrigger.addClass('c_header-close--visible');
      self.$headerNavigation.addClass('c_header-navigation--open');
    });

    this.$headerCloseTrigger.on('click', function(e) {
      e.preventDefault();
      self.$headerMenuTrigger.removeClass('c_header-menu--hidden');
      self.$headerCloseTrigger.removeClass('c_header-close--visible');
      self.$headerNavigation.removeClass('c_header-navigation--open');
    });

    //window load function
    $(window).load(function(){      
      self.$chatIcon.on('click', function() {
        self._displayWebChat();
      });
    });

  }
  
}

$(document).ready(function() {  
  //init the JS
  BO_JS.init();
  
});