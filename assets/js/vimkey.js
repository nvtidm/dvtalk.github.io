function search() {
    var search = $('#search-input');
    search.val('');
    search.focus();
}

// function addShare() {
//     var share = $('<div class="share"><button class="btn btn-primary btn-tweet" type="button">Tweet</button></div>');
//     $('.share').remove();
//     $('.highlight .media-body').append(share); 
// }

// function tweet() {
//     var link  = $('.highlight .media-body h3 a'),
//         href  = link.attr('href'),
//         title = encodeURIComponent(link.text()),
//         top   = (screen.height / 2) - (230 / 2),
//         left  = (screen.width / 2) - (420 / 2);
//     window.open('http://twitter.com/share?url=' + href + '&text=' + title + '&', 'twitterwindow', 'top='+top+',left='+left+',width=420,height=230,scrollbars=yes');
// }

function down() {
  window.scrollBy(0, 25);

}

function up() {
  window.scrollBy(0, -25);
}

function toppage() {
  window.scrollTo(0,0);
}

function botpage() {
  window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
}


Mousetrap.bind({
    '/': search,
    // 't': tweet,
    'j': down,
    'k': up,
    'g+g': toppage,
    'shift+g': botpage
});

