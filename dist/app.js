import $hJpwG$flatpickr from "flatpickr";




// API configuration for exchange rate service
const $1e090edbfad0295e$var$API_CONFIG = {
    KEY: "f8eb8575dc0df45769f9bc6c",
    BASE_URL: "https://v6.exchangerate-api.com/v6"
};
const $1e090edbfad0295e$export$3a9d962e09421de3 = {
    TAX_RATE: 0.15,
    DEFAULT_EXCHANGE_RATE: 1,
    BASE_PICKUP_FEE: 100.0
};
// Application state management object
const $1e090edbfad0295e$var$state = {
    currentCurrency: "NAD",
    exchangeRate: $1e090edbfad0295e$export$3a9d962e09421de3.DEFAULT_EXCHANGE_RATE
};
function $1e090edbfad0295e$export$c86caf1be068fb8d(price) {
    try {
        // Use Intl.NumberFormat for standardized currency formatting
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: $1e090edbfad0295e$var$state.currentCurrency
        }).format(price * $1e090edbfad0295e$var$state.exchangeRate);
    } catch (error) {
        console.error("Error formatting price:", error);
        // Fallback formatting if Intl.NumberFormat fails
        return `${$1e090edbfad0295e$var$state.currentCurrency} ${price * $1e090edbfad0295e$var$state.exchangeRate}`;
    }
}
function $1e090edbfad0295e$export$50fdfeece43146fd() {
    return {
        currentCurrency: $1e090edbfad0295e$var$state.currentCurrency,
        exchangeRate: $1e090edbfad0295e$var$state.exchangeRate
    };
}
function $1e090edbfad0295e$export$7e3ae17c5b81efe8() {
    // Set NAD as default selected currency
    const nadCurrencyRadio = document.getElementById("currency-nad");
    if (nadCurrencyRadio) nadCurrencyRadio.checked = true;
    $1e090edbfad0295e$var$addEventListeners();
    $1e090edbfad0295e$var$fetchExchangeRate();
    (0, $682918f8353579e8$export$1a76a6d47efc9b3e)();
}
/**
 * Sets up event listeners for vehicle selection and currency changes
 */ function $1e090edbfad0295e$var$addEventListeners() {
    // Add listeners to vehicle selection radio buttons
    document.querySelectorAll('input[name="vehicle"]').forEach((input)=>input.addEventListener("change", (0, $682918f8353579e8$export$1a76a6d47efc9b3e)));
    // Add listeners to currency selection radio buttons
    document.querySelectorAll('input[name="currency-group"]').forEach((input)=>input.addEventListener("change", $1e090edbfad0295e$var$handleCurrencyChange));
}
/**
 * Fetches current exchange rate from API
 * Only fetches if currency is not NAD
 */ async function $1e090edbfad0295e$var$fetchExchangeRate() {
    if ($1e090edbfad0295e$var$state.currentCurrency === "NAD") {
        $1e090edbfad0295e$var$state.exchangeRate = $1e090edbfad0295e$export$3a9d962e09421de3.DEFAULT_EXCHANGE_RATE;
        return;
    }
    try {
        // Fetch exchange rate from API
        const response = await fetch(`${$1e090edbfad0295e$var$API_CONFIG.BASE_URL}/${$1e090edbfad0295e$var$API_CONFIG.KEY}/pair/NAD/${$1e090edbfad0295e$var$state.currentCurrency}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (data.result === "success") $1e090edbfad0295e$var$state.exchangeRate = data.conversion_rate;
        else throw new Error(data.error || "API returned unsuccessful result");
    } catch (error) {
        console.error("Exchange rate fetch failed:", error);
        // Use default exchange rate if fetch fails
        $1e090edbfad0295e$var$state.exchangeRate = $1e090edbfad0295e$export$3a9d962e09421de3.DEFAULT_EXCHANGE_RATE;
    }
}
/**
 * Handles currency change events
 * Updates state and refreshes prices
 * @param {Event} event - Currency change event
 */ async function $1e090edbfad0295e$var$handleCurrencyChange(event) {
    const oldCurrency = $1e090edbfad0295e$var$state.currentCurrency;
    $1e090edbfad0295e$var$state.currentCurrency = event.target.value;
    await $1e090edbfad0295e$var$fetchExchangeRate();
    (0, $682918f8353579e8$export$1a76a6d47efc9b3e)();
}
function $1e090edbfad0295e$export$b1c48fe9bd5d022f() {
    const selectedVehicle = document.querySelector('input[name="vehicle"]:checked');
    const priceElement = document.getElementById("v-price");
    if (!priceElement) return;
    if (selectedVehicle) {
        const nadPrice = parseFloat(selectedVehicle.value);
        const convertedPrice = nadPrice * $1e090edbfad0295e$var$state.exchangeRate;
        $1e090edbfad0295e$var$updatePriceElementValues(priceElement, nadPrice, convertedPrice);
    } else $1e090edbfad0295e$var$clearPriceElement(priceElement);
}
/**
 * Updates price element with NAD and converted values
 * @param {HTMLElement} element - Price display element
 * @param {number} nadPrice - Price in NAD
 * @param {number} convertedPrice - Price in selected currency
 */ function $1e090edbfad0295e$var$updatePriceElementValues(element, nadPrice, convertedPrice) {
    element.dataset.nadValue = nadPrice.toFixed(2);
    element.dataset.convertedValue = convertedPrice.toFixed(2);
    element.textContent = $1e090edbfad0295e$export$c86caf1be068fb8d(nadPrice);
}
/**
 * Clears price element values
 * @param {HTMLElement} element - Price display element to clear
 */ function $1e090edbfad0295e$var$clearPriceElement(element) {
    element.textContent = "-";
    element.removeAttribute("data-nad-value");
    element.removeAttribute("data-converted-value");
}
/**
 * Updates price element and corresponding input field
 * @param {string} elementId - ID of element to update
 * @param {number} value - Price value to set
 */ function $1e090edbfad0295e$var$updatePriceElement(elementId, value) {
    const element = document.getElementById(elementId);
    const inputElement = document.querySelector(`input[name="${elementId}"]`);
    if (element) {
        // Store original NAD value
        element.dataset.nadValue = value.toFixed(2);
        // Calculate and store converted value
        const convertedValue = value * $1e090edbfad0295e$var$state.exchangeRate;
        element.dataset.convertedValue = convertedValue.toFixed(2);
        // Display formatted price
        element.textContent = $1e090edbfad0295e$export$c86caf1be068fb8d(value);
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
 */ function $1e090edbfad0295e$var$getPickupFee() {
    const pickupConfirmation = document.getElementById("pickup-confirmation");
    const pickupFeeElement = document.getElementById("v-price-pickup");
    if (pickupConfirmation && pickupConfirmation.checked) return $1e090edbfad0295e$export$3a9d962e09421de3.BASE_PICKUP_FEE;
    else {
        // Clear pickup fee display if pickup not confirmed
        if (pickupFeeElement) {
            pickupFeeElement.textContent = "-";
            pickupFeeElement.removeAttribute("data-nad-value");
            pickupFeeElement.removeAttribute("data-converted-value");
        }
        return 0.0;
    }
}
function $1e090edbfad0295e$export$cdafcd0add419653() {
    const priceElement = document.getElementById("v-price");
    const durationElement = document.getElementById("v-duration");
    const totalExtrasElement = document.getElementById("v-price-total-extra");
    if (!priceElement || !durationElement || !totalExtrasElement) return;
    // Get base values from elements
    const price = parseFloat(priceElement.dataset.nadValue) || 0;
    const duration = parseInt(durationElement.dataset.value) || 0;
    const totalExtras = parseFloat(totalExtrasElement.dataset.nadValue) || 0;
    const currentPickupFee = $1e090edbfad0295e$var$getPickupFee();
    // Calculate totals
    const subtotal = price * duration;
    const preTaxTotal = subtotal + currentPickupFee + totalExtras;
    const tax = preTaxTotal * $1e090edbfad0295e$export$3a9d962e09421de3.TAX_RATE;
    const subTotal = preTaxTotal + tax;
    // Update all price elements
    $1e090edbfad0295e$var$updatePriceElement("v-price-pickup", currentPickupFee);
    $1e090edbfad0295e$var$updatePriceElement("v-price-total-extra", totalExtras);
    $1e090edbfad0295e$var$updatePriceElement("v-price-tax", tax);
    $1e090edbfad0295e$var$updatePriceElement("v-sub-total", subTotal);
}
function $1e090edbfad0295e$export$83b33c17a49accc1() {
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
    if (locationInputWrapper) locationInputWrapper.value = locationValue;
    // Update pickup fee based on location
    if (pickupFeeElement) {
        if (locationValue) $1e090edbfad0295e$var$updatePriceElement("v-price-pickup", $1e090edbfad0295e$export$3a9d962e09421de3.BASE_PICKUP_FEE);
        else $1e090edbfad0295e$var$clearPriceElement(pickupFeeElement);
    }
    $1e090edbfad0295e$export$cdafcd0add419653();
}
function $1e090edbfad0295e$export$76cc2ce412a00fb9() {
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
        if (pickupFeeElement) $1e090edbfad0295e$var$clearPriceElement(pickupFeeElement);
    } else // Make location required when confirmed
    if (locationInput) {
        locationInput.setAttribute("required", "");
        // If there's an existing value, make sure it's displayed
        if (locationInput.value.trim()) $1e090edbfad0295e$export$83b33c17a49accc1();
    }
    $1e090edbfad0295e$export$cdafcd0add419653();
}
/**
 * Initializes location-related event listeners and handlers
 */ function $1e090edbfad0295e$var$initializeLocationHandlers() {
    const pickupCheckbox = document.getElementById("pickup-confirmation");
    const locationInput = document.getElementById("i-current-location");
    if (pickupCheckbox) {
        pickupCheckbox.addEventListener("change", ()=>{
            $1e090edbfad0295e$export$76cc2ce412a00fb9();
            (0, $682918f8353579e8$export$1a76a6d47efc9b3e)();
        });
        // Initial state setup
        $1e090edbfad0295e$export$76cc2ce412a00fb9();
    }
    if (locationInput) {
        // Use input and change events to catch all changes
        locationInput.addEventListener("input", ()=>{
            $1e090edbfad0295e$export$83b33c17a49accc1();
            (0, $682918f8353579e8$export$1a76a6d47efc9b3e)();
        });
        locationInput.addEventListener("change", ()=>{
            $1e090edbfad0295e$export$83b33c17a49accc1();
            (0, $682918f8353579e8$export$1a76a6d47efc9b3e)();
        });
        // Initial state setup if there's a value
        if (locationInput.value.trim()) $1e090edbfad0295e$export$83b33c17a49accc1();
    }
}
// Update the DOMContentLoaded listener
document.addEventListener("DOMContentLoaded", ()=>{
    $1e090edbfad0295e$var$initializeLocationHandlers();
});
// Add this helper function
function $1e090edbfad0295e$var$logError(message, error = null) {
    console.error(`Pickup Confirmation Error: ${message}`, error);
// Add your error tracking service here if available
}


/**
 * Creates a memoized version of a function to cache results
 * @param {Function} fn - Function to memoize
 * @returns {Function} Memoized function
 */ const $682918f8353579e8$var$memoize = (fn)=>{
    const cache = new Map();
    return (...args)=>{
        const key = JSON.stringify(args);
        if (cache.has(key)) return cache.get(key);
        const result = fn.apply(undefined, args);
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
 */ const $682918f8353579e8$var$calculateDurationDays = $682918f8353579e8$var$memoize((pickupDate, returnDate)=>{
    if (!pickupDate || !returnDate) return 0;
    const durationMs = returnDate.setHours(0, 0, 0, 0) - pickupDate.setHours(0, 0, 0, 0);
    return Math.max(1, Math.ceil(durationMs / 86400000));
});
function $682918f8353579e8$export$1a76a6d47efc9b3e() {
    $682918f8353579e8$var$calculateDuration();
    (0, $1e090edbfad0295e$export$b1c48fe9bd5d022f)();
    (0, $1e090edbfad0295e$export$cdafcd0add419653)();
    $682918f8353579e8$var$updateVehicleName();
    $682918f8353579e8$var$updatePickupLocation();
    $682918f8353579e8$var$updateDateDisplays();
    $682918f8353579e8$var$updateExtras();
    $682918f8353579e8$var$updateDynamicValues();
}
/**
 * Calculates and updates the duration display
 * Updates both display element and hidden input field
 */ function $682918f8353579e8$var$calculateDuration() {
    const pickupDate = (0, $hJpwG$flatpickr)("#datetimes-pickup").selectedDates[0];
    const returnDate = (0, $hJpwG$flatpickr)("#datetimes-return").selectedDates[0];
    const durationElement = document.getElementById("v-duration");
    const durationInput = document.querySelector('input[name="v-duration"]');
    if (!durationElement) {
        console.error("Duration element not found");
        return;
    }
    if (pickupDate && returnDate) {
        // Calculate duration in days
        const durationMs = returnDate.setHours(0, 0, 0, 0) - pickupDate.setHours(0, 0, 0, 0);
        const duration = Math.max(1, Math.ceil(durationMs / 86400000));
        // Update duration display with proper pluralization
        durationElement.textContent = `${duration} ${duration === 1 ? "day" : "days"}`;
        durationElement.dataset.value = duration;
        // Update hidden input field
        if (durationInput) durationInput.value = duration;
    } else {
        // Clear duration if dates are not selected
        durationElement.textContent = "-";
        durationElement.removeAttribute("data-value");
        if (durationInput) durationInput.value = "";
    }
}
/**
 * Updates the vehicle name display based on selected vehicle
 * Updates both display element and hidden input field
 */ function $682918f8353579e8$var$updateVehicleName() {
    const selectedVehicle = document.querySelector('input[name="vehicle"]:checked');
    const vehicleNameElement = document.getElementById("v-vehicle-name");
    const vehicleNameInput = document.querySelector('input[name="v-vehicle-name"]');
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
        if (vehicleNameInput) vehicleNameInput.value = vehicleName;
    } else {
        // Clear vehicle name if none selected
        vehicleNameElement.textContent = "-";
        vehicleNameElement.removeAttribute("data-value");
        if (vehicleNameInput) vehicleNameInput.value = "";
    }
}
function $682918f8353579e8$export$d195321380b53157() {
    const locationInput = document.getElementById("i-current-location");
    if (locationInput) {
        locationInput.addEventListener("input", $682918f8353579e8$var$updatePickupLocation);
        // Initial update
        $682918f8353579e8$var$updatePickupLocation();
    }
}
/**
 * Updates the pickup location display
 * Syncs input value with display element
 */ function $682918f8353579e8$var$updatePickupLocation() {
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
 */ function $682918f8353579e8$var$updateDateDisplays() {
    const pickupPicker = (0, $hJpwG$flatpickr)("#datetimes-pickup");
    const returnPicker = (0, $hJpwG$flatpickr)("#datetimes-return");
    if (pickupPicker && returnPicker) {
        // Get selected dates or use defaults
        const pickupDate = pickupPicker.selectedDates[0] || pickupPicker.latestSelectedDateObj || new Date();
        const returnDate = returnPicker.selectedDates[0] || returnPicker.latestSelectedDateObj || new Date(pickupDate.getTime() + 432000000); // Default 5 days rental
        // Update date displays
        $682918f8353579e8$var$updateDateElement("v-date-pickup", pickupDate);
        $682918f8353579e8$var$updateDateElement("v-date-return", returnDate);
        // Initialize pickers with default dates if not set
        if (!pickupPicker.selectedDates.length) pickupPicker.setDate(pickupDate);
        if (!returnPicker.selectedDates.length) returnPicker.setDate(returnDate);
    }
}
/**
 * Updates a date element with formatted date string
 * @param {string} elementId - ID of the element to update
 * @param {Date} date - Date object to format and display
 */ function $682918f8353579e8$var$updateDateElement(elementId, date) {
    const element = document.getElementById(elementId);
    if (element) {
        if (date) {
            // Format date with time for display
            const formattedDate = date.toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric"
            });
            element.textContent = formattedDate;
            // Store date without time in dataset
            element.dataset.value = date.toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
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
 */ function $682918f8353579e8$var$updateDynamicValues() {
    document.querySelectorAll('[id^="v-"]').forEach((element)=>{
        const value = element.dataset.value;
        if (value) element.textContent = value;
    });
}
/**
 * Updates pricing for all extra items and calculates total extras
 * Handles checkbox states, quantities, and price calculations
 */ function $682918f8353579e8$var$updateExtras() {
    // Configuration for extra items
    const extras = [
        {
            checkbox: "extra_0",
            price: "v-price-extra_0",
            quantity: "extra-quantity_0",
            basePrice: 120.0
        },
        {
            checkbox: "extra_2",
            price: "v-price-extra_2",
            quantity: "extra-quantity_2",
            basePrice: 165.0
        },
        {
            checkbox: "extra_3",
            price: "v-price-extra_3",
            quantity: "extra-quantity_3",
            basePrice: 220.0
        },
        {
            checkbox: "extra_4",
            price: "v-price-extra_4",
            quantity: "extra-quantity_4",
            basePrice: 1100.0
        }
    ];
    let totalExtras = 0;
    const defaultQuantity = 1;
    const maxQuantity = 5;
    // Process each extra item
    extras.forEach((extra)=>{
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
                const quantity = Math.min(Math.max(parseInt(quantityInput.value) || defaultQuantity, 1), maxQuantity);
                quantityInput.value = quantity;
                // Calculate price for this extra
                const nadPrice = extra.basePrice * quantity;
                // Update price element with NAD and converted values
                priceElement.dataset.nadValue = nadPrice.toFixed(2);
                priceElement.dataset.convertedValue = (nadPrice * (0, $1e090edbfad0295e$export$50fdfeece43146fd)().exchangeRate).toFixed(2);
                priceElement.textContent = (0, $1e090edbfad0295e$export$c86caf1be068fb8d)(nadPrice);
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
        totalExtrasElement.dataset.convertedValue = (totalExtras * (0, $1e090edbfad0295e$export$50fdfeece43146fd)().exchangeRate).toFixed(2);
        totalExtrasElement.textContent = (0, $1e090edbfad0295e$export$c86caf1be068fb8d)(totalExtras);
    }
}
function $682918f8353579e8$export$e89033f238588fc3() {
    // Add listeners to all input and select elements
    document.querySelectorAll("input, select").forEach((input)=>{
        if (input.id !== "pickup-error-wrapper") {
            input.addEventListener("change", $682918f8353579e8$export$1a76a6d47efc9b3e);
            if (input.type !== "checkbox" && input.type !== "radio") input.addEventListener("input", $682918f8353579e8$export$1a76a6d47efc9b3e);
        }
    });
    // Initialize extra item handlers
    [
        "extra_0",
        "extra_2",
        "extra_3",
        "extra_4"
    ].forEach((id)=>{
        const checkbox = document.getElementById(id);
        const quantityInput = document.getElementById(`extra-quantity_${id.slice(-1)}`);
        if (checkbox && quantityInput) {
            // Handle checkbox changes
            checkbox.addEventListener("change", ()=>{
                quantityInput.disabled = !checkbox.checked;
                quantityInput.value = checkbox.checked ? "1" : "";
                $682918f8353579e8$export$1a76a6d47efc9b3e();
            });
            // Handle quantity input changes
            quantityInput.addEventListener("input", ()=>{
                let value = parseInt(quantityInput.value) || 1;
                value = Math.min(Math.max(value, 1), 5);
                quantityInput.value = value;
                $682918f8353579e8$export$1a76a6d47efc9b3e();
            });
        }
    });
    // Initialize location input handlers
    const currentLocationInput = document.getElementById("pickup-error-wrapper");
    if (currentLocationInput) currentLocationInput.addEventListener("input", $682918f8353579e8$var$updatePickupLocation);
    // Initialize pickup confirmation handler
    const pickupConfirmation = document.getElementById("pickup-confirmation");
    if (pickupConfirmation) {
        pickupConfirmation.addEventListener("change", ()=>{
            (0, $1e090edbfad0295e$export$76cc2ce412a00fb9)();
            $682918f8353579e8$export$1a76a6d47efc9b3e();
        });
        (0, $1e090edbfad0295e$export$76cc2ce412a00fb9)();
    }
    // Initialize location input handler
    const locationInput = document.getElementById("current-location-2");
    if (locationInput) {
        locationInput.addEventListener("input", ()=>{
            (0, $1e090edbfad0295e$export$76cc2ce412a00fb9)();
            $682918f8353579e8$export$1a76a6d47efc9b3e();
        });
        (0, $1e090edbfad0295e$export$76cc2ce412a00fb9)();
    }
}
function $682918f8353579e8$export$98d932a433ebf613() {
    $682918f8353579e8$var$updateDateDisplays();
    $682918f8353579e8$export$1a76a6d47efc9b3e();
    $682918f8353579e8$export$e89033f238588fc3();
}
/**
 * Safe wrapper for updateBookingDetails with error handling
 * Catches and logs errors to prevent UI crashes
 */ function $682918f8353579e8$var$safeUpdateBookingDetails() {
    try {
        $682918f8353579e8$var$calculateDuration();
        (0, $1e090edbfad0295e$export$b1c48fe9bd5d022f)();
        (0, $1e090edbfad0295e$export$cdafcd0add419653)();
        $682918f8353579e8$var$updateVehicleName();
        $682918f8353579e8$var$updatePickupLocation();
        $682918f8353579e8$var$updateDateDisplays();
        $682918f8353579e8$var$updateExtras();
        $682918f8353579e8$var$updateDynamicValues();
    } catch (error) {
        console.error("Error updating booking details:", error);
    // Implement fallback behavior or user notification
    }
}


let $2dd5f9dccafe7e70$var$pickupPicker, $2dd5f9dccafe7e70$var$returnPicker;
function $2dd5f9dccafe7e70$export$de01a5d2298a9bfb() {
    const today = new Date();
    const fiveDaysLater = new Date(today);
    fiveDaysLater.setDate(today.getDate() + 5);
    const commonConfig = {
        enableTime: false,
        dateFormat: "Y-m-d",
        minDate: "today",
        disable: [
            (date)=>date < today
        ],
        onChange: (0, $682918f8353579e8$export$1a76a6d47efc9b3e)
    };
    $2dd5f9dccafe7e70$var$pickupPicker = $2dd5f9dccafe7e70$var$createDatePicker("#datetimes-pickup", {
        ...commonConfig,
        defaultDate: today,
        onClose: $2dd5f9dccafe7e70$var$handlePickupDateClose
    });
    $2dd5f9dccafe7e70$var$returnPicker = $2dd5f9dccafe7e70$var$createDatePicker("#datetimes-return", {
        ...commonConfig,
        defaultDate: fiveDaysLater,
        minDate: fiveDaysLater,
        onClose: (0, $682918f8353579e8$export$1a76a6d47efc9b3e)
    });
    $2dd5f9dccafe7e70$var$pickupPicker.setDate(today);
    $2dd5f9dccafe7e70$var$returnPicker.setDate(fiveDaysLater);
    (0, $682918f8353579e8$export$1a76a6d47efc9b3e)();
}
/**
 * Creates a date picker instance with input validation
 * @param {string} selector - CSS selector for the input element
 * @param {Object} config - Configuration options for flatpickr
 * @returns {Object} Configured flatpickr instance
 */ function $2dd5f9dccafe7e70$var$createDatePicker(selector, config) {
    const picker = (0, $hJpwG$flatpickr)(selector, config);
    const input = document.querySelector(selector);
    input.addEventListener("input", ()=>$2dd5f9dccafe7e70$var$validateManualDateInput(input, picker));
    return picker;
}
/**
 * Handles closing of pickup date picker
 * Updates return date minimum based on selected pickup date
 * @param {Array} selectedDates - Array of selected dates from flatpickr
 */ function $2dd5f9dccafe7e70$var$handlePickupDateClose(selectedDates) {
    if (selectedDates[0]) {
        const minReturnDate = new Date(selectedDates[0]);
        minReturnDate.setDate(minReturnDate.getDate() + 1);
        $2dd5f9dccafe7e70$var$returnPicker.set("minDate", minReturnDate);
        if ($2dd5f9dccafe7e70$var$returnPicker.selectedDates[0] && $2dd5f9dccafe7e70$var$returnPicker.selectedDates[0] < minReturnDate) $2dd5f9dccafe7e70$var$returnPicker.setDate(minReturnDate);
    }
    (0, $682918f8353579e8$export$1a76a6d47efc9b3e)();
}
/**
 * Validates manually entered dates
 * Ensures dates are in correct format and not in the past
 * @param {HTMLElement} input - Date input element
 * @param {Object} picker - Flatpickr instance
 */ function $2dd5f9dccafe7e70$var$validateManualDateInput(input, picker) {
    const dateValue = input.value;
    const parsedDate = (0, $hJpwG$flatpickr).parseDate(dateValue, "Y-m-d");
    if (parsedDate && parsedDate >= new Date()) picker.setDate(parsedDate);
    else {
        input.value = "";
        alert("Please enter a valid date in YYYY-MM-DD format, not earlier than today.");
    }
}
/**
 * Updates the display of a date element
 * @param {string} elementId - ID of element to update
 * @param {Date} date - Date to display
 */ function $2dd5f9dccafe7e70$var$updateDateDisplay(elementId, date) {
    const element = document.getElementById(elementId);
    if (element) element.textContent = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}


/**
 * Initializes form validation
 * Sets up event listeners for real-time validation
 */ function $157e9ba0b1ce1572$export$b67d05e9c9fe4b31() {
    const form = document.getElementById("email-form");
    if (!form) return;
    // Create debounced validation function to prevent excessive validation
    const debouncedValidation = $157e9ba0b1ce1572$var$debounce((field)=>{
        if (field.value.trim()) {
            if (field.type === "email" && !$157e9ba0b1ce1572$var$isValidEmail(field.value)) $157e9ba0b1ce1572$var$showError(field, "Please enter a valid email address");
            else $157e9ba0b1ce1572$var$clearError(field);
        }
    }, 300);
    // Add real-time validation for all form fields
    form.querySelectorAll("input, select, textarea").forEach((field)=>{
        field.addEventListener("input", ()=>debouncedValidation(field));
    });
    // Add submit handler
    form.addEventListener("submit", function(event) {
        if (!$157e9ba0b1ce1572$var$validateForm()) event.preventDefault();
    });
}
/**
 * Validates the entire form before submission
 * Checks required fields and email format
 * @returns {boolean} True if form is valid, false otherwise
 */ function $157e9ba0b1ce1572$var$validateForm() {
    let isValid = true;
    const errors = new Map();
    const requiredFields = document.querySelectorAll("[required]");
    // Check all required fields
    requiredFields.forEach((field)=>{
        if (!field.value.trim()) {
            isValid = false;
            errors.set(field, "This field is required");
        }
    });
    // Special validation for email field
    const emailField = document.getElementById("email");
    if (emailField && emailField.value && !$157e9ba0b1ce1572$var$isValidEmail(emailField.value)) {
        isValid = false;
        errors.set(emailField, "Please enter a valid email address");
    }
    // Clear all previous errors first
    requiredFields.forEach($157e9ba0b1ce1572$var$clearError);
    // Show new errors
    errors.forEach((message, field)=>$157e9ba0b1ce1572$var$showError(field, message));
    return isValid;
}
// Regular expression for email validation
const $157e9ba0b1ce1572$var$EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
/**
 * Validates email format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if email is valid, false otherwise
 */ function $157e9ba0b1ce1572$var$isValidEmail(email) {
    return $157e9ba0b1ce1572$var$EMAIL_REGEX.test(email);
}
/**
 * Shows error message for a field
 * @param {HTMLElement} field - Form field with error
 * @param {string} message - Error message to display
 */ function $157e9ba0b1ce1572$var$showError(field, message) {
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
 */ function $157e9ba0b1ce1572$var$clearError(field) {
    const errorElement = field.nextElementSibling;
    if (errorElement && errorElement.classList.contains("error-message")) errorElement.textContent = "";
    field.classList.remove("error");
}
/**
 * Creates a debounced function that delays invoking func
 * @param {Function} func - Function to debounce
 * @param {number} wait - Milliseconds to wait before invoking
 * @returns {Function} Debounced function
 */ function $157e9ba0b1ce1572$var$debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = ()=>{
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}




"use strict";
window.Webflow ||= [];
window.Webflow.push(()=>{
    (0, $2dd5f9dccafe7e70$export$de01a5d2298a9bfb)();
    (0, $682918f8353579e8$export$98d932a433ebf613)();
    (0, $157e9ba0b1ce1572$export$b67d05e9c9fe4b31)();
    (0, $1e090edbfad0295e$export$7e3ae17c5b81efe8)();
});


//# sourceMappingURL=app.js.map
