(function(g,i,z,m,o,e,s){
    var me;if(!i[g]) {console.error('module %s incorrectly called.',z.currentScript.src);return}me=i[g];
    /** === define your module here, me will be the namespace variable. === */
    var d=document, l=document.location;
    var dmp_id, use_storage=(!!window.localStorage && !!window.localStorage.setItem), now=new Date(),c1,c2,c3;
    me.page=me.page||{};
    me.user=me.user||{};
    me.page.query=new URLSearchParams(l.search);
    me.cookie=function(a) {var b=d.cookie.match('(^|[^;]+)\\s*' + a + '\\s*=\\s*([^;]*)');return b?b.pop():null}
    me.cookie.site = l.hostname;
    me.cookie.domain = me.cookie.site.match(/([^.]+\.[^.]+)$/)[1];
    me.setcookie=function(n,v,d,s){var e="";if(!s){s=me.cookie.site};if(d){var dt=new Date();dt.setTime(dt.getTime()+(d*24*60*60*1000));e="; expires="+ dt.toUTCString()}document.cookie=n+"="+encodeURIComponent(v||"")+e+"; domain="+s+"; path=/"}
    me.user.logged_in = !!me.cookie('tncms-authtoken') || !!me.cookie('tncms-user');
    if(!me.user.logged_in) {
        /** clear out other cookies if the user is not really logged in. */
        ['tncms-services','tncms-screenname','tncms-authtoken','tncms-avatarurl','tncms-screenname','leefalcon_membership'].forEach(function(c){
            me.setcookie(c,'none',-1,me.cookie.domain);
        });
    }
    me.user.has_services = !!me.cookie('tncms-services');
    me.user.is_admin=false;
    me.user.plan = me.cookie('leefalcon_membership') || 'none';
    me.page.url = l.protocol + '//' + l.host + l.pathname;
    me.page.hash = l.hash;
    me.page.app=me.page.type="other";
    me.user.services = me.cookie('tncms-services');
    if (me.user.services) me.user.services = me.user.services.split('%2C');
    if (me.user.services) me.user.is_admin = me.user.services.includes("0");
    
    c1=me.cookie("tncms-dmp-id");
    c2=me.cookie("stl-dmp-id");
    c3=(use_storage ? window.localStorage.getItem("__STL:dmp_id") : null);
    if(c3=='null' || c3=='undefined' || c3=='false') c3=null;
    if(!c3) window.localStorage.removeItem("__STL:dmp_id");
    dmp_id = c1 || (use_storage && c3 ? c3 : c2);
    if (dmp_id=="null") dmp_id=null;
    if (dmp_id) {
        if (use_storage) {
            window.localStorage.setItem("__STL:dmp_id",dmp_id);
            if(!!c2) window.localStorage.setItem("__STL:dmp_id:last_seen",""+now.getTime()+":stl");
            if(!!c1) window.localStorage.setItem("__STL:dmp_id:last_seen",""+now.getTime()+":tncms");
        }
    }
    me.user.dmp_id = dmp_id;    
    me.services_check=function(d) {
        var s,d,l,id,plan='none';
        if (me.user.plan=='none' && me.user.logged_in) {
            for(s in d) {
                if (d.hasOwnProperty(s)) {
                    plan = d[s]['level'];
                    id = d[s]['id'];
                    if (me.user.services && me.user.services.includes(id)) me.user.plan = plan;
                }
            }
            if (me.user.plan != "none") me.setcookie('leefalcon_membership',me.user.plan,0,me.cookie.domain);
        }
    }
    
    me.page.end=function() {
        function do_cmd(c) {c.apply(window,[me])}
        if (me.page.end.cmds.length>0) {
            me.log('start: queued commands.');
            while(me.page.end.cmds.length>0) {
                c = me.page.end.cmds.shift();
                do_cmd(c);
            }
            me.log('end: queued commands.');
        }
        me.page.end.cmds.push=do_cmd;
        if (me.version.js != me.version.utl) me.log("version mismatch.");
    }
    me.page.end.cmds=[];
    me.page.begin=function(d) {
        var s,d,l,id,plan='none';
        if (me.page.query.get("debug")) {me.debug=true;me.log("debug enabled on URL.")}
        if (document.location.pathname != me.page.path) {
            /* me.carp('this.url.path is broken, the UTL path is "'+me.page.path+'", the page says the path is "'+document.location.pathname+'".'); */
            me.page.path=document.location.pathname;
        }
        if (me.user.plan=='none' && me.user.logged_in) {
            for(s in d) {
                if (d.hasOwnProperty(s)) {
                    plan = d[s]['level'];
                    id = d[s]['id'];
                    if (me.user.services && me.user.services.includes(id)) me.user.plan = plan;
                }
            }
            if (me.user.plan != "none") {
                me.setcookie('leefalcon_membership',me.user.plan);
            }
            else {
                me.setcookie('leefalcon_membership','none',-1,me.cookie.domain);
            }
        }

        /** watch for the FC dialog */
        if (me.page.mode !='design' && !me.user.logged_in && me.page.app !='user') me.page.end.cmds.push(function(){
            var target,tries=0,watcher=setInterval(function() {
                tries++;
                if (tries>45) {
                    clearInterval(watcher);
                    me.log("FCFIXUP: link never detected.");
                    return;
                }
                target=document.querySelector('.fc-subscription-link');
                if (target && target.href=="https://www.stltoday.com/users/login/") {
                    me.log("FCFIXUP: target link has appeared:",tries);
                    target.href+='?referer_url='+encodeURIComponent(document.location);
                    clearInterval(watcher);
                    return;
                }
            },1000);
            me.log("FCFIXUP: watching for link.");
        });
    }
    /** add stl-user classes to the HTML tag. */
    me.page.end.cmds.push(function() {
        d.addEventListener("DOMContentLoaded", function() {
            me.log("DOMContentLoaded");
            setTimeout(function() {
                var h = d.head.parentElement, t=(__tnt?__tnt:false);
                h.classList.add(me.user.logged_in    ? 'stl-is-logged-in'  : 'stl-not-logged-in' );
                h.classList.add(me.user.has_services ? 'stl-is-subscriber' : 'stl-not-subscriber');
                h.classList.add(me.user.is_admin     ? 'stl-is-admin'      : 'stl-not-admin'     );
                if (me.user.logged_in) {
                    h.classList.add('stl-user-plan-' + me.user.plan.toLowerCase());
                }
                else {
                    h.classList.add('stl-user-plan-none');
                }
            },100);
        });
    });
    me.define('site/stl.init',[],function() {return me});
    /** === end define. */
})((new URL(document.currentScript.src)).hash.replace(/^#/,''),window,document);