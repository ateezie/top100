if(typeof(tdIdsync) != "object" || typeof(tdIdsync.load_pixel) != "function") {
    var tdIdsync = {
        load_pixel: function(src) {
            var img;
            if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)){
                img = new Image();
            } else {
                img = document.createElement('img');
            }
            img.src = src;
            img.width = 0;
            img.height = 0;
            img.className = "triton-pixel";
            document.body.appendChild(img);
        },
        load_script: function(src) {
            var js = document.createElement('script');
            js.type = 'text/javascript';
            js.src = src;
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(js, s);
        }
    }
}
tdIdsync.load_script("https://yield-op-idsync.live.streamtheworld.com/idsync.js?stn=TRINITY_AUDIO&gdpr=false&gdpr_consent=&us_privacy=1YN-");
