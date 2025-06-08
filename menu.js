document.addEventListener('DOMContentLoaded', function () {
    var menuIcon = document.querySelector('.menu-icon');
    var mobileLinksContainer = document.getElementById('mobileLinksContainer');
    var menuOpen = false; // Track menu state

    // Function to toggle the mobile menu
    function toggleMenu() {
        menuIcon.classList.toggle('active');
        mobileLinksContainer.classList.toggle('active');
        menuOpen = !menuOpen;

        // Adjust max-height based on whether the menu is active or not
        if (mobileLinksContainer.classList.contains('active')) {
            mobileLinksContainer.style.maxHeight = 100 + "vh"; // Set to content's height

            // document.body.style.overflow = 'hidden';

            window.addEventListener('scroll', closeMenuOnUserScroll);


        } else {
            mobileLinksContainer.style.maxHeight = "0"; // Collapse the menu

            //enable scroll
            // document.body.style.overflow = 'auto';

            window.removeEventListener('scroll', closeMenuOnUserScroll);

        }
    }

    // Function to check window size and deactivate menu if > 700px
    function checkWindowSize() {
        if (window.innerWidth > 700) {
            // Remove active class and reset styles if window width exceeds 700px
            menuIcon.classList.remove('active');
            mobileLinksContainer.classList.remove('active');
            mobileLinksContainer.style.maxHeight = "0"; // Ensure it's collapsed
        }
    }

    // Add click event listener to the menu icon
    menuIcon.addEventListener('click', toggleMenu);

    mobileLinksContainer.addEventListener('click', toggleMenu);

    // Listen for window resize events
    window.addEventListener('resize', checkWindowSize);

    // Initial check on load
    checkWindowSize();

    function closeMenuOnUserScroll() {
        if (menuOpen == true) {
            toggleMenu();
        } // Close the menu if it's active and not animating
    }

});
