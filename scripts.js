document.addEventListener('DOMContentLoaded', function () {

    var topHeader = document.getElementById('topHeader');

    var headerLogo = document.getElementById('headerLogo');

    var banner = document.getElementById('bannerAndHeader');

    document.addEventListener('scroll', function () {
        var scrollPosition = window.scrollY;


        if (scrollPosition > 60) {
            topHeader.style.backgroundColor = 'rgba(255,255,255,1)';
            topHeader.style.height = '80pt';
            // headerLogo.style.width = '200px';
            headerLogo.style.scale = '0.8';
        }
        else {
            topHeader.style.backgroundColor = 'rgba(255,255,255,0)';
            topHeader.style.height = '120pt';
            // headerLogo.style.width = '250px';
            headerLogo.style.scale = '1';
        }


        banner.style.backgroundPosition = 'center ' + (scrollPosition / 2) + 'px';


    });
});