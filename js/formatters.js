/**
 * Banking Forms Suite - Formatters
 * Utility functions for formatting values consistently across all banking forms
 */

/**
 * Format a number as currency with $ symbol and commas
 * @param {number|string} value - The number to format
 * @param {string} currencySymbol - The currency symbol (default: $)
 * @returns {string} Formatted currency string
 */
function formatCurrency(value, currencySymbol = '$') {
    if (value === null || value === undefined || value === '' || isNaN(parseFloat(value))) {
        return '';
    }

    // Format with currency symbol and commas
    return currencySymbol + parseFloat(value).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

/**
 * Format a value as a fixed 2-decimal number
 * @param {number|string} value - The number to format
 * @returns {string} Number with exactly 2 decimal places
 */
function formatDecimal(value) {
    if (value === null || value === undefined || value === '' || isNaN(parseFloat(value))) {
        return '';
    }

    return parseFloat(value).toFixed(2);
}

/**
 * Format a routing number with dashes (e.g. 123456789 → 1234-5678-9)
 * @param {string} value - The routing number to format
 * @returns {string} Formatted routing number
 */
function formatRoutingNumber(value) {
    if (!value) return '';

    // Remove any non-digits
    const digits = value.replace(/\D/g, '');

    // Format with dashes
    if (digits.length <= 4) {
        return digits;
    } else if (digits.length <= 8) {
        return `${digits.substring(0, 4)}-${digits.substring(4)}`;
    } else {
        return `${digits.substring(0, 4)}-${digits.substring(4, 8)}-${digits.substring(8, 9)}`;
    }
}

/**
 * Format an account number to hide all but the last 4 digits
 * @param {string} value - The account number to mask
 * @returns {string} Masked account number
 */
function maskAccountNumber(value) {
    if (!value) return '';

    const digits = value.replace(/\D/g, '');
    if (digits.length <= 4) return digits;

    const visibleDigits = digits.slice(-4);
    const maskedPortion = '•'.repeat(digits.length - 4);
    return maskedPortion + visibleDigits;
}

/**
 * Apply currency formatting to elements with data-format="currency" attribute
 */
function initializeFormatters() {
    // Set up currency input formatting
    document.querySelectorAll('input[data-format="currency"]').forEach(input => {
        // Create formatted display container
        const formattedContainer = document.createElement('div');
        formattedContainer.className = 'formatted-amount-container';

        const formattedDisplay = document.createElement('div');
        formattedDisplay.className = 'formatted-amount';

        formattedContainer.appendChild(formattedDisplay);

        const inputWrapper = input.closest('.input-with-icon') || input.parentNode;
        inputWrapper.parentNode.insertBefore(formattedContainer, inputWrapper.nextSibling);

        // Format on input
        input.addEventListener('input', function () {
            const value = this.value;

            if (value) {
                formattedDisplay.textContent = formatCurrency(value);
                formattedContainer.style.display = 'block';
            } else {
                formattedContainer.style.display = 'none';
            }
        });

        // Format on blur
        input.addEventListener('blur', function () {
            if (this.value && !isNaN(parseFloat(this.value))) {
                this.value = formatDecimal(this.value);

                if (this.value) {
                    formattedDisplay.textContent = formatCurrency(this.value);
                    formattedContainer.style.display = 'block';
                }
            }
        });

        // Handle form reset
        const form = input.closest('form');
        if (form) {
            form.addEventListener('reset', function () {
                formattedContainer.style.display = 'none';
            });
        }

        // Initial format if there's a value
        if (input.value) {
            formattedDisplay.textContent = formatCurrency(input.value);
            formattedContainer.style.display = 'block';
        } else {
            formattedContainer.style.display = 'none';
        }
    });
}

// Initialize formatters when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeFormatters);
