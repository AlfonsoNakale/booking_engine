/**
 * Initializes form validation
 * Sets up event listeners for real-time validation
 */
export function initializeFormValidation() {
  const form = document.getElementById("email-form");
  if (!form) return;

  // Create debounced validation function to prevent excessive validation
  const debouncedValidation = debounce((field) => {
    if (field.value.trim()) {
      if (field.type === "email" && !isValidEmail(field.value)) {
        showError(field, "Please enter a valid email address");
      } else {
        clearError(field);
      }
    }
  }, 300);

  // Add real-time validation for all form fields
  form.querySelectorAll("input, select, textarea").forEach((field) => {
    field.addEventListener("input", () => debouncedValidation(field));
  });

  // Add submit handler
  form.addEventListener("submit", function (event) {
    if (!validateForm()) {
      event.preventDefault();
    }
  });
}

/**
 * Validates the entire form before submission
 * Checks required fields and email format
 * @returns {boolean} True if form is valid, false otherwise
 */
function validateForm() {
  let isValid = true;
  const errors = new Map();
  const requiredFields = document.querySelectorAll("[required]");

  // Check all required fields
  requiredFields.forEach((field) => {
    if (!field.value.trim()) {
      isValid = false;
      errors.set(field, "This field is required");
    }
  });

  // Special validation for email field
  const emailField = document.getElementById("email");
  if (emailField && emailField.value && !isValidEmail(emailField.value)) {
    isValid = false;
    errors.set(emailField, "Please enter a valid email address");
  }

  // Clear all previous errors first
  requiredFields.forEach(clearError);

  // Show new errors
  errors.forEach((message, field) => showError(field, message));

  return isValid;
}

// Regular expression for email validation
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Validates email format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if email is valid, false otherwise
 */
function isValidEmail(email) {
  return EMAIL_REGEX.test(email);
}

/**
 * Shows error message for a field
 * @param {HTMLElement} field - Form field with error
 * @param {string} message - Error message to display
 */
function showError(field, message) {
  let errorElement = field.nextElementSibling;
  if (!errorElement || !errorElement.classList.contains("error-message")) {
    errorElement = document.createElement("div");
    errorElement.className = "error-message";
    field.parentNode.insertBefore(errorElement, field.nextSibling);
  }
  errorElement.textContent = message;
  field.classList.add("error");
}

/**
 * Clears error message for a field
 * @param {HTMLElement} field - Form field to clear error from
 */
function clearError(field) {
  const errorElement = field.nextElementSibling;
  if (errorElement && errorElement.classList.contains("error-message")) {
    errorElement.textContent = "";
  }
  field.classList.remove("error");
}

/**
 * Creates a debounced function that delays invoking func
 * @param {Function} func - Function to debounce
 * @param {number} wait - Milliseconds to wait before invoking
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
