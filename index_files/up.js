!function(o,i){o.cntrUpTag={pixelserv:"https://pixel.sitescout.com",pixelsync:"https://pixel-sync.sitescout.com",clickserv:"https://clickserv.sitescout.com/conv/",vendorId:156,sync:function(){var r=o.cntrUpTag.pixelsync+"/dmp/asyncPixelSync",a=i.createElement("iframe");(a.frameElement||a).style.cssText="width: 0; height: 0; border: 0; display: none !important;",a.src="javascript:false",s(function(t,n){i.body.appendChild(a);var e=a.contentWindow.document,c=[];t&&c.push("gdpr_consent="+encodeURIComponent(t)),"boolean"==typeof n&&c.push("gdpr="+(n?"1":"0")),c=c.join("&"),r+=c?"?"+c:"",e.open().write("<body onload=\"window.location.href='"+r+"'\">"),e.close()})},track:function(e,t){var c=o.cntrUpTag.pixelserv+"/up/"+t;s(function(t,n){g(c+p([],e,t,n))})},conv:function(t,n,e){var c=o.cntrUpTag.clickserv,r=[];if(e&&r.push("transactionId="+e),n&&t)c=c+t+"/"+n;else{if(!t)return;c+=t}s(function(t,n){g(c+p(r,"cntrData",t,n))})},iap:function(t){var e=o.cntrUpTag.pixelserv+"/iap/"+t;s(function(t,n){g(e+p([],"cntrData",t,n))})},cntrUrl:"",cookieless:!0,cmpCallbacks:{},cmpDelay:500,tcfapi:!1};var t,n,e,c=i.currentScript;if(!c)for(var r=i.getElementsByTagName("script"),a=r.length-1;0<=a;a--)if(/\/up.js\?/.test(r[a].src)){c=r[a];break}try{o.cntrUpTag.cntrUrl=top.location.href}catch(t){o.cntrUpTag.cntrUrl=o.location!==o.parent.location?i.referrer:i.location.href}function p(n,t,e,c){n=n||[];var r,a=o[t]||{};for(r in a.hasOwnProperty("cntr_url")||(a.cntr_url=o.cntrUpTag.cntrUrl),a)a.hasOwnProperty(r)&&n.push(encodeURIComponent(r)+"="+encodeURIComponent(a[r]));"undefined"==typeof Storage||!1===o.cntrUpTag.cookieless||(t=JSON.parse(o.localStorage.getItem("cntr_attr"))||[])&&t.length&&t.forEach(function(t){t="cntr_clickAuctionId="+encodeURIComponent(t.aid);n.indexOf(t)<0&&n.push(t)}),e&&n.push("gdpr_consent="+encodeURIComponent(e)),"boolean"==typeof c&&n.push("gdpr="+(c?"1":"0"));c=n.join("&");return c?"?"+c:""}function s(t){i.body?l(t):i.addEventListener?i.addEventListener("DOMContentLoaded",function(){l(t)}):i.attachEvent("onreadystatechange",function(){"complete"===i.readyState&&l(t)})}function l(t){o.cntrUpTag.tcfapi||o.__tcfapi?d(t):setTimeout(function(){d(t)},o.cntrUpTag.cmpDelay||500)}function d(e){var c=o.cntrUpTag.tcfapi||o.__tcfapi,r=o.cntrUpTag.vendorId;if(!c){for(var a,t=o;t;){try{if(t.frames.__tcfapiLocator){a=t;break}}catch(t){}if(t===o.top)break;t=t.parent}a&&(c=function(t,n,e,c){var r=Math.random()+"cntrUpTag",n={__tcfapiCall:{command:t,parameter:c,version:n,callId:r}};o.cntrUpTag.cmpCallbacks[r]=e,a.postMessage(n,"*")},o.addEventListener?o.addEventListener("message",f,!1):o.attachEvent("onmessage",f))}c?(o.cntrUpTag.tcfapi=c)("addEventListener",2,function(t,n){n&&("useractioncomplete"!==t.eventStatus&&"tcloaded"!==t.eventStatus||(c("removeEventListener",2,()=>{},t.listenerId),t.gdprApplies&&!t.vendor.consents[r]||e(t.tcString,t.gdprApplies)))},[r]):e()}function f(t){var n={},e=o.cntrUpTag.cmpCallbacks||{};try{n="string"==typeof t.data?JSON.parse(t.data):t.data}catch(t){}var c=n.__tcfapiReturn;c&&"function"==typeof e[c.callId]&&e[c.callId](c.returnValue,c.success)}function u(t,n){n=new RegExp("[?&]"+n+"=([^&]+)&?"),n=t.match(n);return n&&n[1]||null}function g(t){var n=new Image;n.setAttribute("attributionsrc",""),n.src=t}c&&("1"===u(e=0<=(t=c.src.indexOf("?"))?c.src.slice(t):"","um")&&o.cntrUpTag.sync(),t=u(e,"ck")||"cntr_auctionId",t=u(o.cntrUpTag.cntrUrl,t),"undefined"!=typeof Storage&&"0"!==u(e,"ca")?(e=JSON.parse(o.localStorage.getItem("cntr_attr"))||[],n=(new Date).getTime()-7776e6,e=e.filter(function(t){return t.ts>n}),t&&e.push({ts:(new Date).getTime(),aid:t}),o.localStorage.setItem("cntr_attr",JSON.stringify(e))):o.cntrUpTag.cookieless=!1)}(window,document,navigator);
