window.falconOffer = (function() {
    var ignore=true, target=new Date("16 Sep 2024 00:00:00 CST");
    var now=new Date();
    var change=false, query = new URLSearchParams(document.location.search);
    var package = {
        "level": "dop",
        "title": "Digital Plus",
        "tagline": "Special introductory offer!",
        "special_title": "Offer available for new customers only",
        "display_title": "$1 for 3 months",
        "start_price": "$19.99",
        "promotional_price": "1.00",
        "purchase_url": "https://subscriber.stltoday.com/cgi-bin/accept",
        "html": "<p><b>Enjoy these exclusive benefits:<\/b><\/p>\n"
                +"<p><i class=\"fas tnt-check fa fa-check\"><\/i> <span class=\"text-muted\">Unlimited access to our E-edition<\/span><\/p>\n"
                +"<p><i class=\"fas tnt-check fa fa-check\"><\/i> <span class=\"text-muted\">Unlimited articles on {{domain}} and our mobile app<\/span><\/p>\n"
                +"<p><i class=\"fas tnt-check fa fa-check\"><\/i> <span class=\"text-muted\">FREE Access to Newspapers.com archives (last 2 years)<\/span><\/p>\n"
                +"<p><i class=\"fas tnt-check fa fa-check\"><\/i> <span class=\"text-muted\">Games and puzzles online<\/span><\/p>",
    };
    
    if(ignore) return package;
	
    if (now >= target) {
        change=true;
        console.log('[falconOffer] Paywall target date ' + target + " reached.");
    }
    if (query.get('xyzzy') == 'woc') {
        change=true;
        console.log("[falconOffer] Paywall button test change triggered.");
    }
    if (change) {
       package.display_title='$1 for 3 months';
       package.start_price='$19.99';
    }
    
    return package;
})();