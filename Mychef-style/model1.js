// Global state
let bookingData = {
    customerInfo: {
        name: '',
        phone: '',
        email: ''
    },
    date: null,
    serviceType: 'dinner',
    adults: 4,
    children5to10: 0,
    children0to4: 0,
    children11: 0,
    dietary: [],
    diningTime: '19:00',
    cuisine: 'indonesian',
    courseCount: 4,
    priceTier: null,
    pricePerAdult: null,
    guestMenus: []
};

let currentSlide = 1;
const totalSlides = 8;

const stepLabels = ['Date', 'Guests', 'Time', 'Cuisine', 'Courses', 'Price Tier', 'Menu', 'Summary'];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeDatePicker();
    initializeEventListeners();
    initializeTimeSlots();
    updateProgress();
    updateTotalGuests();
    showSlide(1); // Initialize navigation buttons
});

function initializeDatePicker() {
    const dateInput = document.getElementById('booking-date');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.min = tomorrow.toISOString().split('T')[0];
    
    // Make the entire wrapper clickable to open date picker
    const dateWrapper = document.querySelector('.date-input-wrapper');
    if (dateWrapper) {
        dateWrapper.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            // Focus and click the input to open the date picker
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
    
    // Also make the input itself work
    dateInput.addEventListener('click', function(e) {
        e.stopPropagation();
        if (this.showPicker) {
            try {
                this.showPicker();
            } catch (err) {
                // Fallback for browsers that don't support showPicker
            }
        }
    });
    
    dateInput.addEventListener('change', function() {
        bookingData.date = this.value;
        updateDateDisplay();
    });
    
    dateInput.addEventListener('input', function() {
        bookingData.date = this.value;
        updateDateDisplay();
    });
}

function updateDateDisplay() {
    if (bookingData.date) {
        const date = new Date(bookingData.date);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formatted = date.toLocaleDateString('en-US', options);
        document.getElementById('date-display').textContent = formatted;
        document.getElementById('confirmation-date').textContent = formatted;
        document.getElementById('date-confirmation').style.display = 'block';
    }
}

function initializeEventListeners() {
    // Navigation
    document.getElementById('next-btn').addEventListener('click', nextSlide);
    document.getElementById('back-btn').addEventListener('click', prevSlide);
    
    // Slide 2: Guest Count +/- Buttons
    setupQuantityButtons('adults', 'adults-value', 'adults-minus', 'adults-plus', 1);
    setupQuantityButtons('children0to4', 'children0to4-value', 'children0to4-minus', 'children0to4-plus', 0);
    setupQuantityButtons('children5to10', 'children5to10-value', 'children5to10-minus', 'children5to10-plus', 0);
    setupQuantityButtons('children11', 'children11-value', 'children11-minus', 'children11-plus', 0);
    
    // Slide 4: Cuisine selection
    document.querySelectorAll('.cuisine-card:not(.coming-soon)').forEach(card => {
        card.addEventListener('click', function() {
            document.querySelectorAll('.cuisine-card').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            bookingData.cuisine = this.dataset.cuisine;
        });
    });
    
    // Slide 5: Course selection
    document.querySelectorAll('.course-card').forEach(card => {
        card.addEventListener('click', function() {
            if (!this.classList.contains('disabled')) {
                document.querySelectorAll('.course-card').forEach(c => c.classList.remove('active'));
                this.classList.add('active');
                bookingData.courseCount = parseInt(this.dataset.courses);
                updateCourseOptions();
                updateTierOptions();
                initializeGuestMenus();
            }
        });
    });
    
    // Modal
    document.getElementById('modal-close').addEventListener('click', closeMenuModal);
    document.getElementById('modal-cancel').addEventListener('click', closeMenuModal);
    document.getElementById('modal-save').addEventListener('click', saveGuestMenu);
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.menu-dropdown')) {
            document.querySelectorAll('.menu-dropdown-list.active').forEach(list => {
                list.classList.remove('active');
            });
            document.querySelectorAll('.menu-dropdown-btn.active').forEach(btn => {
                btn.classList.remove('active');
            });
        }
    });
    
    // Dietary filter buttons in modal
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentDietaryFilter = this.dataset.filter;
            
            // Re-render menu options with filter
            if (currentEditingGuestIndex !== null) {
                const guest = bookingData.guestMenus[currentEditingGuestIndex];
                renderMenuOptions(guest);
            }
        });
    });
}

function setupQuantityButtons(key, valueId, minusId, plusId, min) {
    const minusBtn = document.getElementById(minusId);
    const plusBtn = document.getElementById(plusId);
    const valueEl = document.getElementById(valueId);
    
    minusBtn.addEventListener('click', function() {
        let value = parseInt(valueEl.textContent) || 0;
        if (value > min) {
            value--;
            valueEl.textContent = value;
            bookingData[key] = value;
            updateTotalGuests();
            if (key === 'adults') {
                updateCourseOptions();
            }
        }
    });
    
    plusBtn.addEventListener('click', function() {
        let value = parseInt(valueEl.textContent) || 0;
        value++;
        valueEl.textContent = value;
        bookingData[key] = value;
        updateTotalGuests();
        if (key === 'adults') {
            updateCourseOptions();
        }
    });
}

function updateTotalGuests() {
    const total = bookingData.adults + bookingData.children0to4 + bookingData.children5to10 + bookingData.children11;
    document.getElementById('total-guests-count').textContent = total;
}

function initializeTimeSlots() {
    const timeSlots = [
        { time: '17:00', label: '17:00', desc: 'Early dinner' },
        { time: '17:30', label: '17:30', desc: 'Early dinner' },
        { time: '18:00', label: '18:00', desc: 'Classic timing' },
        { time: '18:30', label: '18:30', desc: 'Classic timing' },
        { time: '19:00', label: '19:00', desc: 'Most popular' },
        { time: '19:30', label: '19:30', desc: 'Most popular' },
        { time: '20:00', label: '20:00', desc: 'Late dinner' },
        { time: '20:30', label: '20:30', desc: 'Late dinner' },
        { time: '21:00', label: '21:00', desc: 'Evening affair' }
    ];
    
    const container = document.getElementById('time-slots');
    container.innerHTML = '';
    
    timeSlots.forEach(slot => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'time-slot-btn';
        if (slot.time === bookingData.diningTime) {
            btn.classList.add('active');
        }
        btn.dataset.time = slot.time;
        btn.innerHTML = `
            <div class="time-slot-time">${slot.label}</div>
            <div class="time-slot-desc">${slot.desc}</div>
        `;
        
        btn.addEventListener('click', function() {
            document.querySelectorAll('.time-slot-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            bookingData.diningTime = slot.time;
            updateTimeSummary();
        });
        
        container.appendChild(btn);
    });
    
    updateTimeSummary();
}

function updateTimeSummary() {
    if (bookingData.diningTime) {
        const [hours, minutes] = bookingData.diningTime.split(':');
        const time24 = formatTime24(parseInt(hours), parseInt(minutes));
        document.getElementById('selected-time-display').textContent = time24;
        
        // Calculate chef arrival (3 hours before)
        const arrivalHours = parseInt(hours) - 3;
        const arrivalTime = `${arrivalHours.toString().padStart(2, '0')}:${minutes}`;
        document.getElementById('chef-arrival-time').textContent = arrivalTime;
        
        document.getElementById('time-summary').style.display = 'block';
    }
}

function formatTime24(hours, minutes) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function updateCourseOptions() {
    const course5Card = document.getElementById('course-5-card');
    const needMoreBadge = document.getElementById('need-more-badge');
    
    if (bookingData.adults < 6) {
        course5Card.classList.add('disabled');
        if (bookingData.adults < 6) {
            needMoreBadge.style.display = 'inline-block';
            needMoreBadge.textContent = `Need ${6 - bookingData.adults} more`;
        }
    } else {
        course5Card.classList.remove('disabled');
        needMoreBadge.style.display = 'none';
    }
}

function updateTierOptions() {
    const container = document.getElementById('tier-cards');
    const courseCount = bookingData.courseCount;
    const prices = pricingMatrix[courseCount];
    
    container.innerHTML = '';
    
    const tiers = [
        { 
            id: 'standard', 
            name: 'Standard', 
            icon: '⭐', 
            desc: 'Quality ingredients, classic presentation.', 
            detailedDesc: `
                <strong>Cost:</strong> Rp ${formatIDR(prices.standard)} per adult<br><br>
                Quality ingredients from local markets. Classic preparation and authentic flavors. Great value for money.
            `,
            popular: false 
        },
        { 
            id: 'premium', 
            name: 'Premium', 
            icon: '⭐', 
            desc: 'Premium ingredients, elevated presentation.', 
            detailedDesc: `
                <strong>Cost:</strong> Rp ${formatIDR(prices.premium)} per adult<br><br>
                Premium-grade ingredients from specialty suppliers. Higher quality cuts and enhanced presentation. Perfect for special occasions.
            `,
            popular: true 
        },
        { 
            id: 'luxury', 
            name: 'Luxury', 
            icon: '👑', 
            desc: 'Finest ingredients, exceptional experience.', 
            detailedDesc: `
                <strong>Cost:</strong> Rp ${formatIDR(prices.luxury)} per adult<br><br>
                Finest ingredients available. Best meats (premium wagyu, organic poultry, prime seafood). Artisanal products. Restaurant-quality experience.
            `,
            popular: false 
        }
    ];
    
    tiers.forEach(tier => {
        const card = document.createElement('div');
        card.className = 'tier-card';
        card.dataset.tier = tier.id;
        
        if (tier.popular) {
            card.innerHTML += '<div class="popular-badge">Popular</div>';
        }
        
        card.innerHTML += `
            <div class="tier-icon">${tier.icon}</div>
            <div class="tier-name">${tier.name}</div>
            <div class="tier-desc">${tier.desc}</div>
            <div class="tier-detailed-desc">${tier.detailedDesc}</div>
            <div class="tier-price">Rp ${formatIDR(prices[tier.id])} per adult</div>
        `;
        
        card.addEventListener('click', function() {
            document.querySelectorAll('.tier-card').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            bookingData.priceTier = tier.id;
            bookingData.pricePerAdult = prices[tier.id];
        });
        
        container.appendChild(card);
    });
}

function initializeGuestMenus() {
    bookingData.guestMenus = [];
    const totalGuests = bookingData.adults + bookingData.children5to10 + bookingData.children0to4 + bookingData.children11;
    const defaults = defaultMenus[bookingData.courseCount];
    const kidsDefaults = defaultKidsMenus[bookingData.courseCount];
    
    let guestNumber = 1;
    
    // Adults
    for (let i = 0; i < bookingData.adults; i++) {
        bookingData.guestMenus.push({
            guestNumber: guestNumber++,
            type: 'adult',
            name: '',
            spiceLevel: 'mild',
            dietary: [],
            specialNeeds: '',
            dislikes: '',
            ...defaults
        });
    }
    
    // Children 11+ (use adult menu)
    for (let i = 0; i < bookingData.children11; i++) {
        bookingData.guestMenus.push({
            guestNumber: guestNumber++,
            type: 'child11',
            name: '',
            spiceLevel: 'mild',
            dietary: [],
            specialNeeds: '',
            dislikes: '',
            ...defaults
        });
    }
    
    // Children 5-10 (use kids menu - Indonesian + Western mix)
    for (let i = 0; i < bookingData.children5to10; i++) {
        bookingData.guestMenus.push({
            guestNumber: guestNumber++,
            type: 'child5to10',
            name: '',
            spiceLevel: 'mild',
            dietary: [],
            specialNeeds: '',
            dislikes: '',
            ...kidsDefaults
        });
    }
    
    // Children 0-4 (use kids menu - Indonesian + Western mix)
    for (let i = 0; i < bookingData.children0to4; i++) {
        bookingData.guestMenus.push({
            guestNumber: guestNumber++,
            type: 'child0to4',
            name: '',
            spiceLevel: 'mild',
            dietary: [],
            specialNeeds: '',
            dislikes: '',
            ...kidsDefaults
        });
    }
}

function renderGuestsMenuList() {
    const container = document.getElementById('guests-menu-list');
    if (!container) {
        console.error('guests-menu-list container not found');
        return;
    }
    
    // Initialize guest menus if not already done
    if (bookingData.guestMenus.length === 0) {
        initializeGuestMenus();
    }
    
    container.innerHTML = '';
    
    bookingData.guestMenus.forEach(guest => {
        const item = document.createElement('div');
        item.className = 'guest-menu-item';
        
        const guestLabel = guest.type === 'adult' ? 'Adult' : 
                          guest.type === 'child11' ? 'Child (11+)' :
                          guest.type === 'child5to10' ? 'Child (5-10)' : 'Child (0-4)';
        
        const displayName = guest.name ? guest.name : `${guestLabel} ${guest.guestNumber}`;
        const menuPreview = getMenuPreview(guest);
        
        // Build info badges
        const infoBadges = [];
        // Only show spice level for adults, not for children
        if (guest.spiceLevel && guest.type === 'adult') {
            const spiceEmoji = guest.spiceLevel === 'mild' ? '🌶️' : guest.spiceLevel === 'hot' ? '🌶️🌶️🌶️' : '🌶️🌶️';
            const spiceLabel = guest.spiceLevel === 'mild' ? 'Easy' : guest.spiceLevel === 'hot' ? 'Hot' : 'Medium';
            infoBadges.push(`<span class="info-badge">${spiceEmoji} ${spiceLabel}</span>`);
        }
        if (guest.dietary && guest.dietary.length > 0) {
            infoBadges.push(`<span class="info-badge">${guest.dietary.join(', ')}</span>`);
        }
        if (guest.specialNeeds) {
            infoBadges.push(`<span class="info-badge special">⚠️ Special needs</span>`);
        }
        
        item.innerHTML = `
            <div class="guest-menu-info">
                <div class="guest-menu-name">${displayName}'s Menu</div>
                <div class="guest-menu-preview">${menuPreview}</div>
                ${infoBadges.length > 0 ? `<div class="guest-menu-badges">${infoBadges.join('')}</div>` : ''}
            </div>
            <button class="customize-menu-btn" onclick="openMenuModal(${guest.guestNumber - 1})">Customize</button>
        `;
        
        container.appendChild(item);
    });
}

function getMenuPreview(guest) {
    const parts = [];
    
    if (guest.smallBite) {
        const item = findMenuItem('smallBites', guest.smallBite);
        if (item) parts.push(item.name);
    }
    
    if (guest.starter) {
        const item = findMenuItem('starters', guest.starter);
        if (item) parts.push(item.name);
    }
    
    if (guest.beforeMain && bookingData.courseCount >= 4) {
        const item = findMenuItem('beforeMain', guest.beforeMain);
        if (item) parts.push(item.name);
    }
    
    if (guest.main) {
        const item = findMenuItem('main', guest.main);
        if (item) parts.push(item.name);
    }
    
    if (guest.dessert && bookingData.courseCount === 5) {
        const item = findMenuItem('dessert', guest.dessert);
        if (item) parts.push(item.name);
    }
    
    return parts.join(' • ') || 'Default menu';
}

function findMenuItem(category, id) {
    // Check regular menu first
    let item = menuData[category]?.find(item => item.id === id);
    // If not found, check kids menu
    if (!item) {
        item = kidsMenuData[category]?.find(item => item.id === id);
    }
    return item;
}

let currentEditingGuestIndex = null;
let currentDietaryFilter = 'all';

function openMenuModal(guestIndex) {
    // Initialize guest menus if not already done
    if (bookingData.guestMenus.length === 0) {
        initializeGuestMenus();
    }
    
    if (!bookingData.guestMenus[guestIndex]) {
        console.error('Guest not found at index:', guestIndex);
        return;
    }
    
    currentEditingGuestIndex = guestIndex;
    currentDietaryFilter = 'all';
    const guest = bookingData.guestMenus[guestIndex];
    const guestLabel = guest.type === 'adult' ? 'Adult' : 
                      guest.type === 'child11' ? 'Child (11+)' :
                      guest.type === 'child5to10' ? 'Child (5-10)' : 'Child (0-4)';
    
    document.getElementById('modal-guest-name').textContent = `${guestLabel} ${guest.guestNumber}'s Menu`;
    
    // Load guest information
    document.getElementById('guest-name-input').value = guest.name || '';
    document.getElementById('spice-level').value = guest.spiceLevel || 'mild';
    document.getElementById('special-needs').value = guest.specialNeeds || '';
    document.getElementById('dislikes').value = guest.dislikes || '';
    
    // Load dietary preferences
    document.getElementById('modal-vegetarian').checked = guest.dietary?.includes('vegetarian') || false;
    document.getElementById('modal-vegan').checked = guest.dietary?.includes('vegan') || false;
    document.getElementById('modal-gluten-free').checked = guest.dietary?.includes('gluten-free') || false;
    document.getElementById('modal-halal').checked = guest.dietary?.includes('halal') || false;
    
    // Reset filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === 'all') {
            btn.classList.add('active');
        }
    });
    
    renderMenuOptions(guest);
    document.getElementById('menu-modal').style.display = 'flex';
}

function renderMenuOptions(guest) {
    const container = document.getElementById('modal-menu-options');
    if (!container) {
        console.error('modal-menu-options container not found');
        return;
    }
    if (!guest) {
        console.error('No guest provided to renderMenuOptions');
        return;
    }
    container.innerHTML = '';
    
    // Small Bites
    renderMenuDropdown(container, 'smallBites', 'Small Bites', guest.smallBite, 'smallBite');
    
    // Starters
    renderMenuDropdown(container, 'starters', 'Starters', guest.starter, 'starter');
    
    // Before Main (4 and 5 course only)
    if (bookingData.courseCount >= 4) {
        renderMenuDropdown(container, 'beforeMain', 'Before the Main', guest.beforeMain, 'beforeMain');
    }
    
    // Main
    renderMenuDropdown(container, 'main', 'Main Course', guest.main, 'main');
    
    // Dessert (5 course only)
    if (bookingData.courseCount === 5) {
        renderMenuDropdown(container, 'dessert', 'Dessert', guest.dessert, 'dessert');
    }
}

function renderMenuDropdown(container, categoryKey, categoryName, selectedId, fieldName) {
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'menu-category';
    
    const title = document.createElement('div');
    title.className = 'menu-category-title';
    title.textContent = categoryName;
    categoryDiv.appendChild(title);
    
    const dropdown = document.createElement('div');
    dropdown.className = 'menu-dropdown';
    
    const selectedItem = findMenuItem(categoryKey, selectedId);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'menu-dropdown-btn';
    
    // Build selected item display with icons
    let selectedDisplay = selectedItem ? selectedItem.name : 'Select...';
    if (selectedItem) {
        const icons = getDietaryIcons(selectedItem);
        if (icons) {
            selectedDisplay += ' ' + icons;
        }
    }
    
    btn.innerHTML = `
        <span>${selectedDisplay}</span>
        <span class="dropdown-arrow">▼</span>
    `;
    
    const list = document.createElement('div');
    list.className = 'menu-dropdown-list';
    
    // Determine which menu to use based on guest type
    if (currentEditingGuestIndex === null || !bookingData.guestMenus[currentEditingGuestIndex]) {
        console.error('Invalid guest index for menu dropdown');
        return;
    }
    
    const guest = bookingData.guestMenus[currentEditingGuestIndex];
    const isChild = guest.type === 'child5to10' || guest.type === 'child0to4';
    const menuSource = isChild ? kidsMenuData : menuData;
    
    // Check if menu data exists
    if (!menuSource || !menuSource[categoryKey]) {
        console.error(`Menu data not found for category: ${categoryKey}`);
        return;
    }
    
    // Filter items based on current filter
    let filteredItems = menuSource[categoryKey] || [];
    if (currentDietaryFilter === 'vegetarian') {
        filteredItems = filteredItems.filter(item => item.vegetarian);
    } else if (currentDietaryFilter === 'spicy') {
        filteredItems = filteredItems.filter(item => item.spicy);
    } else if (currentDietaryFilter === 'seafood') {
        filteredItems = filteredItems.filter(item => 
            item.name.toLowerCase().includes('fish') || 
            item.name.toLowerCase().includes('seafood') ||
            item.name.toLowerCase().includes('tuna') ||
            item.name.toLowerCase().includes('ikan') ||
            item.name.toLowerCase().includes('udang')
        );
    }
    
    filteredItems.forEach(item => {
        const option = document.createElement('div');
        option.className = 'menu-option';
        
        const icons = getDietaryIcons(item);
        
        const detailedDesc = item.detailedDescription || item.description;
        const hasDetailedInfo = item.detailedDescription && item.detailedDescription !== item.description;
        
        option.innerHTML = `
            <div class="menu-option-header">
                <div class="menu-option-name">${item.name}</div>
                <div class="menu-option-icons">
                    ${icons}
                    ${hasDetailedInfo ? '<span class="help-icon" title="Read more about this dish">❓</span>' : ''}
                </div>
            </div>
            <div class="menu-option-desc">${item.description}</div>
            ${hasDetailedInfo ? `
                <div class="menu-option-help-tooltip" style="display: none;">
                    <div class="help-tooltip-content">
                        <strong>Read more about ${item.name}:</strong><br><br>
                        ${detailedDesc}
                    </div>
                </div>
            ` : ''}
        `;
        
        // Show help tooltip on hover over help icon
        if (hasDetailedInfo) {
            const helpIcon = option.querySelector('.help-icon');
            const tooltip = option.querySelector('.menu-option-help-tooltip');
            
            if (helpIcon && tooltip) {
                helpIcon.addEventListener('mouseenter', function(e) {
                    e.stopPropagation();
                    tooltip.style.display = 'block';
                });
                
                helpIcon.addEventListener('mouseleave', function(e) {
                    e.stopPropagation();
                    tooltip.style.display = 'none';
                });
                
                // Also allow hovering over tooltip itself
                tooltip.addEventListener('mouseenter', function() {
                    tooltip.style.display = 'block';
                });
                
                tooltip.addEventListener('mouseleave', function() {
                    tooltip.style.display = 'none';
                });
            }
        }
        
        option.addEventListener('click', function(e) {
            e.stopPropagation();
            if (currentEditingGuestIndex === null || !bookingData.guestMenus[currentEditingGuestIndex]) {
                console.error('No guest selected for editing');
                return;
            }
            bookingData.guestMenus[currentEditingGuestIndex][fieldName] = item.id;
            const icons = getDietaryIcons(item);
            btn.querySelector('span:first-child').innerHTML = item.name + (icons ? ' ' + icons : '');
            btn.classList.remove('active');
            list.classList.remove('active');
            // Re-render to update preview
            renderGuestsMenuList();
        });
        
        list.appendChild(option);
    });
    
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        // Close other open dropdowns
        document.querySelectorAll('.menu-dropdown-list.active').forEach(openList => {
            if (openList !== list) {
                openList.classList.remove('active');
            }
        });
        document.querySelectorAll('.menu-dropdown-btn.active').forEach(openBtn => {
            if (openBtn !== btn) {
                openBtn.classList.remove('active');
            }
        });
        this.classList.toggle('active');
        list.classList.toggle('active');
    });
    
    dropdown.appendChild(btn);
    dropdown.appendChild(list);
    categoryDiv.appendChild(dropdown);
    container.appendChild(categoryDiv);
}

function getDietaryIcons(item) {
    const icons = [];
    
    // Meat type icons
    if (item.meatType) {
        const meatIcons = {
            'beef': '<span class="diet-icon meat-icon" title="Contains beef">🐄</span>',
            'pork': '<span class="diet-icon meat-icon" title="Contains pork">🐷</span>',
            'chicken': '<span class="diet-icon meat-icon" title="Contains chicken">🐔</span>',
            'duck': '<span class="diet-icon meat-icon" title="Contains duck">🦆</span>',
            'fish': '<span class="diet-icon meat-icon" title="Contains fish">🐟</span>',
            'seafood': '<span class="diet-icon meat-icon" title="Contains seafood">🦐</span>'
        };
        if (meatIcons[item.meatType]) {
            icons.push(meatIcons[item.meatType]);
        }
    }
    
    // Vegetarian icon
    if (item.vegetarian) {
        icons.push('<span class="diet-icon vegetarian" title="Vegetarian">🌿</span>');
    }
    
    // Don't show spicy indicator for children
    const isChild = currentEditingGuestIndex !== null && 
                    bookingData.guestMenus[currentEditingGuestIndex] &&
                    (bookingData.guestMenus[currentEditingGuestIndex].type === 'child5to10' || 
                     bookingData.guestMenus[currentEditingGuestIndex].type === 'child0to4');
    if (item.spicy && !isChild) {
        icons.push('<span class="diet-icon spicy" title="Spicy">🌶️</span>');
    }
    
    // Check for seafood if not already added via meatType
    if (!item.meatType) {
        const name = item.name.toLowerCase();
        if (name.includes('fish') || name.includes('seafood') || name.includes('tuna') || 
            name.includes('ikan') || name.includes('udang') || name.includes('sate lilit')) {
            icons.push('<span class="diet-icon seafood" title="Contains seafood">🐟</span>');
        }
    }
    
    return icons.join(' ');
}

function closeMenuModal() {
    document.getElementById('menu-modal').style.display = 'none';
    currentEditingGuestIndex = null;
}

function saveGuestMenu() {
    if (currentEditingGuestIndex !== null) {
        const guest = bookingData.guestMenus[currentEditingGuestIndex];
        
        // Save guest information
        guest.name = document.getElementById('guest-name-input').value.trim();
        guest.spiceLevel = document.getElementById('spice-level').value;
        guest.specialNeeds = document.getElementById('special-needs').value.trim();
        guest.dislikes = document.getElementById('dislikes').value.trim();
        
        // Save dietary preferences
        guest.dietary = [];
        if (document.getElementById('modal-vegetarian').checked) {
            guest.dietary.push('vegetarian');
        }
        if (document.getElementById('modal-vegan').checked) {
            guest.dietary.push('vegan');
        }
        if (document.getElementById('modal-gluten-free').checked) {
            guest.dietary.push('gluten-free');
        }
        if (document.getElementById('modal-halal').checked) {
            guest.dietary.push('halal');
        }
    }
    
    closeMenuModal();
    renderGuestsMenuList();
}

function nextSlide() {
    if (validateCurrentSlide()) {
        // If on the last slide before summary, go back to index page
        if (currentSlide === totalSlides - 1) {
            window.location.href = 'index.html';
            return;
        }
        
        if (currentSlide < totalSlides) {
            currentSlide++;
            showSlide(currentSlide);
            updateProgress();
            
            // Special handling
            if (currentSlide === 6) {
                updateTierOptions();
            } else if (currentSlide === 7) {
                // Initialize guest menus if not already done
                if (bookingData.guestMenus.length === 0) {
                    initializeGuestMenus();
                }
                renderGuestsMenuList();
            } else if (currentSlide === 8) {
                renderSummary();
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
    
    document.querySelector(`.slide[data-slide="${slideNumber}"]`).classList.add('active');
    
    // Update navigation
    document.getElementById('back-btn').style.display = slideNumber > 1 ? 'block' : 'none';
    document.getElementById('go-back-models-btn').style.display = slideNumber === 1 ? 'block' : 'none';
    document.getElementById('next-btn').textContent = slideNumber === totalSlides ? 'View Summary' : 'Continue →';
    
    // Update step label
    document.getElementById('step-label').textContent = stepLabels[slideNumber - 1];
    
    // Special handling when showing menu customization slide
    if (slideNumber === 7) {
        // Initialize guest menus if not already done
        if (bookingData.guestMenus.length === 0) {
            initializeGuestMenus();
        }
        renderGuestsMenuList();
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateProgress() {
    const percentage = (currentSlide / totalSlides) * 100;
    
    // Update step circles
    for (let i = 1; i <= totalSlides; i++) {
        const circle = document.getElementById(`step-circle-${i}`);
        const indicator = document.querySelector(`.step-indicator[data-step="${i}"]`);
        
        if (i < currentSlide) {
            indicator.classList.add('completed');
            indicator.classList.remove('active');
        } else if (i === currentSlide) {
            indicator.classList.add('active');
            indicator.classList.remove('completed');
        } else {
            indicator.classList.remove('active', 'completed');
        }
    }
    
    document.getElementById('current-slide').textContent = currentSlide;
}

function validateCurrentSlide() {
    switch(currentSlide) {
        case 1:
            if (!bookingData.date) {
                alert('Please select a date');
                return false;
            }
            return true;
        case 2:
            if (bookingData.adults < 1) {
                alert('At least 1 adult is required');
                return false;
            }
            return true;
        case 5:
            const minimum = pricingMatrix[bookingData.courseCount].minimum;
            if (bookingData.adults < minimum) {
                alert(`Minimum ${minimum} adults required for ${bookingData.courseCount}-course selection`);
                return false;
            }
            return true;
        case 6:
            if (!bookingData.priceTier) {
                alert('Please select a price tier');
                return false;
            }
            return true;
        default:
            return true;
    }
}

function renderSummary() {
    // Event Details
    if (bookingData.date) {
        const date = new Date(bookingData.date);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('summary-date').textContent = date.toLocaleDateString('en-US', options);
    }
    
    const [hours, minutes] = bookingData.diningTime.split(':');
    document.getElementById('summary-time').textContent = formatTime24(parseInt(hours), parseInt(minutes));
    document.getElementById('summary-cuisine').textContent = 'Indonesian';
    
    // Guests
    document.getElementById('summary-adults').textContent = bookingData.adults;
    const totalGuests = bookingData.adults + bookingData.children0to4 + bookingData.children5to10 + bookingData.children11;
    document.getElementById('summary-total-guests').textContent = totalGuests;
    
    // Menu Selection
    document.getElementById('summary-package').textContent = `${bookingData.courseCount}-Course ${bookingData.courseCount === 4 ? '(Recommended)' : ''}`;
    document.getElementById('summary-experience').innerHTML = `<span class="popular-badge">${bookingData.priceTier.charAt(0).toUpperCase() + bookingData.priceTier.slice(1)}</span>`;
    
    // Price Breakdown
    const pricePerAdult = bookingData.pricePerAdult;
    const pricePerChild = Math.round(pricePerAdult * 0.5);
    
    const adultsTotal = bookingData.adults * pricePerAdult;
    const children11Total = bookingData.children11 * pricePerAdult;
    const children5to10Total = bookingData.children5to10 * pricePerChild;
    const children0to4Total = 0;
    
    const total = adultsTotal + children11Total + children5to10Total + children0to4Total;
    
    document.getElementById('price-adults-line').textContent = `${bookingData.adults} Adults × Rp ${formatIDR(pricePerAdult)}`;
    document.getElementById('price-adults-total').textContent = `Rp ${formatIDR(adultsTotal)}`;
    document.getElementById('price-total').textContent = `Rp ${formatIDR(total)}`;
}

function formatIDR(amount) {
    return amount.toLocaleString('id-ID');
}

// Make functions available globally
window.openMenuModal = openMenuModal;
