import flatpickr from "flatpickr";
import { updateBookingDetails } from "./bookingDetails.js";

let pickupPicker, returnPicker;

/**
 * Initializes date pickers for pickup and return dates
 * Sets up configuration and event handlers
 */
export function initializeDatePickers() {
  const today = new Date();
  const fiveDaysLater = new Date(today);
  fiveDaysLater.setDate(today.getDate() + 5);

  const commonConfig = {
    enableTime: false,
    dateFormat: "Y-m-d",
    minDate: "today",
    disable: [(date) => date < today],
    onChange: updateBookingDetails,
  };

  pickupPicker = createDatePicker("#datetimes-pickup", {
    ...commonConfig,
    defaultDate: today,
    onClose: handlePickupDateClose,
  });

  returnPicker = createDatePicker("#datetimes-return", {
    ...commonConfig,
    defaultDate: fiveDaysLater,
    minDate: fiveDaysLater,
    onClose: updateBookingDetails,
  });

  pickupPicker.setDate(today);
  returnPicker.setDate(fiveDaysLater);

  updateBookingDetails();
}

/**
 * Creates a date picker instance with input validation
 * @param {string} selector - CSS selector for the input element
 * @param {Object} config - Configuration options for flatpickr
 * @returns {Object} Configured flatpickr instance
 */
function createDatePicker(selector, config) {
  const picker = flatpickr(selector, config);
  const input = document.querySelector(selector);

  input.addEventListener("input", () => validateManualDateInput(input, picker));

  return picker;
}

/**
 * Handles closing of pickup date picker
 * Updates return date minimum based on selected pickup date
 * @param {Array} selectedDates - Array of selected dates from flatpickr
 */
function handlePickupDateClose(selectedDates) {
  if (selectedDates[0]) {
    const minReturnDate = new Date(selectedDates[0]);
    minReturnDate.setDate(minReturnDate.getDate() + 1);
    returnPicker.set("minDate", minReturnDate);

    if (
      returnPicker.selectedDates[0] &&
      returnPicker.selectedDates[0] < minReturnDate
    ) {
      returnPicker.setDate(minReturnDate);
    }
  }
  updateBookingDetails();
}

/**
 * Validates manually entered dates
 * Ensures dates are in correct format and not in the past
 * @param {HTMLElement} input - Date input element
 * @param {Object} picker - Flatpickr instance
 */
function validateManualDateInput(input, picker) {
  const dateValue = input.value;
  const parsedDate = flatpickr.parseDate(dateValue, "Y-m-d");

  if (parsedDate && parsedDate >= new Date()) {
    picker.setDate(parsedDate);
  } else {
    input.value = "";
    alert(
      "Please enter a valid date in YYYY-MM-DD format, not earlier than today."
    );
  }
}

/**
 * Updates the display of a date element
 * @param {string} elementId - ID of element to update
 * @param {Date} date - Date to display
 */
function updateDateDisplay(elementId, date) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
}
