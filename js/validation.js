/**
 * Banking Forms Suite - Validation
 * Form validation functionality that's consistent across all banking forms
 */

/**
 * Validation rules for various field types
 */
const ValidationRules = {
    required: {
        test: value => value && value.trim().length > 0,
        message: 'This field is required.'
    },
    routingNumber: {
        test: value => /^\d{9}$/.test(value.replace(/[^0-9]/g, '')),
        message: 'Please enter a valid 9-digit routing number.'
    },
    accountNumber: {
        test: value => /^\d{5,17}$/.test(value.replace(/[^0-9]/g, '')),
        message: 'Please enter a valid account number (5-17 digits).'
    },
    currency: {
        test: value => {
            const num = parseFloat(value);
            return !isNaN(num) && num > 0;
        },
        message: 'Please enter a valid amount greater than zero.'
    },
    email: {
        test: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: 'Please enter a valid email address.'
    },
    phone: {
        test: value => /^\d{10,15}$/.test(value.replace(/[^0-9]/g, '')),
        message: 'Please enter a valid phone number.'
    },
date: {
    test: value => {
        const datePattern = /^\d{4}-\d{2}-\d{2}$/;
        if (!datePattern.test(value)) return false;

        const date = new Date(value);
        return !isNaN(date.getTime());
    },
    message: 'Please enter a valid date in YYYY-MM-DD format.'
},
// Add this to your ValidationRules object
messageId: {
        test: value => /^[a-zA-Z0-9\-_\.]{1,35}$/.test(value),
        message: 'Please enter a valid message identifier (alphanumeric, max 35 characters).'
    },

    messageNameId: {
        test: value => /^pacs\.\d{3}\.\d{3}\.\d{2}$/.test(value),
        message: 'Please enter a valid message name ID format (e.g., pacs.008.001.08).'
    }
};

/**
 * Validate a single form field
 * @param {HTMLElement} field - The field to validate
 * @returns {boolean} - Whether the field is valid
 */
function validateField(field) {
    // Clear previous error
    const errorElement = document.getElementById(`${field.id}_error`);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }

    // Remove error styling
    field.classList.remove('validation-error');

    // Skip validation if field is hidden (within collapsed section)
    if (field.closest('.section-field') &&
        !field.closest('.collapsible-section').classList.contains('active')) {
        return true;
    }

    // Get validation rules from data attributes
    let rules = [];

    // Required attribute
    if (field.hasAttribute('required')) {
        rules.push('required');
    }

    // Data validation attributes
    if (field.dataset.validate) {
        rules = rules.concat(field.dataset.validate.split(' '));
    }

    // Run validation tests
    let isValid = true;

    for (const rule of rules) {
        if (ValidationRules[rule]) {
            // Get field value and run test
            const value = field.value;
            if (!ValidationRules[rule].test(value)) {
                // Show error message
                if (errorElement) {
                    errorElement.textContent = ValidationRules[rule].message;
                    errorElement.style.display = 'block';
                }

                // Add error styling
                field.classList.add('validation-error');
                isValid = false;
                break;
            }
        }
    }

    return isValid;
}

/**
 * Validate all fields in a form
 * @param {HTMLFormElement} form - The form to validate
 * @returns {boolean} - Whether all fields are valid
 */
function validateForm(formId) {
    const form = document.getElementById(formId) || document.forms[0];
    if (!form) return true;

    let isValid = true;
    const fields = form.querySelectorAll('input, select, textarea');

    fields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    // If validation fails, expand any collapsed sections with errors
    if (!isValid) {
        const sectionsWithErrors = form.querySelectorAll('.collapsible-section:not(.active) .validation-error');
        sectionsWithErrors.forEach(field => {
            const section = field.closest('.collapsible-section');
            if (section) {
                section.classList.add('active');
            }
        });
    }

    return isValid;
}

/**
 * Initialize validation for a form
 * @param {string} formId - ID of the form to initialize
 */
function initializeValidation(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    // Add validation to form submission
    form.addEventListener('submit', function (event) {
        const isValid = validateForm(formId);

        if (!isValid) {
            event.preventDefault();
            event.stopPropagation();

            // Scroll to first error
            const firstError = form.querySelector('.validation-error');
            if (firstError) {
                firstError.focus();
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });

    // Add blur validation to fields
    const fields = form.querySelectorAll('input, select, textarea');
    fields.forEach(field => {
        field.addEventListener('blur', function () {
            // Only validate if field has been interacted with
            if (field.value || field.classList.contains('validation-error')) {
                validateField(field);
            }
        });

        // Clear error styling on input
        field.addEventListener('input', function () {
            field.classList.remove('validation-error');
            const errorElement = document.getElementById(`${field.id}_error`);
            if (errorElement) {
                errorElement.style.display = 'none';
            }
        });
    });
}

// Initialize validation on all forms when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Find all forms with data-validate attribute
    document.querySelectorAll('form[data-validate]').forEach(form => {
        initializeValidation(form.id);
    });
});
