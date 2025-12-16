// Global state
let state = {
    cuisine: 'indonesian',
    courseCount: 4,
    selectedMenu: null, // 'A', 'B', or 'C'
    selectedItems: [],
    dietary: {
        vegetarian: false,
        glutenFree: false,
        noPork: false,
        mildSpice: false
    },
    guestCount: 4,
    priceTier: 'standard'
};

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    generateSuggestedMenus();
    setMinDate();
});

function setMinDate() {
    const dateInput = document.getElementById('booking-date');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.min = tomorrow.toISOString().split('T')[0];
}

function initializeEventListeners() {
    // Course selection
    document.querySelectorAll('.course-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.course-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            state.courseCount = parseInt(this.dataset.courses);
            generateSuggestedMenus();
        });
    });

    // Dietary filters
    ['vegetarian', 'gluten-free', 'no-pork', 'mild-spice'].forEach(id => {
        document.getElementById(id).addEventListener('change', function() {
            const key = id.replace('-', '');
            state.dietary[key] = this.checked;
            generateSuggestedMenus();
            if (document.getElementById('step4').style.display !== 'none') {
                renderMenuCard();
            }
        });
    });

    // Menu selection
    document.querySelectorAll('.select-menu-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const menuType = this.dataset.menu;
            selectMenu(menuType);
        });
    });

    // Edit menu button
    document.getElementById('edit-menu-btn').addEventListener('click', function() {
        document.getElementById('step4').style.display = 'block';
        document.getElementById('selected-menu-section').style.display = 'none';
        renderMenuCard();
        document.getElementById('sticky-bar').style.display = 'block';
        document.getElementById('sticky-bar').scrollIntoView({ behavior: 'smooth' });
    });

    // View suggested menu button
    document.getElementById('view-suggested-btn').addEventListener('click', function() {
        document.getElementById('step3').style.display = 'block';
        document.getElementById('step4').style.display = 'none';
        document.getElementById('sticky-bar').style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Book button
    document.getElementById('book-btn').addEventListener('click', function() {
        if (state.selectedItems.length === 0) {
            alert('Please select a menu first');
            return;
        }
        showBookingSection();
    });

    // Confirm booking
    document.getElementById('confirm-booking-btn').addEventListener('click', function() {
        if (validateBookingForm()) {
            processBooking();
        }
    });

    // Guest count change
    document.getElementById('guest-count').addEventListener('change', function() {
        state.guestCount = parseInt(this.value);
        updatePricing();
    });
}

function generateSuggestedMenus() {
    const template = courseTemplates[state.courseCount];
    const filteredMenu = getFilteredMenu();
    
    // Generate 3 different menu variations
    const menuA = generateMenu('A', filteredMenu, template, 'classic');
    const menuB = generateMenu('B', filteredMenu, template, 'premium');
    const menuC = generateMenu('C', filteredMenu, template, 'lighter');
    
    renderMenuPreview('A', menuA);
    renderMenuPreview('B', menuB);
    renderMenuPreview('C', menuC);
    
    document.getElementById('step3').style.display = 'block';
}

function getFilteredMenu() {
    const menu = JSON.parse(JSON.stringify(menuData[state.cuisine]));
    
    // Apply dietary filters
    Object.keys(menu).forEach(category => {
        menu[category] = menu[category].filter(item => {
            if (state.dietary.vegetarian && !item.dietary.veg) return false;
            if (state.dietary.glutenFree && !item.dietary.gf) return false;
            if (state.dietary.noPork && item.dietary.pork) return false;
            if (state.dietary.mildSpice && item.spicy) return false;
            return true;
        });
    });
    
    return menu;
}

function generateMenu(type, menu, template, style) {
    const selected = [];
    const reasons = {};
    
    // Always include required items
    template.required.forEach(req => {
        const category = req === 'nasi' ? 'nasi' : 'sambal';
        if (menu[category] && menu[category].length > 0) {
            const item = menu[category][0];
            selected.push({ ...item, category, round: template.rounds.length });
            reasons[item.id] = 'Essential staple';
        }
    });
    
    // Generate based on style
    template.rounds.forEach((round, roundIndex) => {
        round.items.forEach(category => {
            if (category === 'nasi' || category === 'sambal') return; // Already handled
            
            const available = menu[category] || [];
            if (available.length === 0) return;
            
            const count = round.count[category] || 1;
            let itemsToAdd = [];
            
            if (style === 'classic') {
                // Classic: popular, balanced dishes
                itemsToAdd = available
                    .filter(item => !item.spicy || roundIndex < 2)
                    .slice(0, count);
            } else if (style === 'premium') {
                // Premium: more complex, special dishes
                itemsToAdd = available
                    .filter(item => item.tags.includes('braised') || item.tags.includes('roasted'))
                    .slice(0, count);
                if (itemsToAdd.length < count) {
                    itemsToAdd = available.slice(0, count);
                }
            } else if (style === 'lighter') {
                // Lighter: fresh, steamed, less heavy
                itemsToAdd = available
                    .filter(item => item.tags.includes('fresh') || item.tags.includes('steamed'))
                    .slice(0, count);
                if (itemsToAdd.length < count) {
                    itemsToAdd = available.slice(0, count);
                }
            }
            
            itemsToAdd.forEach(item => {
                if (!selected.find(s => s.id === item.id)) {
                    selected.push({ ...item, category, round: roundIndex + 1 });
                    reasons[item.id] = getReason(item, category, roundIndex);
                }
            });
        });
    });
    
    // Ensure we have at least one main protein
    const hasMain = selected.some(item => item.category === 'utama');
    if (!hasMain && menu.utama && menu.utama.length > 0) {
        const main = menu.utama[0];
        selected.push({ ...main, category: 'utama', round: 2 });
        reasons[main.id] = 'Main protein';
    }
    
    return { items: selected, reasons };
}

function getReason(item, category, round) {
    if (category === 'utama') return 'Main protein';
    if (item.tags.includes('fresh')) return 'Fresh balance';
    if (item.tags.includes('grilled')) return 'Adds char';
    if (item.tags.includes('braised')) return 'Rich flavor';
    if (category === 'sayur') return 'Complements main';
    if (category === 'pembuka') return 'Starts the meal';
    return 'Recommended';
}

function renderMenuPreview(type, menuData) {
    const container = document.getElementById(`preview-${type}`);
    container.innerHTML = '';
    
    const rounds = {};
    menuData.items.forEach(item => {
        if (!rounds[item.round]) rounds[item.round] = [];
        rounds[item.round].push(item);
    });
    
    Object.keys(rounds).sort().forEach(roundNum => {
        const roundDiv = document.createElement('div');
        roundDiv.className = 'course-block';
        roundDiv.innerHTML = `<div class="course-block-title">Round ${roundNum}</div>`;
        
        rounds[roundNum].forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'dish-item';
            const badge = item.round <= 2 ? 'badge-recommended' : 'badge-included';
            const badgeText = item.round <= 2 ? '⭐ Recommended' : '✅ Included';
            itemDiv.innerHTML = `
                <span class="dish-badge ${badge}">${badgeText}</span>
                <span class="dish-name">${item.name}</span>
                <span class="dish-reason">${menuData.reasons[item.id] || ''}</span>
            `;
            roundDiv.appendChild(itemDiv);
        });
        
        container.appendChild(roundDiv);
    });
}

function selectMenu(type) {
    state.selectedMenu = type;
    const template = courseTemplates[state.courseCount];
    const filteredMenu = getFilteredMenu();
    
    let menuData;
    if (type === 'A') {
        menuData = generateMenu('A', filteredMenu, template, 'classic');
    } else if (type === 'B') {
        menuData = generateMenu('B', filteredMenu, template, 'premium');
    } else {
        menuData = generateMenu('C', filteredMenu, template, 'lighter');
    }
    
    state.selectedItems = menuData.items;
    
    document.getElementById('step3').style.display = 'none';
    document.getElementById('selected-menu-section').style.display = 'block';
    renderSelectedMenu();
}

function renderSelectedMenu() {
    const container = document.getElementById('selected-menu-display');
    container.innerHTML = '';
    
    const rounds = {};
    state.selectedItems.forEach(item => {
        if (!rounds[item.round]) rounds[item.round] = [];
        rounds[item.round].push(item);
    });
    
    Object.keys(rounds).sort().forEach(roundNum => {
        const roundDiv = document.createElement('div');
        roundDiv.className = 'course-block';
        roundDiv.innerHTML = `<div class="course-block-title">Round ${roundNum}</div>`;
        
        rounds[roundNum].forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'dish-item';
            itemDiv.innerHTML = `
                <span class="dish-badge badge-included">✅</span>
                <span class="dish-name">${item.name}</span>
                <span class="dish-reason">${item.description}</span>
            `;
            roundDiv.appendChild(itemDiv);
        });
        
        container.appendChild(roundDiv);
    });
    
    updateStickyBar();
}

function renderMenuCard() {
    const container = document.getElementById('menu-card');
    container.innerHTML = '';
    
    const menu = menuData[state.cuisine];
    const categories = [
        { key: 'krupuk', name: 'Krupuk / Crackers' },
        { key: 'pembuka', name: 'Pembuka / Small' },
        { key: 'utama', name: 'Utama / Large' },
        { key: 'sayur', name: 'Sayur / Vegetable sides' },
        { key: 'nasi', name: 'Nasi / Rice' },
        { key: 'sambal', name: 'Sambal / Chili' }
    ];
    
    categories.forEach(cat => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'menu-category';
        
        const header = document.createElement('div');
        header.className = 'category-header';
        header.textContent = cat.name;
        categoryDiv.appendChild(header);
        
        const items = menu[cat.key] || [];
        items.forEach(item => {
            // Apply dietary filters
            if (state.dietary.vegetarian && !item.dietary.veg) return;
            if (state.dietary.glutenFree && !item.dietary.gf) return;
            if (state.dietary.noPork && item.dietary.pork) return;
            if (state.dietary.mildSpice && item.spicy) return;
            
            const itemDiv = document.createElement('div');
            itemDiv.className = 'menu-item';
            if (state.selectedItems.find(si => si.id === item.id)) {
                itemDiv.classList.add('selected');
            }
            
            const tags = [];
            if (item.spicy) tags.push('<span class="tag spicy">🌶 Spicy</span>');
            if (item.dietary.veg) tags.push('<span class="tag vegetarian">🌿 Veg</span>');
            if (item.dietary.gf) tags.push('<span class="tag gluten-free">GF</span>');
            if (item.dietary.pork) tags.push('<span class="tag pork">🐷 Pork</span>');
            
            const isSelected = state.selectedItems.find(si => si.id === item.id);
            const actionBtn = isSelected 
                ? `<button class="item-btn btn-remove" onclick="removeItem('${item.id}', '${cat.key}')">Remove</button>`
                : `<button class="item-btn btn-add" onclick="addItem('${item.id}', '${cat.key}')">Add</button>`;
            
            itemDiv.innerHTML = `
                <div class="menu-item-info">
                    <div class="menu-item-name">${item.name}</div>
                    <div class="menu-item-desc">${item.description}</div>
                    <div class="menu-item-tags">${tags.join('')}</div>
                </div>
                <div class="menu-item-actions">
                    ${actionBtn}
                </div>
            `;
            
            categoryDiv.appendChild(itemDiv);
        });
        
        container.appendChild(categoryDiv);
    });
    
    updateStickyBar();
}

function addItem(itemId, category) {
    const menu = menuData[state.cuisine];
    const item = menu[category].find(i => i.id === itemId);
    if (item) {
        const template = courseTemplates[state.courseCount];
        // Find appropriate round
        const round = template.rounds.find(r => r.items.includes(category))?.round || 1;
        state.selectedItems.push({ ...item, category, round });
        renderMenuCard();
    }
}

function removeItem(itemId, category) {
    const template = courseTemplates[state.courseCount];
    const required = template.required.map(r => r === 'nasi' ? 'nasi' : 'sambal');
    
    const item = state.selectedItems.find(si => si.id === itemId);
    if (item && required.includes(item.category)) {
        if (!confirm('This is a recommended staple. Are you sure you want to remove it?')) {
            return;
        }
    }
    
    state.selectedItems = state.selectedItems.filter(si => si.id !== itemId);
    renderMenuCard();
}

function updateStickyBar() {
    const count = state.selectedItems.length;
    document.getElementById('selected-count').textContent = `${count} dishes selected`;
    document.getElementById('sticky-count').textContent = `${count} dishes`;
    
    const price = calculatePrice();
    document.getElementById('sticky-price').textContent = `$${price}`;
}

function calculatePrice() {
    const basePrice = pricing[state.priceTier].base;
    const perCourse = pricing[state.priceTier].perCourse;
    const total = (basePrice + (perCourse * state.courseCount)) * state.guestCount;
    return total;
}

function showBookingSection() {
    document.getElementById('step5').style.display = 'block';
    document.getElementById('sticky-bar').style.display = 'none';
    renderBookingSummary();
    updatePricing();
    window.scrollTo({ top: document.getElementById('step5').offsetTop - 20, behavior: 'smooth' });
}

function renderBookingSummary() {
    const container = document.getElementById('booking-summary');
    const rounds = {};
    state.selectedItems.forEach(item => {
        if (!rounds[item.round]) rounds[item.round] = [];
        rounds[item.round].push(item);
    });
    
    let html = '<h3>Your Menu Selection</h3>';
    Object.keys(rounds).sort().forEach(roundNum => {
        html += `<div style="margin-bottom: 15px;"><strong>Round ${roundNum}:</strong> `;
        html += rounds[roundNum].map(item => item.name).join(', ');
        html += '</div>';
    });
    
    container.innerHTML = html;
}

function updatePricing() {
    const total = calculatePrice();
    const deposit = Math.round(total * 0.3);
    const payNow = deposit;
    
    document.getElementById('menu-total-price').textContent = `$${total}`;
    document.getElementById('deposit-amount').textContent = `$${deposit}`;
    document.getElementById('pay-now-amount').textContent = `$${payNow}`;
}

function validateBookingForm() {
    const date = document.getElementById('booking-date').value;
    const time = document.getElementById('booking-time').value;
    const name = document.getElementById('guest-name').value;
    const email = document.getElementById('guest-email').value;
    const phone = document.getElementById('guest-phone').value;
    
    if (!date || !time || !name || !email || !phone) {
        alert('Please fill in all required fields');
        return false;
    }
    
    if (!email.includes('@')) {
        alert('Please enter a valid email address');
        return false;
    }
    
    return true;
}

function processBooking() {
    // Simulate booking processing
    const bookingData = {
        menu: state.selectedItems,
        guestCount: state.guestCount,
        date: document.getElementById('booking-date').value,
        time: document.getElementById('booking-time').value,
        name: document.getElementById('guest-name').value,
        email: document.getElementById('guest-email').value,
        phone: document.getElementById('guest-phone').value,
        total: calculatePrice(),
        deposit: Math.round(calculatePrice() * 0.3)
    };
    
    console.log('Booking processed:', bookingData);
    
    // Show success modal
    document.getElementById('success-modal').style.display = 'flex';
}

// Make functions available globally for onclick handlers
window.addItem = addItem;
window.removeItem = removeItem;

