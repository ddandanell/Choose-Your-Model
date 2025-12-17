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
    menuType: 'normal', // 'normal' = 5 hours total (2h shopping+meeting + 3h cooking), 'extended' = 6 hours total (2h shopping+meeting + 4h cooking)
    specialRequests: ''
};

let currentSlide = 1;
const totalSlides = 5;

const stepLabels = ['Date & Time', 'Guests', 'Cuisine', 'Service', 'Summary'];

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
    
    // Calculate total service time based on menu type
    // Normal: 5 hours total (2h shopping+meeting + 3h cooking)
    // Extended: 6 hours total (2h shopping+meeting + 4h cooking)
    const cookingHours = bookingData.menuType === 'extended' ? 4 : 3;
    const totalServiceHours = 2 + cookingHours; // 2 hours always for shopping+meeting
    
    // Chef arrives 5-6 hours before dining time
    // Normal menu (5h service): arrive 5 hours before
    // Extended menu (6h service): arrive 6 hours before
    const arrivalHoursBefore = totalServiceHours; // Chef arrives exactly when service starts (5h for normal, 6h for extended)
    const arrivalDate = new Date(diningDate.getTime() - (arrivalHoursBefore * 60 * 60 * 1000));
    
    const arrivalTime = formatTime(arrivalDate);
    bookingData.chefArrivalTime = arrivalTime;
    bookingData.totalServiceHours = totalServiceHours;
    bookingData.cookingHours = cookingHours;
    
    // Update schedule info
    if (document.getElementById('chef-schedule-info')) {
        const menuTypeText = bookingData.menuType === 'extended' ? 'Extended Menu (6 hours total)' : 'Normal Menu (5 hours total)';
        document.getElementById('chef-schedule-info').innerHTML = `
            Your selected dining time: ${formatTimeDisplay(bookingData.diningTime)}<br>
            Menu type: ${menuTypeText}<br>
            Chef arrives: ${formatTimeDisplay(arrivalTime)} (${arrivalHoursBefore} hours before)<br><br>
            Service breakdown:<br>
            • 2 hours: Shopping and meeting/consultation<br>
            • ${cookingHours} hour${cookingHours > 1 ? 's' : ''}: Cooking and preparation<br>
            • Total service time: ${totalServiceHours} hours (you pay for these ${totalServiceHours} hours)
        `;
    }
    
    updateTimeline();
}

function formatTime(date) {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}

function updateTimeline() {
    if (!bookingData.chefArrivalTime || !bookingData.totalServiceHours) return;
    
    const [arrivalHour, arrivalMin] = bookingData.chefArrivalTime.split(':');
    const arrival = parseInt(arrivalHour) * 60 + parseInt(arrivalMin);
    
    // Always 2 hours for shopping and meeting combined
    // Cooking time varies: 3 hours for normal, 4 hours for extended
    const shoppingMeetingEnd = arrival + (2 * 60); // 2 hours for shopping + meeting
    const cookingEnd = arrival + (bookingData.totalServiceHours * 60); // Total service hours
    
    const formatTimeFromMinutes = (mins) => {
        const h = Math.floor(mins / 60) % 24;
        const m = mins % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    };
    
    if (document.getElementById('timeline-arrival')) {
        document.getElementById('timeline-arrival').textContent = `${formatTimeFromMinutes(arrival)} - Chef Arrives`;
    }
    if (document.getElementById('timeline-consultation')) {
        document.getElementById('timeline-consultation').textContent = `${formatTimeFromMinutes(arrival)} - ${formatTimeFromMinutes(shoppingMeetingEnd)}\nShopping & Meeting (2 hours)`;
    }
    if (document.getElementById('timeline-shopping')) {
        document.getElementById('timeline-shopping').textContent = `${formatTimeFromMinutes(arrival)} - ${formatTimeFromMinutes(shoppingMeetingEnd)}\nShopping & Meeting (2 hours)`;
    }
    if (document.getElementById('timeline-cooking')) {
        const cookingHours = bookingData.cookingHours || 1;
        document.getElementById('timeline-cooking').textContent = `${formatTimeFromMinutes(shoppingMeetingEnd)} - ${formatTimeDisplay(bookingData.diningTime)}\nCooking & Preparation (${cookingHours} hour${cookingHours > 1 ? 's' : ''})`;
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
            <div class="cuisine-name">${cuisine.name} Chef</div>
            <div class="cuisine-desc">${cuisine.chefRequirement}</div>
            <div class="cuisine-specialties">
                <div class="specialty-title">Chef Specialties include:</div>
                ${cuisine.specialties.map(s => `<div class="specialty-item">• ${s}</div>`).join('')}
            </div>
            <div class="chef-badge">⭐ Specialized ${cuisine.name} Chef</div>
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
            if (currentSlide === 4) {
                updateScheduleSummary();
                updateChefServiceDetails();
            } else if (currentSlide === 5) {
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
            
        case 2:
            if (bookingData.adults < 1) {
                alert('At least 1 adult is required');
                return false;
            }
            return true;
            
        case 3:
            if (!bookingData.cuisine) {
                alert('Please select a cuisine');
                return false;
            }
            return true;
            
        case 4:
            if (!document.getElementById('service-understood').checked) {
                alert('Please confirm that you understand how the service works');
                return false;
            }
            return true;
            
        case 5:
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
    
    if (bookingData.date && bookingData.diningTime && bookingData.chefArrivalTime && bookingData.totalServiceHours) {
        const date = new Date(bookingData.date);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', options);
        
        const menuTypeText = bookingData.menuType === 'extended' ? 'Extended Menu' : 'Normal Menu';
        const cookingHours = bookingData.cookingHours || 1;
        
        // Calculate hours before dining time
        const diningDateTime = new Date(bookingData.date + 'T' + bookingData.diningTime);
        const arrivalDateTime = new Date(bookingData.date + 'T' + bookingData.chefArrivalTime);
        const arrivalHoursBefore = Math.round((diningDateTime.getTime() - arrivalDateTime.getTime()) / (1000 * 60 * 60));
        
        container.innerHTML = `
            <h4>📅 Your Selected Schedule:</h4>
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Your dining time:</strong> ${formatTimeDisplay(bookingData.diningTime)}</p>
            <p><strong>Menu type:</strong> ${menuTypeText} (${bookingData.totalServiceHours} hours total)</p>
            <p><strong>Chef arrival:</strong> ${formatTimeDisplay(bookingData.chefArrivalTime)} (${arrivalHoursBefore} hours before)</p>
            <p><strong>Service breakdown:</strong></p>
            <ul style="margin-left: 20px; margin-top: 8px;">
                <li>Shopping and meeting: 2 hours</li>
                <li>Cooking and preparation: ${cookingHours} hour${cookingHours > 1 ? 's' : ''}</li>
            </ul>
        `;
    }
}

// Chef Service Details - Dynamic based on menu type
function updateChefServiceDetails() {
    // Calculate based on menu type
    const cookingHours = bookingData.menuType === 'extended' ? 2 : 1;
    const totalHours = 2 + cookingHours; // Always 2 hours shopping+meeting + cooking hours
    
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
            • Shopping and meeting (2 hours)<br>
            • Cooking and preparation (${cookingHours} hour${cookingHours > 1 ? 's' : ''})<br>
            • Equipment and tools<br>
            • Kitchen cleanup<br><br>
            <strong>Total: ${totalHours} hours</strong>
        `;
    }
    
    // Update menu type prices
    const normalMenuEl = document.querySelector('.menu-type-option[data-menutype="normal"] .menu-type-price');
    const extendedMenuEl = document.querySelector('.menu-type-option[data-menutype="extended"] .menu-type-price');
    
    if (normalMenuEl) {
        const normalHours = 5; // 2h shopping+meeting + 3h cooking
        const normalCost = normalHours * SERVICE_CONFIG.hourlyRate;
        normalMenuEl.textContent = `Total: ${normalHours} hours = Rp ${normalCost.toLocaleString('id-ID')}`;
    }
    
    if (extendedMenuEl) {
        const extendedHours = 6; // 2h shopping+meeting + 4h cooking
        const extendedCost = extendedHours * SERVICE_CONFIG.hourlyRate;
        extendedMenuEl.textContent = `Total: ${extendedHours} hours = Rp ${extendedCost.toLocaleString('id-ID')}`;
    }
}

// Booking Summary
function updateBookingSummary() {
    const container = document.getElementById('booking-details-summary');
    if (!container) return;
    
    const date = bookingData.date ? new Date(bookingData.date) : null;
    const formattedDate = date ? date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Not selected';
    
    const cuisine = bookingData.cuisine ? CUISINE_OPTIONS[bookingData.cuisine] : null;
    
    const totalGuests = bookingData.adults + bookingData.children5to10 + bookingData.children0to4;
    container.innerHTML = `
        <p><strong>📅 Date:</strong> ${formattedDate}</p>
        <p><strong>🕐 Time:</strong> ${formatTimeDisplay(bookingData.diningTime)}</p>
        <p><strong>👨‍🍳 Chef:</strong> ${cuisine ? cuisine.name + ' Chef' : 'Not selected'}</p>
        <p><strong>👥 Guests:</strong> ${totalGuests} total (${bookingData.adults} adults${bookingData.children5to10 > 0 ? `, ${bookingData.children5to10} children` : ''}${bookingData.children0to4 > 0 ? `, ${bookingData.children0to4} young children` : ''})</p>
    `;
}

// Pricing Summary
function updatePricingSummary() {
    const container = document.getElementById('pricing-breakdown');
    if (!container) return;
    
    // Calculate based on menu type
    const cookingHours = bookingData.menuType === 'extended' ? 4 : 3;
    const totalHours = 2 + cookingHours; // Always 2 hours shopping+meeting + cooking hours
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
            <h4>👨‍🍳 CHEF SERVICE</h4>
            <p><strong>${totalHours} hours × Rp ${SERVICE_CONFIG.hourlyRate.toLocaleString('id-ID')}/hour</strong></p>
            <p style="font-size: 1.2rem; margin-top: 10px;"><strong>Rp ${chefServiceCost.toLocaleString('id-ID')}</strong></p>
            <p style="font-size: 0.85rem; color: #666; margin-top: 8px;">2h shopping/meeting + ${cookingHours}h cooking</p>
        </div>
        
        <div class="pricing-breakdown-box">
            <h4>🥘 INGREDIENTS</h4>
            <p style="font-size: 0.9rem; margin-bottom: 10px;">${payingPortions.toFixed(1)} paying ${payingPortions === 1 ? 'portion' : 'portions'}</p>
            <p><strong>Budget:</strong> Rp ${budgetIngredient.toLocaleString('id-ID')}</p>
            <p><strong>Mid-Range:</strong> Rp ${midRangeIngredient.toLocaleString('id-ID')}</p>
            <p><strong>Premium:</strong> Rp ${premiumIngredient.toLocaleString('id-ID')}</p>
            <p style="font-size: 0.85rem; color: #666; margin-top: 8px;">💡 Actual cost set during consultation</p>
        </div>
        
        <div class="pricing-breakdown-box" style="background: #faf8f3; border: 2px solid #8b6f47;">
            <h4>💰 TOTAL ESTIMATE</h4>
            <p style="font-size: 1.3rem; margin-top: 10px;"><strong>Rp ${totalMin.toLocaleString('id-ID')} - Rp ${totalMax.toLocaleString('id-ID')}</strong></p>
        </div>
    `;
}

