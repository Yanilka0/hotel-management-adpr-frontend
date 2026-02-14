/**
 * Booking Cost Calculator
 * Reusable calculation logic for booking cost estimation
 */

// Pricing structure
const PRICING = {
    roomTypes: {
        'Normal': 1000,
        'Semi Luxury': 2000,
        'Luxury': 5000
    },
    bedTypes: {
        'Single': 1000,
        'Double': 2000,
        'King': 3000
    },
    breakfast: {
        'Include': 1000,
        'Exclude': 0
    }
};

// Room type display names
const ROOM_TYPE_NAMES = {
    'Normal': 'Ordinary Room',
    'Semi Luxury': 'Semi Luxury',
    'Luxury': 'Luxury'
};

/**
 * Calculate the duration in days between two dates
 * @param {string} checkInDate - Check-in date (YYYY-MM-DD format)
 * @param {string} checkOutDate - Check-out date (YYYY-MM-DD format)
 * @returns {number} Duration in days (0 if invalid)
 */
function calculateDuration(checkInDate, checkOutDate) {
    if (!checkInDate || !checkOutDate) {
        return 0;
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const durationTime = checkOut - checkIn;
    return Math.max(0, Math.ceil(durationTime / (1000 * 60 * 60 * 24)));
}

/**
 * Calculate the total booking cost
 * Formula: (Room + Bed + Breakfast) × People × Days
 * @param {Object} params - Calculation parameters
 * @param {string} params.roomType - Room type (Normal, Semi Luxury, Luxury)
 * @param {string} params.bedType - Bed type (Single, Double, King)
 * @param {string} params.breakfast - Breakfast plan (Include, Exclude)
 * @param {number} params.peopleCount - Number of people
 * @param {string} params.checkInDate - Check-in date
 * @param {string} params.checkOutDate - Check-out date
 * @returns {Object} Calculation result with breakdown
 */
function calculateBookingCost(params) {
    const {
        roomType = 'Normal',
        bedType = 'Single',
        breakfast = 'Include',
        peopleCount = 1,
        checkInDate = '',
        checkOutDate = ''
    } = params;

    // Get individual prices
    const roomPrice = PRICING.roomTypes[roomType] || 1000;
    const bedPrice = PRICING.bedTypes[bedType] || 1000;
    const breakfastPrice = PRICING.breakfast[breakfast] !== undefined ? PRICING.breakfast[breakfast] : 1000;

    // Calculate duration
    const duration = calculateDuration(checkInDate, checkOutDate);

    // Calculate total: (Room + Bed + Breakfast) × People × Days
    const basePrice = roomPrice + bedPrice + breakfastPrice;
    const totalCost = basePrice * peopleCount * duration;

    return {
        roomPrice,
        bedPrice,
        breakfastPrice,
        basePrice,
        peopleCount,
        duration,
        totalCost
    };
}

/**
 * Update the live calculation display on the page
 * @param {string} formId - ID of the form element
 */
function updateLiveCalculation(formId = 'booking-form') {
    const form = document.getElementById(formId);
    if (!form) {
        console.error(`Form with ID "${formId}" not found`);
        return;
    }

    // Get form values
    const params = {
        roomType: form.elements.roomType?.value || 'Normal',
        bedType: form.elements.bedType?.value || 'Single',
        breakfast: form.elements.breakfast?.value || 'Include',
        peopleCount: parseInt(form.elements.peopleCount?.value) || 1,
        checkInDate: form.elements.checkInDate?.value || '',
        checkOutDate: form.elements.checkOutDate?.value || ''
    };

    // Calculate costs
    const result = calculateBookingCost(params);

    // Update display elements
    const roomTypeDisplay = document.getElementById('calc-room-type');
    const bedTypeDisplay = document.getElementById('calc-bed-type');
    const breakfastDisplay = document.getElementById('calc-breakfast');
    const peopleDisplay = document.getElementById('calc-people');
    const durationDisplay = document.getElementById('calc-duration');
    const totalDisplay = document.getElementById('calc-total');

    if (roomTypeDisplay) {
        roomTypeDisplay.textContent =
            `${ROOM_TYPE_NAMES[params.roomType] || 'Ordinary Room'} (Rs ${result.roomPrice.toLocaleString()})`;
    }

    if (bedTypeDisplay) {
        bedTypeDisplay.textContent =
            `${params.bedType} (Rs ${result.bedPrice.toLocaleString()})`;
    }

    if (breakfastDisplay) {
        breakfastDisplay.textContent =
            `${params.breakfast} (Rs ${result.breakfastPrice.toLocaleString()})`;
    }

    if (peopleDisplay) {
        peopleDisplay.textContent = result.peopleCount;
    }

    if (durationDisplay) {
        durationDisplay.textContent =
            `${result.duration} ${result.duration === 1 ? 'day' : 'days'}`;
    }

    if (totalDisplay) {
        totalDisplay.textContent = `Rs ${result.totalCost.toLocaleString()}`;
    }
}

/**
 * Initialize live calculation event listeners
 * @param {string} formId - ID of the form element
 */
function initializeLiveCalculation(formId = 'booking-form') {
    const form = document.getElementById(formId);
    if (!form) {
        console.error(`Form with ID "${formId}" not found`);
        return;
    }

    // Add event listeners for live calculation
    const roomTypeField = form.elements.roomType;
    const peopleCountField = form.elements.peopleCount;
    const checkInField = form.elements.checkInDate;
    const checkOutField = form.elements.checkOutDate;

    if (roomTypeField) {
        roomTypeField.addEventListener('change', () => updateLiveCalculation(formId));
    }

    if (peopleCountField) {
        peopleCountField.addEventListener('input', () => updateLiveCalculation(formId));
    }

    if (checkInField) {
        checkInField.addEventListener('change', () => updateLiveCalculation(formId));
    }

    if (checkOutField) {
        checkOutField.addEventListener('change', () => updateLiveCalculation(formId));
    }

    // Initial calculation
    updateLiveCalculation(formId);
}
