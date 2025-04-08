var bRemoveVidVast = false;
if(__tnt?.ads?.dfp?.af || (window.Osano?.cm && window.Osano.cm?.getConsent().MARKETING != 'ACCEPT')) bRemoveVidVast = true;

function throttleFunction(func, wait){
    var timeout;
    return function(){
        var context = this, args = arguments;
        var later = function(){
            timeout = null;
            func.apply(context, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    }
}

function lee_trkLinkSrc(o, src){
    var src = 'tracking-source='+src;
    $(o).find('a').each(function(){
        var bAlert = false;
        var sHref = this.href;
        var sOg = $(this).attr('href');
        var sClass = $(this).attr('class');
        if( __tnt?.ads?.dfp?.af && sClass && sClass.match('nav-link')){
            if(sClass.match('-obit') || 
                sClass.match('tnt-section-share-a-story') ||
                sClass.match('tnt-section-jobs') ||
                sClass.match('tnt-section-cars') ||
                sClass.match('tnt-section-homes')
            ){
                bAlert = 'You are about to leave this site. Third-party websites may show advertisements.';
            } else if(sClass.match('tnt-section-marketplace') || sClass.match('tnt-section-buy-sell')){
                bAlert = 'You have elected to view classified advertising on Marketplace, and are about to leave our ad-free site.\n\nClicking on any of the links on Marketplace may take you to third-party websites that show advertisements.';
            } else if(sClass.match('tnt-section-brand-ave-studios')){
                bAlert = 'You have elected to view sponsored content provided by our partner, Brand Ave. Studios, and are about to leave our ad-free site.';
            }
        }
        
        if(bAlert){
            $(this).on('click', function(e){
              if (!window.confirm(bAlert)) {
                  e.preventDefault();
                    return false;
                }
            });
        }

        if (!sHref.match(/[#&]tracking-source/) && sHref != '' && sHref != '#' && sOg.charAt(0) == '/') {
            sHref += ((sHref.indexOf('#') > -1) ? '&' : '#') + src;
            $(this).attr('href', sHref);
        }
    });
}

function resizeIframe(iframe) {
    iframe.height = iframe.contentWindow.document.body.scrollHeight + 'px';
}

function randomizeChildren(id,limit,display='block'){
    var oRec = document.getElementById(id);
    var iLimit = 0;
    for (var i = oRec.children.length; i >= 0; i--) {
        iLimit++;
        oRec.appendChild(oRec.children[Math.random() * i | 0]).style.display=display;
        if(iLimit === limit) break;
    }
}

function getUserToken(){
    const sJWT = Cookies.get('tncms-user');
    if(sJWT){
        const sBase64URL = sJWT.split('.')[1];
        const sBase64 = sBase64URL.replace(/-/g, '+').replace(/_/g, '/');
        const sJSON = decodeURIComponent(atob(sBase64).split('').map(function(sChar){
            return '%' + ('00' + sChar.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(sJSON);
    }
    return false;
}

if(window.sessionStorage && __tnt.user.loggedIn){
    var sUserUUID = window.sessionStorage.getItem('lee_uuid');
    if(!sUserUUID){
        var sUserUUID = getUserToken();
        window.sessionStorage.setItem('lee_uuid', sUserUUID.sub);
    }
}

jQuery(document).ready(function($){
    if(__tnt?.ads?.dfp?.af){
        $('body').addClass('has-af');
        $('.hide-af').hide();
        $('.show-af').show();       
    } else {
        $('.hide-af').show();
        $('.show-af').hide();  
    }
    
    if(bRemoveVidVast){
        if(__tnt?.video?.vastUrl) __tnt.video.vastUrl = '';
        $(document).find('[data-vast-url]').each(function(){
            $(this).removeAttr('data-vast-url');
        });
    }
    
    if(__tnt.user.loggedIn){
        if(__tnt.user.avatar){
            $('.lee-user-avatar').attr('src', __tnt.user.avatar);
        }
    }
    
    if(__tnt.user.services){
        $('body').addClass('has-service');
        $('body').removeClass('no-service');
        var lee_sub_label = Cookies.get('leefalcon_membership');
        if(lee_sub_label){
            lee_sub_label = lee_sub_label.toLowerCase()
            switch(lee_sub_label){
                case 'dob': 
                    var lee_sub_level = 'Digital Basic';
                break;
                case 'dop': 
                    var lee_sub_level = 'Digital Plus';
                break;
                case 'silv': 
                    var lee_sub_level = 'Silver';
                break;
                case 'gold': 
                    var lee_sub_level = 'Gold';
                break;
                case 'plat': 
                    var lee_sub_level = 'Platinum';
                break; 
            }
            $('.lee-membership-container').addClass('has-membership '+lee_sub_label)
            $('.lee-membership-package').addClass(lee_sub_label).text(lee_sub_level);
        }
        
    } else {
        $('body').addClass('no-service');
        $('body').removeClass('has-service');
    }
                                
    $('[data-toggle=offcanvas_lee]').on(__tnt.client.clickEvent, function(){
        $('html').toggleClass('drawer-open active-left');
        $('.offcanvas-drawer-left').attr('aria-expanded', 'true');
        $(this).attr('aria-expanded', 'true');
        setTimeout(function(){ $('.offcanvas-drawer-left').focus(), 300});
        return false;
    });

    $('.offcanvas-close-btn').on(__tnt.client.clickEvent, function(){
        $('html').removeClass('drawer-open active-left active-right');
        $('.offcanvas-drawer-left').attr('aria-expanded', 'false');
        $('#lee-main-menu-btn').attr('aria-expanded', 'false');
        return false;
    });

    $('.site-search-full-mobile button[type="submit"]').on(__tnt.client.clickEvent, function(){
        $('.site-search-full-mobile form').submit();
        return false;
    });
    
    $('#mobile-search').on('show.bs.modal', function(e){
        $('body').addClass('mobile-search');
        setTimeout(function (){
            $('#mobile-search-q').focus();
        }, 100);
    });
    $('#mobile-search').on('hidden.bs.modal', function(e){
        $('body').removeClass('mobile-search');
    });
    
    if( $('#main-navigation').length > 0 && $('#site-navbar-container').hasClass('sticky') ){
        const body = document.body;
        const nav = document.getElementById('site-navbar-container');
        const content = document.getElementById('main-body-container');
        const height = $('#site-navbar-container').height();
        const navHeight = $('#main-navigation').height();
        const scrollUp = 'scroll-up';
        const scrollDown = 'scroll-down';
        let lastScroll = 0;
        let hasScrolled = false;
        
        window.addEventListener('scroll', function(){
            if( !hasScrolled ){
                hasScrolled = true;
                setTimeout(function(){
                    const currentScroll = window.pageYOffset;
                    const offset = ($(content).offset().top - height);
                    if (currentScroll <= 0 || currentScroll <= offset) {
                        body.classList.remove(scrollUp);
                        content.style.paddingTop = 0;
                        hasScrolled = false;
                        return;
                    }
                    if (currentScroll >= offset) {
                        if(window.innerWidth > 992) content.style.paddingTop = navHeight + 'px';
                        if (currentScroll > lastScroll && !body.classList.contains(scrollDown)) {
                            body.classList.remove(scrollUp);
                            body.classList.add(scrollDown);
                        } else if (currentScroll < lastScroll && body.classList.contains(scrollDown)) {
                            body.classList.remove(scrollDown);
                            body.classList.add(scrollUp); 
                        }
                        lastScroll = currentScroll;
                    }
                    hasScrolled = false;
                }, 5);
            }
        });
    }
    
    var oAmazonUrls = $("a[href*='amazon.com']");
    if( oAmazonUrls.length > 0 ){
        var sTrkId = 'tracking_id=leeenter0889-20';
        $(oAmazonUrls).each(function(i,e){
            var sHref = this.href;
            if ( !sHref.match(/[?&]tracking_id/) ) {
                sHref += ((sHref.indexOf('?') > -1) ? '&' : '?') + sTrkId;
                $(this).attr('href',sHref).attr('target','_blank');
            }
        });
    }

    var sTrackingPattern = 'lee-track-';
    var oTrackBlocks = $('div[class*="'+sTrackingPattern+'"]');
    var sTrackVal;
    
    if( oTrackBlocks.length > 0 ){
        $(oTrackBlocks).each(function(){
            var sTrackClass = $(this)[0].classList;
            $(sTrackClass).each(function(i,c){
                if( c.match(sTrackingPattern) ){
                    sTrackVal = c.replace(sTrackingPattern, '');
                    return false;
                }
            });
            lee_trkLinkSrc(this, sTrackVal);
        });
    }
    lee_trkLinkSrc('#main-nav_menu', 'main-nav');
    lee_trkLinkSrc('#mobile-nav-left_menu,#mobile-nav-left-below_menu', 'menu-nav');
    lee_trkLinkSrc('#footer-col-one-nav_menu,#footer-col-two-nav_menu,#footer-col-three-nav_menu', 'footer-nav');
    
    const sPlayerEl = '#lee-sticky-player-container';
    if( $(sPlayerEl).length > 0 && $(sPlayerEl).data('subtype') == 'field59' ){
        var stickyVideoClosed = false;
        var stickyVideoPlayer = throttleFunction(function(){
            if(stickyVideoClosed) return;
            $(sPlayerEl).css('min-height', $(sPlayerEl).height());
            if(__tnt.elementOnScreen(sPlayerEl)){
                $(sPlayerEl).removeClass('stuck');
            } else {
                const oVid = $(sPlayerEl).find('video').get(0);
                if (!oVid.paused || $(sPlayerEl).find('.vjs-has-started').length > 0 ) {
                    $(sPlayerEl).addClass('stuck');
                }
            }
        }, 50);
        window.addEventListener('scroll', stickyVideoPlayer);

        $('#lee-sticky-player-container .close-sticky-vid').on('click', function(){
            stickyVideoClosed = true;
            $(sPlayerEl).removeClass('stuck');
        });
    }
    
    if(window.assetUUID){
        try { 
            const sMparticleKey = 'mparticle.recent';
            let oRecentData = [];
            if( typeof localStorage === 'undefined' ) throw 'Local storage not available.';
            if( !window.localStorage.getItem(sMparticleKey) ){
                window.localStorage.setItem(sMparticleKey, JSON.stringify(oRecentData));
            }
            oRecentData = JSON.parse(window.localStorage.getItem(sMparticleKey));
            if($.inArray(window.assetUUID, oRecentData) === -1){
                if( oRecentData.length >= 10 ) oRecentData.shift();
                oRecentData.push(window.assetUUID);
                window.localStorage.setItem(sMparticleKey, JSON.stringify(oRecentData));
            }
            //__tnt.log(oRecentData);
            
        } catch(e){
            __tnt.log(e);
        }
    }
});