// Global state for Model 2
let bookingData = {
    customerInfo: {
        name: '',
        whatsapp: '',
        email: ''
    },
    date: null,
    diningTime: '19:00',
    chefArrivalTime: null,
    adults: 4,
    children5to10: 0,
    children0to4: 0,
    cuisine: null,
    menuType: 'normal', // 'normal' = 3 hours cooking, 'extended' = 4 hours cooking
    specialRequests: ''
};

let currentSlide = 1;
const totalSlides = 6;

const stepLabels = ['Contact', 'Date & Time', 'Guests', 'Cuisine', 'Service', 'Summary'];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeDatePicker();
    initializeTimeSlots();
    initializeEventListeners();
    renderCuisineCards();
    updateProgress();
    updateTotalGuests();
    showSlide(1); // Initialize navigation buttons
});

// Date Picker
function initializeDatePicker() {
    const dateInput = document.getElementById('booking-date');
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 3); // Minimum 3 days advance
    dateInput.min = minDate.toISOString().split('T')[0];
    
    const dateWrapper = document.querySelector('.date-input-wrapper');
    if (dateWrapper) {
        dateWrapper.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            dateInput.focus();
            if (dateInput.showPicker) {
                try {
                    dateInput.showPicker();
                } catch (err) {
                    dateInput.click();
                }
            } else {
                dateInput.click();
            }
        });
    }
    
    dateInput.addEventListener('change', function() {
        bookingData.date = this.value;
        updateDateDisplay();
        calculateChefSchedule();
    });
    
    dateInput.addEventListener('input', function() {
        bookingData.date = this.value;
        updateDateDisplay();
        calculateChefSchedule();
    });
}

function updateDateDisplay() {
    if (bookingData.date) {
        const date = new Date(bookingData.date);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formatted = date.toLocaleDateString('en-US', options);
        document.getElementById('date-display').textContent = formatted;
    }
}

// Time Slots
function initializeTimeSlots() {
    const timeSelect = document.getElementById('dining-time');
    const slots = generateTimeSlots();
    
    slots.forEach(slot => {
        const option = document.createElement('option');
        option.value = slot;
        option.textContent = formatTimeDisplay(slot);
        if (slot === bookingData.diningTime) {
            option.selected = true;
        }
        timeSelect.appendChild(option);
    });
    
    timeSelect.addEventListener('change', function() {
        bookingData.diningTime = this.value;
        calculateChefSchedule();
    });
}

function formatTimeDisplay(time) {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
}

// Calculate Chef Schedule
function calculateChefSchedule() {
    if (!bookingData.date || !bookingData.diningTime) return;
    
    const [hours, minutes] = bookingData.diningTime.split(':');
    const diningDate = new Date(bookingData.date);
    diningDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    // Chef arrives 4 hours before dining time
    const arrivalDate = new Date(diningDate.getTime() - (4 * 60 * 60 * 1000));
    
    const arrivalTime = formatTime(arrivalDate);
    bookingData.chefArrivalTime = arrivalTime;
    
    // Update schedule info
    if (document.getElementById('chef-schedule-info')) {
        const consultationEnd = new Date(arrivalDate.getTime() + (30 * 60 * 1000));
        const shoppingEnd = new Date(arrivalDate.getTime() + (2.5 * 60 * 60 * 1000)); // 30 min consultation + 2 hours shopping
        const cookingStart = shoppingEnd;
        
        document.getElementById('chef-schedule-info').innerHTML = `
            Your selected time: ${formatTimeDisplay(bookingData.diningTime)}<br>
            Chef arrives approximately: ${formatTimeDisplay(arrivalTime)} (4 hours before)<br><br>
            The chef will:<br>
            • Arrive 4 hours before your dining time<br>
            • Meet with you for consultation and go shopping<br>
            • Return and prepare your meal<br>
            • Serve at your chosen dining time
        `;
    }
    
    updateTimeline();
}

function formatTime(date) {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}

function updateTimeline() {
    if (!bookingData.chefArrivalTime) return;
    
    const [arrivalHour, arrivalMin] = bookingData.chefArrivalTime.split(':');
    const arrival = parseInt(arrivalHour) * 60 + parseInt(arrivalMin);
    
    // Chef arrives 4 hours before, so we fit consultation, shopping, and cooking within 4 hours
    // Timeline: 30 min consultation, 2 hours shopping, 1.5 hours cooking
    const consultationEnd = arrival + 30; // 30 minutes
    const shoppingEnd = arrival + (2.5 * 60); // 30 min consultation + 2 hours shopping = 2.5 hours total
    const cookingEnd = arrival + (4 * 60); // Total 4 hours before dining
    
    const formatTimeFromMinutes = (mins) => {
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    };
    
    if (document.getElementById('timeline-arrival')) {
        document.getElementById('timeline-arrival').textContent = `${formatTimeFromMinutes(arrival)} - Chef Arrives`;
    }
    if (document.getElementById('timeline-consultation')) {
        document.getElementById('timeline-consultation').textContent = `${formatTimeFromMinutes(arrival)} - ${formatTimeFromMinutes(consultationEnd)}\nPersonal Consultation (20-30 min)`;
    }
    if (document.getElementById('timeline-shopping')) {
        document.getElementById('timeline-shopping').textContent = `${formatTimeFromMinutes(consultationEnd)} - ${formatTimeFromMinutes(shoppingEnd)}\nGrocery Shopping (2 hours)`;
    }
    if (document.getElementById('timeline-cooking')) {
        document.getElementById('timeline-cooking').textContent = `${formatTimeFromMinutes(shoppingEnd)} - ${formatTimeFromMinutes(cookingEnd)}\nCooking & Preparation (1.5 hours)`;
    }
    if (document.getElementById('timeline-serving')) {
        document.getElementById('timeline-serving').textContent = `${formatTimeDisplay(bookingData.diningTime)} - Your Dining Experience`;
    }
}

// Event Listeners
function initializeEventListeners() {
    // Navigation
    document.getElementById('next-btn').addEventListener('click', nextSlide);
    document.getElementById('back-btn').addEventListener('click', prevSlide);
    
    // Slide 3: Guest Count
    setupQuantityButtons('adults', 'adults-value', 'adults-minus', 'adults-plus', 1);
    setupQuantityButtons('children5to10', 'children5to10-value', 'children5to10-minus', 'children5to10-plus', 0);
    setupQuantityButtons('children0to4', 'children0to4-value', 'children0to4-minus', 'children0to4-plus', 0);
    
    // Menu type selection
    document.querySelectorAll('.menu-type-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.menu-type-option').forEach(o => o.classList.remove('active'));
            this.classList.add('active');
            bookingData.menuType = this.dataset.menutype;
            updateChefServiceDetails();
            updatePricingSummary();
            calculateChefSchedule();
        });
    });
}

function setupQuantityButtons(key, valueId, minusId, plusId, min) {
    const minusBtn = document.getElementById(minusId);
    const plusBtn = document.getElementById(plusId);
    const valueEl = document.getElementById(valueId);
    
    if (!minusBtn || !plusBtn || !valueEl) return;
    
    minusBtn.addEventListener('click', function() {
        let value = parseInt(valueEl.textContent) || 0;
        if (value > min) {
            value--;
            valueEl.textContent = value;
            bookingData[key] = value;
            updateTotalGuests();
            updatePricingSummary();
        }
    });
    
    plusBtn.addEventListener('click', function() {
        let value = parseInt(valueEl.textContent) || 0;
        value++;
        valueEl.textContent = value;
        bookingData[key] = value;
        updateTotalGuests();
        updatePricingSummary();
    });
}

// Cuisine Cards
function renderCuisineCards() {
    const container = document.getElementById('cuisine-cards');
    if (!container) return;
    
    container.innerHTML = '';
    
    Object.keys(CUISINE_OPTIONS).forEach((key, index) => {
        const cuisine = CUISINE_OPTIONS[key];
        const card = document.createElement('div');
        card.className = 'cuisine-card' + (index === 0 ? ' active' : '');
        card.dataset.cuisine = key;
        
        card.innerHTML = `
            <div class="cuisine-checkmark">✓</div>
            <div class="cuisine-icon">${cuisine.icon}</div>
            <div class="cuisine-name">${cuisine.name}</div>
            <div class="cuisine-desc">${cuisine.chefRequirement}</div>
            <div class="cuisine-specialties">
                <div class="specialty-title">Specialties include:</div>
                ${cuisine.specialties.map(s => `<div class="specialty-item">• ${s}</div>`).join('')}
            </div>
            <div class="chef-badge">⭐ Chef Specialized</div>
        `;
        
        card.addEventListener('click', function() {
            document.querySelectorAll('.cuisine-card').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            bookingData.cuisine = key;
            updatePricingSummary();
        });
        
        container.appendChild(card);
    });
    
    // Set default
    if (!bookingData.cuisine) {
        bookingData.cuisine = Object.keys(CUISINE_OPTIONS)[0];
    }
}

// Navigation
function nextSlide() {
    if (validateCurrentSlide()) {
        if (currentSlide < totalSlides) {
            currentSlide++;
            showSlide(currentSlide);
            updateProgress();
            
            // Special handling for specific slides
            if (currentSlide === 5) {
                updateScheduleSummary();
                updateChefServiceDetails();
            } else if (currentSlide === 6) {
                updateBookingSummary();
                updatePricingSummary();
            }
        }
    }
}

function prevSlide() {
    if (currentSlide > 1) {
        currentSlide--;
        showSlide(currentSlide);
        updateProgress();
    }
}

function showSlide(slideNumber) {
    document.querySelectorAll('.slide').forEach(slide => {
        slide.classList.remove('active');
    });
    
    const targetSlide = document.querySelector(`.slide[data-slide="${slideNumber}"]`);
    if (targetSlide) {
        targetSlide.classList.add('active');
    }
    
    // Update navigation buttons
    document.getElementById('back-btn').style.display = slideNumber === 1 ? 'none' : 'flex';
    document.getElementById('back-to-models').style.display = slideNumber === 1 ? 'flex' : 'none';
    
    if (slideNumber === totalSlides) {
        document.getElementById('next-btn').innerHTML = '<span>Confirm Booking</span><span class="btn-icon">→</span>';
    } else {
        document.getElementById('next-btn').innerHTML = '<span>Continue</span><span class="btn-icon">→</span>';
    }
}

// Validation
function validateCurrentSlide() {
    switch (currentSlide) {
        case 1:
            const name = document.getElementById('customer-name').value.trim();
            const whatsapp = document.getElementById('customer-whatsapp').value.trim();
            const email = document.getElementById('customer-email').value.trim();
            
            if (!name || name.length < 2) {
                alert('Please enter a valid name (at least 2 characters)');
                return false;
            }
            
            if (!whatsapp || whatsapp.length < 5) {
                alert('Please enter a valid phone number');
                return false;
            }
            
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                alert('Please enter a valid email address');
                return false;
            }
            
            bookingData.customerInfo.name = name;
            bookingData.customerInfo.whatsapp = whatsapp;
            bookingData.customerInfo.email = email;
            return true;
            
        case 2:
            if (!bookingData.date) {
                alert('Please select a date (minimum 3 days in advance)');
                return false;
            }
            
            const selectedDate = new Date(bookingData.date);
            const today = new Date();
            const minDate = new Date(today);
            minDate.setDate(today.getDate() + 3);
            
            if (selectedDate < minDate) {
                alert('Please book at least 3 days in advance');
                return false;
            }
            
            if (!bookingData.diningTime) {
                alert('Please select a dining time');
                return false;
            }
            
            calculateChefSchedule();
            return true;
            
        case 3:
            if (bookingData.adults < 1) {
                alert('At least 1 adult is required');
                return false;
            }
            return true;
            
        case 4:
            if (!bookingData.cuisine) {
                alert('Please select a cuisine');
                return false;
            }
            return true;
            
        case 5:
            if (!document.getElementById('service-understood').checked) {
                alert('Please confirm that you understand how the service works');
                return false;
            }
            return true;
            
        case 6:
            if (!document.getElementById('pricing-understood').checked) {
                alert('Please confirm that you understand the pricing structure');
                return false;
            }
            bookingData.specialRequests = document.getElementById('special-requests').value.trim();
            return true;
            
        default:
            return true;
    }
}

// Progress
function updateProgress() {
    document.getElementById('current-slide').textContent = currentSlide;
    document.getElementById('step-label').textContent = stepLabels[currentSlide - 1];
    
    document.querySelectorAll('.step-indicator').forEach((indicator, index) => {
        const stepNum = index + 1;
        indicator.classList.remove('active', 'completed');
        
        if (stepNum < currentSlide) {
            indicator.classList.add('completed');
        } else if (stepNum === currentSlide) {
            indicator.classList.add('active');
        }
    });
}

// Total Guests
function updateTotalGuests() {
    const total = bookingData.adults + bookingData.children5to10 + bookingData.children0to4;
    const totalEl = document.getElementById('total-guests');
    if (totalEl) {
        totalEl.textContent = `${total} ${total === 1 ? 'person' : 'persons'}`;
    }
}

// Schedule Summary
function updateScheduleSummary() {
    const container = document.getElementById('schedule-summary');
    if (!container) return;
    
    if (bookingData.date && bookingData.diningTime && bookingData.chefArrivalTime) {
        const date = new Date(bookingData.date);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', options);
        
        container.innerHTML = `
            <h4>📅 Your Selected Schedule:</h4>
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Your dining time:</strong> ${formatTimeDisplay(bookingData.diningTime)}</p>
            <p><strong>Chef arrival:</strong> ${formatTimeDisplay(bookingData.chefArrivalTime)} (4 hours before)</p>
        `;
    }
}

// Chef Service Details - Fixed 4 hours total
function updateChefServiceDetails() {
    const totalHours = 4; // Chef arrives 4 hours before dining
    const totalCost = totalHours * SERVICE_CONFIG.hourlyRate;
    
    const detailsEl = document.getElementById('chef-service-details');
    if (detailsEl) {
        detailsEl.textContent = `${totalHours} hours × Rp ${SERVICE_CONFIG.hourlyRate.toLocaleString('id-ID')}/hour = Rp ${totalCost.toLocaleString('id-ID')}`;
    }
    
    // Update pricing includes text
    const includesEl = document.getElementById('pricing-includes-text');
    if (includesEl) {
        includesEl.innerHTML = `
            This covers:<br>
            • Chef's expertise and time<br>
            • Consultation (30 minutes)<br>
            • Shopping (2 hours)<br>
            • Cooking (1.5 hours)<br>
            • Equipment and tools<br>
            • Kitchen cleanup
        `;
    }
}

// Booking Summary
function updateBookingSummary() {
    const container = document.getElementById('booking-details-summary');
    if (!container) return;
    
    const date = bookingData.date ? new Date(bookingData.date) : null;
    const formattedDate = date ? date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Not selected';
    
    const cuisine = bookingData.cuisine ? CUISINE_OPTIONS[bookingData.cuisine] : null;
    
    container.innerHTML = `
        <p><strong>Customer:</strong> ${bookingData.customerInfo.name || 'Not provided'}</p>
        <p><strong>WhatsApp:</strong> ${bookingData.customerInfo.whatsapp || 'Not provided'}</p>
        <p><strong>Email:</strong> ${bookingData.customerInfo.email || 'Not provided'}</p>
        <p><strong>Date:</strong> ${formattedDate}</p>
        <p><strong>Dining Time:</strong> ${formatTimeDisplay(bookingData.diningTime)}</p>
        <p><strong>Cuisine:</strong> ${cuisine ? cuisine.name : 'Not selected'}</p>
        <p><strong>Chef Specialization:</strong> ${cuisine ? cuisine.chefRequirement : 'N/A'}</p>
        <p><strong>Guests:</strong></p>
        <ul style="margin-left: 20px; margin-top: 8px;">
            <li>${bookingData.adults} Adults (11+ years)</li>
            ${bookingData.children5to10 > 0 ? `<li>${bookingData.children5to10} Children (5-10 years)</li>` : ''}
            ${bookingData.children0to4 > 0 ? `<li>${bookingData.children0to4} Young Child (0-4 years)</li>` : ''}
        </ul>
    `;
}

// Pricing Summary
function updatePricingSummary() {
    const container = document.getElementById('pricing-breakdown');
    if (!container) return;
    
    // Fixed 4 hours total
    const totalHours = 4;
    const chefServiceCost = totalHours * SERVICE_CONFIG.hourlyRate;
    
    // Calculate paying guests for ingredients
    const payingPortions = bookingData.adults + (bookingData.children5to10 * 0.5);
    
    // Get ingredient cost estimates based on cuisine
    const cuisine = bookingData.cuisine ? CUISINE_OPTIONS[bookingData.cuisine] : CUISINE_OPTIONS.indonesian;
    const ingredientCosts = cuisine.typicalIngredientCost;
    
    const budgetIngredient = payingPortions * ingredientCosts.perPersonBudget;
    const midRangeIngredient = payingPortions * ingredientCosts.perPersonMidRange;
    const premiumIngredient = payingPortions * ingredientCosts.perPersonPremium;
    
    const totalMin = chefServiceCost + budgetIngredient;
    const totalMax = chefServiceCost + premiumIngredient;
    
    container.innerHTML = `
        <div class="pricing-breakdown-box">
            <h4>CHEF SERVICE (Fixed Cost)</h4>
            <p>${totalHours} hours of chef service</p>
            <p>${totalHours} × Rp ${SERVICE_CONFIG.hourlyRate.toLocaleString('id-ID')} = <strong>Rp ${chefServiceCost.toLocaleString('id-ID')}</strong></p>
            <p style="margin-top: 15px;">Includes:</p>
            <ul style="margin-left: 20px; margin-top: 8px;">
                <li>Consultation (30 minutes)</li>
                <li>Shopping (2 hours)</li>
                <li>Cooking & preparation (1.5 hours)</li>
                <li>Equipment and tools</li>
                <li>Kitchen cleanup</li>
            </ul>
            <p style="margin-top: 15px;"><strong>CHEF SERVICE TOTAL: Rp ${chefServiceCost.toLocaleString('id-ID')}</strong></p>
        </div>
        
        <div class="pricing-breakdown-box">
            <h4>INGREDIENTS (Variable Cost)</h4>
            <p>Paying guests for ingredients:</p>
            <ul style="margin-left: 20px; margin-top: 8px;">
                <li>${bookingData.adults} adults: ${bookingData.adults} ${bookingData.adults === 1 ? 'person' : 'persons'}</li>
                ${bookingData.children5to10 > 0 ? `<li>${bookingData.children5to10} children (5-10): ${(bookingData.children5to10 * 0.5).toFixed(1)} ${bookingData.children5to10 === 1 ? 'person' : 'persons'} (50%)</li>` : ''}
                ${bookingData.children0to4 > 0 ? `<li>${bookingData.children0to4} young child (0-4): 0 (free)</li>` : ''}
            </ul>
            <p style="margin-top: 15px;"><strong>Total ingredient portions: ${payingPortions.toFixed(1)} ${payingPortions === 1 ? 'person' : 'persons'}</strong></p>
            <hr style="margin: 20px 0; border: none; border-top: 2px solid #e5e0d8;">
            <p><strong>ESTIMATED INGREDIENT COSTS:</strong></p>
            <p>Budget Option (Rp ${ingredientCosts.perPersonBudget.toLocaleString('id-ID')}/portion)<br>
            ${payingPortions.toFixed(1)} × Rp ${ingredientCosts.perPersonBudget.toLocaleString('id-ID')} = <strong>Rp ${budgetIngredient.toLocaleString('id-ID')}</strong></p>
            <p>Mid-Range (Rp ${ingredientCosts.perPersonMidRange.toLocaleString('id-ID')}/portion)<br>
            ${payingPortions.toFixed(1)} × Rp ${ingredientCosts.perPersonMidRange.toLocaleString('id-ID')} = <strong>Rp ${midRangeIngredient.toLocaleString('id-ID')}</strong></p>
            <p>Premium (Rp ${ingredientCosts.perPersonPremium.toLocaleString('id-ID')}/portion)<br>
            ${payingPortions.toFixed(1)} × Rp ${ingredientCosts.perPersonPremium.toLocaleString('id-ID')} = <strong>Rp ${premiumIngredient.toLocaleString('id-ID')}</strong></p>
            <hr style="margin: 20px 0; border: none; border-top: 2px solid #e5e0d8;">
            <p>💡 Actual cost determined during consultation based on your preferences and chef's shopping</p>
        </div>
        
        <div class="pricing-breakdown-box">
            <h4>TOTAL ESTIMATED COST</h4>
            <p>Chef Service: <strong>Rp ${chefServiceCost.toLocaleString('id-ID')}</strong></p>
            <p>Ingredients (est): <strong>Rp ${budgetIngredient.toLocaleString('id-ID')} - Rp ${premiumIngredient.toLocaleString('id-ID')}</strong></p>
            <hr style="margin: 20px 0; border: none; border-top: 2px solid #8b6f47;">
            <p class="total"><strong>TOTAL RANGE: Rp ${totalMin.toLocaleString('id-ID')} - Rp ${totalMax.toLocaleString('id-ID')}</strong></p>
        </div>
    `;
}

