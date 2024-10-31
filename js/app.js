"use strict";

// Import all required modules using ES6 import syntax
import { initializeDatePickers } from "./datePicker.js";
import { initializeFormValidation } from "./formValidation.js";
import { initializePricingCalculation } from "./pricingCalculation.js";
import { initializeBookingDetails } from "./bookingDetails.js";

// Initialize Webflow
window.Webflow ||= [];
window.Webflow.push(() => {
  // Initialize all modules
  initializeDatePickers();
  initializeBookingDetails();
  initializeFormValidation();
  initializePricingCalculation();
});
