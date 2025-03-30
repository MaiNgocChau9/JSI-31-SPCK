// js/theme.js

document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement; // Target the <html> element for data-theme
    const lightIcon = document.querySelector('.theme-icon-light');
    const darkIcon = document.querySelector('.theme-icon-dark');

    // Function to update the displayed icon based on the current theme
    function updateThemeIcon(theme) {
        // Only proceed if both icons are found on the page
        if (lightIcon && darkIcon) {
            if (theme === 'dark') {
                lightIcon.style.display = 'none';
                darkIcon.style.display = 'inline'; // Or 'block' if it suits your layout better
            } else {
                lightIcon.style.display = 'inline'; // Or 'block'
                darkIcon.style.display = 'none';
            }
        } else {
             // Optional: Log if icons aren't found, might not be needed on all pages
             // console.warn('Theme icons (.theme-icon-light / .theme-icon-dark) not found on this page.');
        }
    }

    // Function to set the theme on the <html> element and save preference
    function applyTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        updateThemeIcon(theme);
    }

    // --- Initial Theme Load ---
    // Get the theme saved in localStorage, or default to 'light'
    const savedTheme = localStorage.getItem('theme') || 'light';
    // Apply the theme immediately when the script runs after DOM is ready
    applyTheme(savedTheme);

    // --- Theme Toggle Button Logic ---
    // Check if the theme toggle button exists on the current page
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            // Get the current theme from the <html> element
            const currentTheme = htmlElement.getAttribute('data-theme');
            // Determine the new theme
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            // Apply the new theme
            applyTheme(newTheme);
        });
    } else {
        // Optional: Log a warning if the button isn't found
        // console.warn('Theme toggle button (#theme-toggle) not found on this page.');
    }
});