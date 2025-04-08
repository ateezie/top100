
if(typeof(tritonIdSync) != "object" || typeof(tritonIdSync.load_pixel) != "function") {
    var tritonIdSync = {
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
    

