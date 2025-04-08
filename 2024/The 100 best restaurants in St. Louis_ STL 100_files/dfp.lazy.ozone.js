var __tnt = window.__tnt || {};
    __tnt.ads = window.__tnt.ads || {};
    __tnt.ads.dfp = window.__tnt.ads.dfp || {};

var googletag = window.googletag || {};
    googletag.cmd = window.googletag.cmd || [];

;(function($, g, dfp){
    'use strict';

    var selector = '.dfp-ad',
        timer = 150,
        count = 0,
        hidden = 0,
        visible = 0;
    
    var is_mobile = ($(window).width() > 992) ? false : true;
    var tolerence = (is_mobile) ? 300 : 200;
    
    var use_aps = ('APS_dfp_ads' in window);
    var use_pbjs = ('PBJS_dfp_ads' in window);
    var has_floor = (dfp.floor && typeof dfp.floor === 'object') ? true : false;
    var user_sync = false;
    
    function log(e,l,s){
        if( /[?&]dfp_log/.test(window.location.search) && window.console ){ 
            $(e).each(function(i,m){
                if( l === 'error' ) {
                    window.console.error(m);
                } else if( l === 'warning' ) {
                    window.console.warn(m);
                } else {
                    if( s === 'y') {
                        s = 'color: #ceb34f;'
                    } else if (s === 'g'){
                        s = 'color: #7ba761;';
                    } else if (s === 'b'){
                        s = 'color: #619da7;'; 
                    } else if (s === 'r'){
                        s = 'color: #d45e5e;';
                    } else if (s === 'm'){
                        s = 'color: #888;';
                    } else {
                        s = 'color: #ccc;';
                    }
                    s = s+'background-color: #222;';
                    window.console.log('%cLEE DFP%c'+m, 'color:#fff; line-height: 18px; background-color: #22526e; margin-right: 10px; padding: 0 6px; font-size: 10px; border-radius: 3px;', s);
                }
            });
        }
    }
    
    if( __tnt.ads.dfp.refresh ){
        log(['Refreshable units enabled.'],'','y');
    }
    

    log(['Tolerance set to: '+tolerence],'','y');
    
    if(__tnt.ads.dfp.ppid){
        var user_sync = {
            name: 'sharedId',
            value: {
                'pubcid': __tnt.ads.dfp.ppid
            }
        }
        log(['Using UserStitch profile ID'],'','y');
    }
    
    if(!user_sync){
        var user_sync = {
            name: 'sharedId',
            storage: {
                type: 'cookie',
                name: '_pubcid', 
                expires: 365 
           }
        }
        log(['Using LMC profile ID'],'','y');
    }
    
    if(use_pbjs){
        pbjs.que.push(function(){
            pbjs.setConfig({
                userSync: {
                    ppid: 'pubcid.org',
                    userIds: [user_sync],
                    filterSettings: {
                        iframe: {
                            bidders: '*',
                            filter: 'include',
                            iframeEnabled: true
                        }
                    }
                },
                auctionOptions: {
                    suppressStaleRender: true
                },
                ozone: {
                    enhancedAdserverTargeting: false
                },
                priceGranularity: {
                    'buckets' : [{
                        'precision': 2,
                        'max' : 3,
                        'increment' : 0.01
                    },{
                        'max' : 9,
                        'increment' : 0.05
                    },{
                        'max' : 20,
                        'increment' : 0.5
                    },{
                        'max' : 40,
                        'increment' : 1.00
                    },{
                        'max' : 50,
                        'increment' : 5.00
                    }]
                }
            });
        });
    }

    function readSlot(ad){     
        try {
            var adSlot = {'rendered':false, 'visible':false, 'lazy':false, 'debounce':false};
            if( !ad.id ){
                throw ['No id on the dfp-ad div:', $(ad)[0].outerHTML];
            }
            adSlot.id = ad.id;
            adSlot.adunit = $(ad).data('dfp-adunit');
            if( __tnt.ads.dfp.refresh ){
                adSlot.refresh = false;
            }
            adSlot.density = 'standard';
            if( __tnt.ads.dfp.ppid ){
                adSlot.density = 'light';
            }
            if( !adSlot.adunit ){
                throw ['No usable adunit found for '+ad.id+'.', $(ad)[0].outerHTML];
            } 
            adSlot.size = $(ad).data('dfp-size');
            if( typeof adSlot.size != 'object' && adSlot.size != 'fluid' ){
                throw ['data-dfp-size needs to ba a valid JSON array or fluid for position '+ad.id+'.', $(ad)[0].outerHTML];
            }
            adSlot.pos = $(ad).data('dfp-custom-pos');
            if( !adSlot.pos ){
                log(['Unable to set pos for '+ad.id+'.', $(ad)[0].outerHTML], 'warning');
            } else {
                adSlot.pos = $.trim(adSlot.pos).split(/\s*,\s*/);
            }
            if( $(ad).data('lazy') ){
                adSlot.lazy = 'true';
            }
            return adSlot;
        } catch(e){
            log(e, 'error');
            return false;
        } 
    }

    function setLoadableAds(){
        $(selector).each(function(){
            count++;
            if( $(this).is(':visible') || $(this).data('dfp-responsive') === 'no' ){
                visible++;
                var slot = readSlot(this);
                if( slot ){
                    dfp.slots[slot.id] = slot;
                } else {
                    visible--;
                }
            } else {
                hidden++;
            }
        });

        dfp.count = count,
        dfp.visible = visible,
        dfp.hidden = hidden;
    }

    function elOnScreen(el){
        var tolerence = 500;
        var el = $('#'+el)[0];
        var rect = el.getBoundingClientRect();
        return rect.bottom > 0 && (rect.top - tolerence) < (window.innerHeight || document.documentElement.clientHeight);
    }

    function adOnScreen(el){
        var adDiv = $('#'+el);
        if( adDiv.hasClass('dfp-unit-requested') || adDiv.data('google-query-id') ){ 
            log([adDiv.attr('id')+' already loaded.'],'','m');
            return false; 
        }
        if( !adDiv.data('lazy') ) { 
            log([adDiv.attr('id')+' not lazy loaded.'],'','m');
            return true;
        }
        return elOnScreen(el);
    }

    function checkVisible(){
        $.each(dfp.slots, function(i, ad){
            if( adOnScreen(ad.id) ){
                log([ad.id+' is now visible.']);
                loadAdUnit(ad.id);
            } else {
                if( __tnt.ads.dfp.refresh && dfp.slots[ad.id].refresh === true && elOnScreen(ad.id) ){
                    log(['Refreshing unit: '+ad.id],'','r');
                    refreshAdUnit(ad.id);
                }
            }
        });
    }

    function randomGroup(){
        return Math.floor(Math.random() * 10) + 1;
    }

    function setFloor(pos){
        var fp = false;
        if(dfp.floor[pos]){
            $.each(dfp.floor[pos], function(type, test){
                log(['Checking floor for slot: '+pos],'','m');
                switch(type){
                    case 'os':
                        $.each(test, function(k, v){
                            if(__tnt.client.platform[k]){
                                log(['* Matched os: '+k],'','b');
                                fp = v;
                            }
                        });
                    break;
                    case 'browser':
                        $.each(test, function(k, v){
                            if( k === __tnt.client.browser.name.toLowerCase()){
                                log(['* Matched browser: '+k],'','b');
                                fp = v;
                            }
                        });
                    break;
                }
                if(fp) return false;
            });
        }
        if(!fp && dfp.floor[pos] && typeof dfp.floor[pos].base != 'undefined'){
            log(['* Matched base price for: '+pos],'','b');
            fp = dfp.floor[pos].base;
        }
        return fp;
    }

    function defineAdUnits(){
        if( dfp.visible > 0 ){
            g.cmd.push(function(){
                $.each(dfp.slots, function(i, ad){
                    var unit = dfp.slots[ad.id];
                    unit.dfp_slot = g.defineSlot(ad.adunit, ad.size, ad.id).addService(g.pubads());
                    if( ad.pos ){
                        unit.dfp_slot.setTargeting('pos', ad.pos);
                    }
                    if( !ad.lazy ) { 
                        unit.dfp_slot.setTargeting('inview', 'true');
                    }
                    if( ad.density ) { 
                        unit.dfp_slot.setTargeting('density', ad.density);
                    }
                    unit.dfp_slot.setTargeting('lee_group', randomGroup());
                    unit.dfp_slot.setTargeting('lee_hours', (new Date).getUTCHours());
                    unit.dfp_slot.setTargeting('lee_day', (new Date).getDay());
                    if(has_floor && unit.pos){
                        var fp = setFloor(unit.pos[0]);
                        if(!fp) fp = setFloor('any');
                        if(fp){
                            unit.dfp_slot.setTargeting('fp', fp);
                            log(['  - Setting Floor on unit: '+unit.pos[0]+', with value of: '+fp],'','r');
                        }

                    }
                });

                if( dfp.targeting ){
                    $.each(dfp.targeting, function(k, v){
                        g.pubads().setTargeting(k, v);
                    });
                }
                
                if(__tnt.ads.dfp.ppid){
                    g.pubads().setPublisherProvidedId(__tnt.ads.dfp.ppid);
                    log(['Setting UserStitch PID: '+__tnt.ads.dfp.ppid],'','y');
               }
                
                g.pubads().disableInitialLoad();
                //g.pubads().enableSingleRequest();
                //g.pubads().collapseEmptyDivs();
                g.enableServices();
            });

            g.cmd.push(function(){
                $.each(dfp.slots, function(i, ad){
                    googletag.display(ad.id);
                });

                g.pubads().addEventListener('slotRenderEnded', function(event){
                    var id = event.slot.getSlotElementId();
                    if(dfp.slots[id]){
                        dfp.slots[id].debounce = false;
                        $('#'+id).addClass('dfp-unit-requested');
                        if( !event.isEmpty ){         
                            log(['Load unit: '+ id],'','r');
                            dfp.slots[id].rendered = {
                                'size':event.size,
                                'empty':event.isEmpty,
                                'creative':event.creativeId,
                                'line_item':event.lineItemId
                            };
                            if(event.size[0] > 1){
                                $('#'+id).css('min-height', event.size[1]).css('min-width', event.size[0]);
                            }
                            $('#'+id).addClass('dfp-rendered').addClass('dfp-creative-'+event.creativeId).addClass('dfp-line-item-'+event.lineItemId);
                        } else {
                            log(['No creative: '+ id],'','r');
                            $('#'+id).css('min-height', 1).css('min-width', 1);
                        }
                    }
                });
            }); 
        }
    }

    function biddableAdUnbit(id){
        var pos = dfp.slots[id].pos;
        if( !pos || 
            pos[0].match(/impact/) || 
            pos[0].match(/native/) || 
            pos[0].match(/article_links/) ||
            pos[0].match(/fixed-big-ad-search/)
        ){
            return false;
        }
        return true;
    }

    function refreshAdId(id){
        g.pubads().refresh([dfp.slots[id].dfp_slot]);
    }

    function pushApsBid(id){
        var aps_size = dfp.slots[id].size;
        if( !$.isArray(aps_size[0]) ){
            aps_size = [aps_size];
        }
        window.APS_dfp_ads[id] = {
            slotID: id,
            slotName: dfp.slots[id].adunit,
            sizes: aps_size
        };
        window.apstag.fetchBids({
            slots: [window.APS_dfp_ads[id]], 
            timeout: 2e3
        }, function(bids){
            window.apstag.setDisplayBids();
            if(use_pbjs){
                pushPbjsBid(id);
            } else {
                refreshAdId(id);
            }
            log(['APS bid: '+id],'','y');
        });
    }
    
    function pushPbjsBid(id){
        if( id && window.PBJS_config[id] ){
            if( !window.PBJS_dfp_ads[id] ){
                var pwt_size = dfp.slots[id].size;
                if( !$.isArray(pwt_size[0]) ){
                    pwt_size = [pwt_size];
                }
                
                var gpid = dfp.slots[id].adunit+'#'+id;
                var type = (__tnt.ads.dfp.targeting.page[0] != 'asset') ? __tnt.ads.dfp.targeting.page[0] : 'article';

                window.PBJS_dfp_ads[id] = {
                    'bids': [{
                        'bidder': 'ozone',
                        'params': {
                            'siteId': window.PBJS_site,
                            'publisherId': 'NPID10000001',
                            'placementId': window.PBJS_config[id],
                            'customData': [{
                                'settings': {}, 
                                'targeting': {
                                    'page': __tnt.ads.dfp.targeting.page,
                                    'page_type': type,
                                    'keywords': __tnt.ads.dfp.targeting.k
                                }
                            }]
                        }
                    }],
                    'code': id,
                    'ortb2Imp': {
                        'ext': {
                            'gpid': gpid,
                            'data': {
                                'pbadslot': gpid
                            }
                        }
                    },
                    'mediaTypes': {
                        'banner': {
                            'sizes': pwt_size
                        }
                    }
                };

                pbjs.que.push(function(){
                    pbjs.addAdUnits(window.PBJS_dfp_ads[id]);
                });
            }

            pbjs.que.push(function(){
                pbjs.requestBids({
                    timeout: 1000,
                    adUnitCodes: [id],
                    bidsBackHandler: function(){
                        pbjs.setTargetingForGPTAsync([id]);
                        refreshAdId(id);
                        log(['PBJS bid: '+id],'','y');
                    }
                });
            });
        } else {
            refreshAdId(id);
            log(['PBJS config not defined for '+id+'. Skipping.'],'','r');
        }
    }

    function refreshAdUnit(id){
        if( use_aps && biddableAdUnbit(id) ){ 
            pushApsBid(id);
        } else {
            refreshAdId(id);
        }
        if( __tnt.ads.dfp.refresh ){
            doRefreshTimeout(id);
        }
    }

    function doRefreshTimeout(id){
        if(dfp.slots[id].size[1] != 1 && dfp.slots[id].size[0][1] != 1){
            dfp.slots[id].refresh = false;
            setTimeout(function(){
                log(['Setting: '+id+' as refreshable.'],'','g');
                dfp.slots[id].refresh = true;
            }, 20000);
        }
    }

    function loadAdUnit(id){
        g.cmd.push(function(){
            if( !dfp.slots[id].debounce ){
                dfp.slots[id].debounce = true;
                refreshAdUnit(id);
            }
        }); 
    }

    function throttleEvent(func, wait){
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

    setLoadableAds();
    defineAdUnits();
    checkVisible();

    g.cmd.push(function(){
        var throttledAdScroll = throttleEvent(function(){
            checkVisible();
        }, timer);
        window.addEventListener('scroll', throttledAdScroll);
        
        // eedition event listeners
        if(typeof __tnt.eedition != 'undefined'){
            var story = document.getElementById('ee-storyview');
            if(story){
                var story_ob = new MutationObserver(function(){
                    if(story.style.visibility === 'visible'){
                        if(typeof dfp.slots['fixed-edition-segment-top'] != 'undefined'){ refreshAdUnit('fixed-edition-segment-top'); }
                        if(typeof dfp.slots['fixed-edition-segment-top-sm'] != 'undefined'){ refreshAdUnit('fixed-edition-segment-top-sm'); }
                    }
                });
                story_ob.observe(story, { attributes: true });
                document.getElementById('ee-storyview-content').addEventListener('scroll', throttledAdScroll);
            }
        }
    }); 
})(jQuery, googletag, __tnt.ads.dfp);