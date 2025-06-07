document.addEventListener('DOMContentLoaded', function () {

    var topHeader = document.getElementById('topHeader');

    var headerLogo = document.getElementById('headerLogo');

    var banner = document.getElementById('bannerAndHeader');
    var headerBtn1 = document.getElementById('headerBtn1');
    var headerBtn2 = document.getElementById('headerBtn2');
    var headerBtn3 = document.getElementById('headerBtn3');

    document.addEventListener('scroll', function () {
        var scrollPosition = window.scrollY;


        if (scrollPosition > 60) {
            topHeader.style.backgroundColor = 'rgba(255,255,255,1)';
            topHeader.style.height = '80pt';
            topHeader.style.backgroundImage = 'none';
            // headerLogo.style.width = '200px';
            headerLogo.style.scale = '0.8';
            headerLogo.style.filter = 'invert(0)';

            headerBtn1.style.color = 'black';
            headerBtn2.style.color = 'black';
            headerBtn3.style.color = 'black';
        }
        else {
            topHeader.style.backgroundColor = 'rgba(255,255,255,0)';
            topHeader.style.height = '120pt';
            topHeader.style.backgroundImage = 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0))';
            // headerLogo.style.width = '250px';
            headerLogo.style.scale = '1';
            headerLogo.style.filter = 'invert(1)';
            headerBtn1.style.color = 'white';
            headerBtn2.style.color = 'white';   
            headerBtn3.style.color = 'white';
        }


        banner.style.backgroundPosition = 'center ' + (scrollPosition / 2) + 'px';


    });
});