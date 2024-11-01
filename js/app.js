"use strict";

// Development mode check
if (process.env.NODE_ENV !== 'production') {
  console.log('Development mode');
}

// Import all required modules
import { initializeDatePickers } from './datePicker.js';
import { initializeFormValidation } from './formValidation.js';
import { initializeBookingDetails } from './bookingDetails.js';
import { initializePricingCalculation } from './pricingCalculation.js';

// Initialize all modules when DOM is ready
function initializeApp() {
  try {
    initializeDatePickers();
    initializeBookingDetails();
    initializeFormValidation();
    initializePricingCalculation();
  } catch (error) {
    console.error('Failed to initialize application:', error);
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
