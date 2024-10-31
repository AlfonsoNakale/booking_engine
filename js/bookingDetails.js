import flatpickr from "flatpickr";
import {
  updatePricing,
  calculateTotal,
  formatPrice,
  getState,
  handlePickupConfirmationChange,
} from "./pricingCalculation.js";

/**
 * Creates a memoized version of a function to cache results
 * @param {Function} fn - Function to memoize
 * @returns {Function} Memoized function
 */
const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
};

/**
 * Calculates the duration between two dates in days
 * Memoized to improve performance for repeated calculations
 * @param {Date} pickupDate - Start date
 * @param {Date} returnDate - End date
 * @returns {number} Number of days between dates (minimum 1)
 */
const calculateDurationDays = memoize((pickupDate, returnDate) => {
  if (!pickupDate || !returnDate) return 0;
  const durationMs =
    returnDate.setHours(0, 0, 0, 0) - pickupDate.setHours(0, 0, 0, 0);
  return Math.max(1, Math.ceil(durationMs / (1000 * 60 * 60 * 24)));
});

/**
 * Main function to update all booking details
 * Calls various update functions to refresh the UI
 */
export function updateBookingDetails() {
  calculateDuration();
  updatePricing();
  calculateTotal();
  updateVehicleName();
  updatePickupLocation();
  updateDateDisplays();
  updateExtras();
  updateDynamicValues();
}

/**
 * Calculates and updates the duration display
 * Updates both display element and hidden input field
 */
function calculateDuration() {
  const pickupDate = flatpickr("#datetimes-pickup").selectedDates[0];
  const returnDate = flatpickr("#datetimes-return").selectedDates[0];
  const durationElement = document.getElementById("v-duration");
  const durationInput = document.querySelector('input[name="v-duration"]');

  if (!durationElement) {
    console.error("Duration element not found");
    return;
  }

  if (pickupDate && returnDate) {
    // Calculate duration in days
    const durationMs =
      returnDate.setHours(0, 0, 0, 0) - pickupDate.setHours(0, 0, 0, 0);
    const duration = Math.max(1, Math.ceil(durationMs / (1000 * 60 * 60 * 24)));

    // Update duration display with proper pluralization
    durationElement.textContent = `${duration} ${
      duration === 1 ? "day" : "days"
    }`;
    durationElement.dataset.value = duration;

    // Update hidden input field
    if (durationInput) {
      durationInput.value = duration;
    }
  } else {
    // Clear duration if dates are not selected
    durationElement.textContent = "-";
    durationElement.removeAttribute("data-value");
    if (durationInput) {
      durationInput.value = "";
    }
  }
}

/**
 * Updates the vehicle name display based on selected vehicle
 * Updates both display element and hidden input field
 */
function updateVehicleName() {
  const selectedVehicle = document.querySelector(
    'input[name="vehicle"]:checked'
  );
  const vehicleNameElement = document.getElementById("v-vehicle-name");
  const vehicleNameInput = document.querySelector(
    'input[name="v-vehicle-name"]'
  );

  if (!vehicleNameElement) {
    console.error("Vehicle name element not found");
    return;
  }

  if (selectedVehicle) {
    // Get vehicle name from label next to radio button
    const vehicleName = selectedVehicle.nextElementSibling.textContent;
    vehicleNameElement.textContent = vehicleName;
    vehicleNameElement.dataset.value = vehicleName;

    // Update hidden input field
    if (vehicleNameInput) {
      vehicleNameInput.value = vehicleName;
    }
  } else {
    // Clear vehicle name if none selected
    vehicleNameElement.textContent = "-";
    vehicleNameElement.removeAttribute("data-value");
    if (vehicleNameInput) {
      vehicleNameInput.value = "";
    }
  }
}

/**
 * Initializes pickup location functionality
 */
export function initializePickupLocation() {
  const locationInput = document.getElementById("i-current-location");
  if (locationInput) {
    locationInput.addEventListener("input", updatePickupLocation);
    // Initial update
    updatePickupLocation();
  }
}

/**
 * Updates the pickup location display
 * Syncs input value with display element
 */
function updatePickupLocation() {
  const locationInput = document.getElementById("i-current-location");
  const locationDisplay = document.getElementById("v-current-location");

  if (!locationInput || !locationDisplay) {
    console.warn("Location elements not found");
    return;
  }

  const locationValue = locationInput.value.trim();
  locationDisplay.textContent = locationValue || "-";
  locationDisplay.dataset.value = locationValue;
}

/**
 * Updates the date displays for pickup and return dates
 * Initializes date pickers if not already set
 */
function updateDateDisplays() {
  const pickupPicker = flatpickr("#datetimes-pickup");
  const returnPicker = flatpickr("#datetimes-return");

  if (pickupPicker && returnPicker) {
    // Get selected dates or use defaults
    const pickupDate =
      pickupPicker.selectedDates[0] ||
      pickupPicker.latestSelectedDateObj ||
      new Date();
    const returnDate =
      returnPicker.selectedDates[0] ||
      returnPicker.latestSelectedDateObj ||
      new Date(pickupDate.getTime() + 5 * 24 * 60 * 60 * 1000); // Default 5 days rental

    // Update date displays
    updateDateElement("v-date-pickup", pickupDate);
    updateDateElement("v-date-return", returnDate);

    // Initialize pickers with default dates if not set
    if (!pickupPicker.selectedDates.length) pickupPicker.setDate(pickupDate);
    if (!returnPicker.selectedDates.length) returnPicker.setDate(returnDate);
  }
}

/**
 * Updates a date element with formatted date string
 * @param {string} elementId - ID of the element to update
 * @param {Date} date - Date object to format and display
 */
function updateDateElement(elementId, date) {
  const element = document.getElementById(elementId);
  if (element) {
    if (date) {
      // Format date with time for display
      const formattedDate = date.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      });
      element.textContent = formattedDate;
      // Store date without time in dataset
      element.dataset.value = date.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } else {
      // Clear date display if no date provided
      element.textContent = "-";
      element.removeAttribute("data-value");
    }
  }
}

/**
 * Updates all elements with IDs starting with "v-" using their dataset values
 */
function updateDynamicValues() {
  document.querySelectorAll('[id^="v-"]').forEach((element) => {
    const value = element.dataset.value;
    if (value) element.textContent = value;
  });
}

/**
 * Updates pricing for all extra items and calculates total extras
 * Handles checkbox states, quantities, and price calculations
 */
function updateExtras() {
  // Configuration for extra items
  const extras = [
    {
      checkbox: "extra_0",
      price: "v-price-extra_0",
      quantity: "extra-quantity_0",
      basePrice: 120.0,
    },
    {
      checkbox: "extra_2",
      price: "v-price-extra_2",
      quantity: "extra-quantity_2",
      basePrice: 165.0,
    },
    {
      checkbox: "extra_3",
      price: "v-price-extra_3",
      quantity: "extra-quantity_3",
      basePrice: 220.0,
    },
    {
      checkbox: "extra_4",
      price: "v-price-extra_4",
      quantity: "extra-quantity_4",
      basePrice: 1100.0,
    },
  ];

  let totalExtras = 0;
  const defaultQuantity = 1;
  const maxQuantity = 5;

  // Process each extra item
  extras.forEach((extra) => {
    const checkbox = document.getElementById(extra.checkbox);
    const priceElement = document.getElementById(extra.price);
    const quantityInput = document.getElementById(extra.quantity);

    if (checkbox && priceElement && quantityInput) {
      if (checkbox.checked) {
        // Enable and configure quantity input
        quantityInput.disabled = false;
        quantityInput.min = 1;
        quantityInput.max = 5;

        // Ensure quantity is within valid range
        const quantity = Math.min(
          Math.max(parseInt(quantityInput.value) || defaultQuantity, 1),
          maxQuantity
        );
        quantityInput.value = quantity;

        // Calculate price for this extra
        const nadPrice = extra.basePrice * quantity;

        // Update price element with NAD and converted values
        priceElement.dataset.nadValue = nadPrice.toFixed(2);
        priceElement.dataset.convertedValue = (
          nadPrice * getState().exchangeRate
        ).toFixed(2);
        priceElement.textContent = formatPrice(nadPrice);

        totalExtras += nadPrice;
      } else {
        // Clear price element and disable quantity input if unchecked
        priceElement.textContent = "-";
        priceElement.removeAttribute("data-nad-value");
        priceElement.removeAttribute("data-converted-value");
        quantityInput.disabled = true;
        quantityInput.value = "";
      }
    }
  });

  // Update total extras display
  const totalExtrasElement = document.getElementById("v-price-total-extra");
  if (totalExtrasElement) {
    totalExtrasElement.dataset.nadValue = totalExtras.toFixed(2);
    totalExtrasElement.dataset.convertedValue = (
      totalExtras * getState().exchangeRate
    ).toFixed(2);
    totalExtrasElement.textContent = formatPrice(totalExtras);
  }
}

/**
 * Initializes all dynamic updates and event listeners
 * Sets up handlers for inputs, extras, and location changes
 */
export function initializeDynamicUpdates() {
  // Add listeners to all input and select elements
  document.querySelectorAll("input, select").forEach((input) => {
    if (input.id !== "pickup-error-wrapper") {
      input.addEventListener("change", updateBookingDetails);
      if (input.type !== "checkbox" && input.type !== "radio") {
        input.addEventListener("input", updateBookingDetails);
      }
    }
  });

  // Initialize extra item handlers
  ["extra_0", "extra_2", "extra_3", "extra_4"].forEach((id) => {
    const checkbox = document.getElementById(id);
    const quantityInput = document.getElementById(
      `extra-quantity_${id.slice(-1)}`
    );

    if (checkbox && quantityInput) {
      // Handle checkbox changes
      checkbox.addEventListener("change", () => {
        quantityInput.disabled = !checkbox.checked;
        quantityInput.value = checkbox.checked ? "1" : "";
        updateBookingDetails();
      });

      // Handle quantity input changes
      quantityInput.addEventListener("input", () => {
        let value = parseInt(quantityInput.value) || 1;
        value = Math.min(Math.max(value, 1), 5);
        quantityInput.value = value;
        updateBookingDetails();
      });
    }
  });

  // Initialize location input handlers
  const currentLocationInput = document.getElementById("pickup-error-wrapper");
  if (currentLocationInput) {
    currentLocationInput.addEventListener("input", updatePickupLocation);
  }

  // Initialize pickup confirmation handler
  const pickupConfirmation = document.getElementById("pickup-confirmation");
  if (pickupConfirmation) {
    pickupConfirmation.addEventListener("change", () => {
      handlePickupConfirmationChange();
      updateBookingDetails();
    });
    handlePickupConfirmationChange();
  }

  // Initialize location input handler
  const locationInput = document.getElementById("current-location-2");
  if (locationInput) {
    locationInput.addEventListener("input", () => {
      handlePickupConfirmationChange();
      updateBookingDetails();
    });
    handlePickupConfirmationChange();
  }
}

/**
 * Initializes the booking details module
 * Sets up initial date displays and updates
 */
export function initializeBookingDetails() {
  updateDateDisplays();
  updateBookingDetails();
  initializeDynamicUpdates();
}

/**
 * Safe wrapper for updateBookingDetails with error handling
 * Catches and logs errors to prevent UI crashes
 */
function safeUpdateBookingDetails() {
  try {
    calculateDuration();
    updatePricing();
    calculateTotal();
    updateVehicleName();
    updatePickupLocation();
    updateDateDisplays();
    updateExtras();
    updateDynamicValues();
  } catch (error) {
    console.error("Error updating booking details:", error);
    // Implement fallback behavior or user notification
  }
}
