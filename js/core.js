/**
 * Banking Forms Suite - Core Functionality
 * Shared functionality across all banking forms
 */

/**
 * Load HTML component into a container element
 * @param {string} elementId - ID of container to load component into
 * @param {string} componentPath - Path to HTML component file
 */
function loadComponent(elementId, componentPath) {
    const element = document.getElementById(elementId);
    if (!element) return;

    fetch(componentPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            element.innerHTML = html;
        })
        .catch(error => {
            console.error('Error loading component:', error);
        });
}

/**
 * Initialize collapsible sections in the form
 */
function initializeCollapsibleSections() {
    const sections = document.querySelectorAll('.collapsible-section');

    sections.forEach(section => {
        const header = section.querySelector('.section-header');
        if (!header) return;

        header.addEventListener('click', function (event) {
            event.preventDefault();
            section.classList.toggle('active');

            // If section is now active, set focus within it
            if (section.classList.contains('active')) {
                const firstInput = section.querySelector('input, select, textarea');
                if (firstInput) {
                    firstInput.focus();
                }
            }
        });
    });
}

/**
 * Handle storage of recent routing numbers for autocomplete
 * @param {string} routingNumber - Routing number to store
 */
function saveRoutingNumber(routingNumber) {
    if (!routingNumber || routingNumber.length !== 9) return;

    try {
        // Get existing routing numbers
        let recentRoutingNumbers = JSON.parse(localStorage.getItem('recentRoutingNumbers') || '[]');

        // Add new routing number to the beginning (if not already there)
        if (!recentRoutingNumbers.includes(routingNumber)) {
            recentRoutingNumbers.unshift(routingNumber);

            // Keep only the 10 most recent
            recentRoutingNumbers = recentRoutingNumbers.slice(0, 10);

            // Save back to localStorage
            localStorage.setItem('recentRoutingNumbers', JSON.stringify(recentRoutingNumbers));
        }
    } catch (e) {
        console.error('Error saving routing number:', e);
    }
}

/**
 * Get recent routing numbers for autocomplete
 * @returns {Array} - Array of recent routing numbers
 */
function getRecentRoutingNumbers() {
    try {
        return JSON.parse(localStorage.getItem('recentRoutingNumbers') || '[]');
    } catch (e) {
        console.error('Error retrieving routing numbers:', e);
        return [];
    }
}

/**
 * Set up form for submission
 * @param {string} formId - ID of the form to set up
 */
function setupForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', function (event) {
        // Prevent actual form submission during development
        event.preventDefault();

        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) {
            const originalText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = "Processing...";

            // Store any routing numbers
            const routingInputs = form.querySelectorAll('input[data-type="routing"]');
            routingInputs.forEach(input => {
                if (input.value) {
                    saveRoutingNumber(input.value.replace(/[^0-9]/g, ''));
                }
            });

            // Simulate form submission
            setTimeout(function () {
                // Show success message
                alert("Form submitted successfully!");

                // Reset form
                form.reset();

                // Clear any formatted displays
                document.querySelectorAll('.formatted-amount-container').forEach(container => {
                    container.style.display = 'none';
                });

                // Restore button state
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }, 1500);
        }
    });
}

/**
 * Initialize theme toggle functionality
 */
function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.classList.add(savedTheme);
    }

    // Handle toggle click
    themeToggle.addEventListener('click', function () {
        if (document.body.classList.contains('force-dark')) {
            document.body.classList.remove('force-dark');
            document.body.classList.add('force-light');
            localStorage.setItem('theme', 'force-light');
        } else {
            document.body.classList.remove('force-light');
            document.body.classList.add('force-dark');
            localStorage.setItem('theme', 'force-dark');
        }
    });
}

/**
 * Initialize all core functionality
 */
function initializeCore() {
    // Initialize collapsible sections
    initializeCollapsibleSections();

    // Initialize theme toggle
    initializeThemeToggle();

    // Setup form with ID 'bankingForm' if it exists
    setupForm('bankingForm');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeCore);
