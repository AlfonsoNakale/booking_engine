"use strict";

// Import all required modules using ES6 import syntax
import { initializeDatePickers } from "./datePicker.js";
import { initializeFormValidation } from "./formValidation.js";
import { initializePricingCalculation } from "./pricingCalculation.js";
import { initializeBookingDetails } from "./bookingDetails.js";

function initializeApp() {
  try {
    initializeDatePickers();
    initializeBookingDetails();
    initializeFormValidation();
    initializePricingCalculation();
  } catch (error) {
    console.error("Failed to initialize application:", error);
    // Show user-friendly error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = 'Something went wrong. Please refresh the page.';
    document.body.prepend(errorDiv);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
