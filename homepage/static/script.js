// Function to check which section is currently in view
function getCurrentSection() {
    const sections = document.querySelectorAll('section');
    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 50 && window.pageYOffset < sectionTop + sectionHeight - 50) {
            currentSection = section.id;
        }
    });

    return currentSection;
}

// Function to update active nav item
function updateActiveNavItem() {
    const scrollPosition = window.scrollY;

    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            const navItems = document.querySelectorAll('.nav-item, .mobile-nav-item');
            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href').slice(1) === section.id) {
                    item.classList.add('active');
                }
            });
        }
    });
}

// Improved smooth scrolling function
function smoothScroll(targetId) {
    const target = document.querySelector(targetId);
    const headerOffset = 80;
    const elementPosition = target.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

// Event listener for nav items
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMobileMenu = document.getElementById('close-mobile-menu');
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
    const navItems = document.querySelectorAll('.nav-item, .mobile-nav-item');
    const menuState = document.getElementById('menu-state');

    function toggleMobileMenu() {
        mobileMenu.classList.toggle('translate-x-full');
        document.body.classList.toggle('menu-open');
        
        // Update debug info
        if (mobileMenu.classList.contains('translate-x-full')) {
            menuState.textContent = 'Open';
        } else {
            menuState.textContent = 'Closed';
        }
        
        console.log('Menu toggled. State:', menuState.textContent);
    }

    // Toggle mobile menu
    mobileMenuButton.addEventListener('click', toggleMobileMenu);

    // Close mobile menu
    closeMobileMenu.addEventListener('click', toggleMobileMenu);

    // Close mobile menu when a nav item is clicked
    mobileNavItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            smoothScroll(targetId);
            toggleMobileMenu();
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!mobileMenu.contains(event.target) && !mobileMenuButton.contains(event.target) && !mobileMenu.classList.contains('translate-x-full')) {
            toggleMobileMenu();
        }
    });

    // Smooth scrolling for all nav items
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            smoothScroll(targetId);
        });
    });

    // Update active nav item on scroll
    window.addEventListener('scroll', updateActiveNavItem);

    // Initial call to set the active nav item
    updateActiveNavItem();

    console.log('Script loaded and initialized');
});

// Smooth scrolling function (unchanged)
function smoothScroll(targetId) {
    const target = document.querySelector(targetId);
    const headerOffset = 80;
    const elementPosition = target.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

// Update active nav item (unchanged)
function updateActiveNavItem() {
    const scrollPosition = window.scrollY;

    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            const navItems = document.querySelectorAll('.nav-item, .mobile-nav-item');
            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href').slice(1) === section.id) {
                    item.classList.add('active');
                }
            });
        }
    });
}