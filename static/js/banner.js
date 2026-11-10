/* Book promo banner, live through 2026-12-10 (UTC). Remove this file,
   the #book-banner markup in index.html, the #book-banner rules in
   style.css, and the /geo.json location in conf/listen.nginx.conf
   when the campaign is over. */
var BOOK_BANNER_END = Date.UTC(2026, 11, 10, 23, 59, 59);
var BOOK_BANNER_DISMISSED_KEY = 'l2w_book_banner_dismissed';
var BOOK_BANNER_SELLERS = {
    'US': {name: 'W. W. Norton', url: 'https://wwnorton.com/books/9780393881882'},
    'GB': {name: 'Waterstones', url: 'https://www.waterstones.com/book/the-last-best-place-on-the-internet/richard-cooke/9781783788125'}
};

function book_banner_dismissed() {
    try {
        return window.localStorage.getItem(BOOK_BANNER_DISMISSED_KEY) === '1';
    } catch (e) {
        return false;
    }
}

function book_banner_relayout() {
    if (typeof window.onresize === 'function') {
        window.onresize();
    }
}

$(function() {
    if (Date.now() > BOOK_BANNER_END || book_banner_dismissed()) {
        return;
    }
    var $banner = $('#book-banner');
    $banner.show();
    // The inline bootstrap sizes the SVG from a height computed before
    // #header existed, and assigns window.onresize in a later ready
    // handler; relayout once all ready handlers have run.
    setTimeout(book_banner_relayout, 0);

    $('#book-banner-close').click(function() {
        try {
            window.localStorage.setItem(BOOK_BANNER_DISMISSED_KEY, '1');
        } catch (e) {}
        $banner.hide();
        book_banner_relayout();
    });

    $.getJSON('/geo.json').done(function(data) {
        var seller = data && BOOK_BANNER_SELLERS[data.country];
        if (!seller) {
            return;
        }
        var $sellers = $('#book-banner-sellers');
        var amazon_html = $sellers.html();
        $sellers.html('<a href="' + seller.url + '" target="_blank" rel="noopener">' + seller.name + '</a> and ' + amazon_html);
        book_banner_relayout();
    });
});
