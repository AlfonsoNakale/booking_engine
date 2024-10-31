import { updateBookingDetails } from "./bookingDetails.js";

// API configuration for exchange rate service
const API_CONFIG = {
  KEY: "f8eb8575dc0df45769f9bc6c",
  BASE_URL: "https://v6.exchangerate-api.com/v6",
};

// Constants for pricing calculations
export const PRICING_CONSTANTS = {
  TAX_RATE: 0.15, // 15% tax rate
  DEFAULT_EXCHANGE_RATE: 1, // Default exchange rate when using NAD
  BASE_PICKUP_FEE: 100.0, // Base fee for pickup service
};

// Application state management object
const state = {
  currentCurrency: "NAD", // Default currency is Namibian Dollar
  exchangeRate: PRICING_CONSTANTS.DEFAULT_EXCHANGE_RATE,
};

/**
 * Formats a price value according to the current currency
 * @param {number} price - The price to format
 * @returns {string} Formatted price string with currency symbol
 */
export function formatPrice(price) {
  try {
    // Use Intl.NumberFormat for standardized currency formatting
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: state.currentCurrency,
    }).format(price * state.exchangeRate);
  } catch (error) {
    console.error("Error formatting price:", error);
    // Fallback formatting if Intl.NumberFormat fails
    return `${state.currentCurrency} ${price * state.exchangeRate}`;
  }
}

/**
 * Returns current state of currency and exchange rate
 * @returns {Object} Current state object
 */
export function getState() {
  return {
    currentCurrency: state.currentCurrency,
    exchangeRate: state.exchangeRate,
  };
}

/**
 * Initializes the pricing calculation module
 * Sets default currency to NAD and sets up event listeners
 */
export function initializePricingCalculation() {
  // Set NAD as default selected currency
  const nadCurrencyRadio = document.getElementById("currency-nad");
  if (nadCurrencyRadio) {
    nadCurrencyRadio.checked = true;
  }

  addEventListeners();
  fetchExchangeRate();
  updateBookingDetails();
}

/**
 * Sets up event listeners for vehicle selection and currency changes
 */
function addEventListeners() {
  // Add listeners to vehicle selection radio buttons
  document
    .querySelectorAll('input[name="vehicle"]')
    .forEach((input) => input.addEventListener("change", updateBookingDetails));

  // Add listeners to currency selection radio buttons
  document
    .querySelectorAll('input[name="currency-group"]')
    .forEach((input) => input.addEventListener("change", handleCurrencyChange));
}

/**
 * Fetches current exchange rate from API
 * Only fetches if currency is not NAD
 */
async function fetchExchangeRate() {
  if (state.currentCurrency === "NAD") {
    state.exchangeRate = PRICING_CONSTANTS.DEFAULT_EXCHANGE_RATE;
    return;
  }

  try {
    // Fetch exchange rate from API
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/${API_CONFIG.KEY}/pair/NAD/${state.currentCurrency}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.result === "success") {
      state.exchangeRate = data.conversion_rate;
    } else {
      throw new Error(data.error || "API returned unsuccessful result");
    }
  } catch (error) {
    console.error("Exchange rate fetch failed:", error);
    // Use default exchange rate if fetch fails
    state.exchangeRate = PRICING_CONSTANTS.DEFAULT_EXCHANGE_RATE;
  }
}

/**
 * Handles currency change events
 * Updates state and refreshes prices
 * @param {Event} event - Currency change event
 */
async function handleCurrencyChange(event) {
  const oldCurrency = state.currentCurrency;
  state.currentCurrency = event.target.value;
  await fetchExchangeRate();
  updateBookingDetails();
}

/**
 * Updates the pricing display based on selected vehicle
 * Converts prices to selected currency
 */
export function updatePricing() {
  const selectedVehicle = document.querySelector(
    'input[name="vehicle"]:checked'
  );
  const priceElement = document.getElementById("v-price");

  if (!priceElement) return;

  if (selectedVehicle) {
    const nadPrice = parseFloat(selectedVehicle.value);
    const convertedPrice = nadPrice * state.exchangeRate;
    updatePriceElementValues(priceElement, nadPrice, convertedPrice);
  } else {
    clearPriceElement(priceElement);
  }
}

/**
 * Updates price element with NAD and converted values
 * @param {HTMLElement} element - Price display element
 * @param {number} nadPrice - Price in NAD
 * @param {number} convertedPrice - Price in selected currency
 */
function updatePriceElementValues(element, nadPrice, convertedPrice) {
  element.dataset.nadValue = nadPrice.toFixed(2);
  element.dataset.convertedValue = convertedPrice.toFixed(2);
  element.textContent = formatPrice(nadPrice);
}

/**
 * Clears price element values
 * @param {HTMLElement} element - Price display element to clear
 */
function clearPriceElement(element) {
  element.textContent = "-";
  element.removeAttribute("data-nad-value");
  element.removeAttribute("data-converted-value");
}

/**
 * Updates price element and corresponding input field
 * @param {string} elementId - ID of element to update
 * @param {number} value - Price value to set
 */
function updatePriceElement(elementId, value) {
  const element = document.getElementById(elementId);
  const inputElement = document.querySelector(`input[name="${elementId}"]`);

  if (element) {
    // Store original NAD value
    element.dataset.nadValue = value.toFixed(2);
    // Calculate and store converted value
    const convertedValue = value * state.exchangeRate;
    element.dataset.convertedValue = convertedValue.toFixed(2);
    // Display formatted price
    element.textContent = formatPrice(value);

    // Update corresponding input field if it exists
    if (inputElement) {
      inputElement.value = value.toFixed(2);
      inputElement.dataset.nadValue = value.toFixed(2);
      inputElement.dataset.convertedValue = convertedValue.toFixed(2);
    }
  }
}

/**
 * Calculates pickup fee based on pickup confirmation status
 * @returns {number} Pickup fee amount or 0 if pickup not confirmed
 */
function getPickupFee() {
  const pickupConfirmation = document.getElementById("pickup-confirmation");
  const pickupFeeElement = document.getElementById("v-price-pickup");

  if (pickupConfirmation && pickupConfirmation.checked) {
    return PRICING_CONSTANTS.BASE_PICKUP_FEE;
  } else {
    // Clear pickup fee display if pickup not confirmed
    if (pickupFeeElement) {
      pickupFeeElement.textContent = "-";
      pickupFeeElement.removeAttribute("data-nad-value");
      pickupFeeElement.removeAttribute("data-converted-value");
    }
    return 0.0;
  }
}

/**
 * Calculates total price including vehicle price, extras, pickup fee, and tax
 */
export function calculateTotal() {
  const priceElement = document.getElementById("v-price");
  const durationElement = document.getElementById("v-duration");
  const totalExtrasElement = document.getElementById("v-price-total-extra");

  if (!priceElement || !durationElement || !totalExtrasElement) return;

  // Get base values from elements
  const price = parseFloat(priceElement.dataset.nadValue) || 0;
  const duration = parseInt(durationElement.dataset.value) || 0;
  const totalExtras = parseFloat(totalExtrasElement.dataset.nadValue) || 0;
  const currentPickupFee = getPickupFee();

  // Calculate totals
  const subtotal = price * duration;
  const preTaxTotal = subtotal + currentPickupFee + totalExtras;
  const tax = preTaxTotal * PRICING_CONSTANTS.TAX_RATE;
  const subTotal = preTaxTotal + tax;

  // Update all price elements
  updatePriceElement("v-price-pickup", currentPickupFee);
  updatePriceElement("v-price-total-extra", totalExtras);
  updatePriceElement("v-price-tax", tax);
  updatePriceElement("v-sub-total", subTotal);
}

/**
 * Handles changes to the location input
 * Updates pickup fee and recalculates total
 */
export function handleLocationChange() {
  const locationInput = document.getElementById("i-current-location");
  const locationDisplay = document.getElementById("v-current-location");
  const pickupFeeElement = document.getElementById("v-price-pickup");
  const locationInputWrapper = document.getElementById("pickup-error-wrapper");

  if (!locationInput || !locationDisplay) {
    console.warn("Location elements not found");
    return;
  }

  const locationValue = locationInput.value.trim();

  // Update location display and its dataset
  locationDisplay.textContent = locationValue || "-";
  locationDisplay.dataset.value = locationValue;

  // Update wrapper value if it exists
  if (locationInputWrapper) {
    locationInputWrapper.value = locationValue;
  }

  // Update pickup fee based on location
  if (pickupFeeElement) {
    if (locationValue) {
      updatePriceElement("v-price-pickup", PRICING_CONSTANTS.BASE_PICKUP_FEE);
    } else {
      clearPriceElement(pickupFeeElement);
    }
  }

  calculateTotal();
}

/**
 * Handles changes to pickup confirmation checkbox
 * Shows/hides location input and updates pricing accordingly
 */
export function handlePickupConfirmationChange() {
  const pickupConfirmation = document.getElementById("pickup-confirmation");
  const locationWrapper = document.getElementById("pickup-error-wrapper");
  const locationInput = document.getElementById("i-current-location");
  const pickupFeeElement = document.getElementById("v-price-pickup");
  const locationDisplay = document.getElementById("v-current-location");

  if (!pickupConfirmation || !locationWrapper) {
    console.warn("Required elements for pickup confirmation not found");
    return;
  }

  const isPickupConfirmed = pickupConfirmation.checked;

  // Show/hide location input based on checkbox state
  locationWrapper.style.display = isPickupConfirmed ? "block" : "none";
  locationWrapper.setAttribute("aria-hidden", (!isPickupConfirmed).toString());

  if (!isPickupConfirmed) {
    // Clear location data when pickup not confirmed
    if (locationInput) {
      locationInput.value = "";
      locationInput.removeAttribute("required");
    }

    if (locationDisplay) {
      locationDisplay.textContent = "-";
      locationDisplay.dataset.value = "";
    }

    if (pickupFeeElement) {
      clearPriceElement(pickupFeeElement);
    }
  } else {
    // Make location required when confirmed
    if (locationInput) {
      locationInput.setAttribute("required", "");
      // If there's an existing value, make sure it's displayed
      if (locationInput.value.trim()) {
        handleLocationChange();
      }
    }
  }

  calculateTotal();
}

/**
 * Initializes location-related event listeners and handlers
 */
function initializeLocationHandlers() {
  const pickupCheckbox = document.getElementById("pickup-confirmation");
  const locationInput = document.getElementById("i-current-location");

  if (pickupCheckbox) {
    pickupCheckbox.addEventListener("change", () => {
      handlePickupConfirmationChange();
      updateBookingDetails();
    });
    // Initial state setup
    handlePickupConfirmationChange();
  }

  if (locationInput) {
    // Use input and change events to catch all changes
    locationInput.addEventListener("input", () => {
      handleLocationChange();
      updateBookingDetails();
    });

    locationInput.addEventListener("change", () => {
      handleLocationChange();
      updateBookingDetails();
    });

    // Initial state setup if there's a value
    if (locationInput.value.trim()) {
      handleLocationChange();
    }
  }
}

// Update the DOMContentLoaded listener
document.addEventListener("DOMContentLoaded", () => {
  initializeLocationHandlers();
});

// Add this helper function
function logError(message, error = null) {
  console.error(`Pickup Confirmation Error: ${message}`, error);
  // Add your error tracking service here if available
}
