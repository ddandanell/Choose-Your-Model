// Menu Data Structure
const menuData = {
    indonesian: {
        krupuk: [
            { id: 'k1', name: 'Krupuk Udang', description: 'Crispy shrimp crackers', tags: ['crunchy'], dietary: { veg: false, gf: false, pork: false }, spicy: false },
            { id: 'k2', name: 'Krupuk Ikan', description: 'Fish crackers', tags: ['crunchy'], dietary: { veg: false, gf: false, pork: false }, spicy: false },
            { id: 'k3', name: 'Krupuk Putih', description: 'Plain rice crackers', tags: ['crunchy'], dietary: { veg: true, gf: true, pork: false }, spicy: false }
        ],
        pembuka: [
            { id: 'p1', name: 'Gado-Gado', description: 'Fresh vegetable salad with peanut sauce', tags: ['fresh', 'vegetable'], dietary: { veg: true, gf: true, pork: false }, spicy: false },
            { id: 'p2', name: 'Pepes Ikan', description: 'Steamed fish in banana leaf', tags: ['steamed', 'fresh'], dietary: { veg: false, gf: true, pork: false }, spicy: true },
            { id: 'p3', name: 'Sate Ayam', description: 'Grilled chicken skewers with peanut sauce', tags: ['grilled'], dietary: { veg: false, gf: true, pork: false }, spicy: false },
            { id: 'p4', name: 'Lumpia', description: 'Spring rolls with vegetables', tags: ['fried', 'fresh'], dietary: { veg: true, gf: false, pork: false }, spicy: false },
            { id: 'p5', name: 'Perkedel', description: 'Potato fritters', tags: ['fried'], dietary: { veg: true, gf: true, pork: false }, spicy: false },
            { id: 'p6', name: 'Otak-Otak', description: 'Grilled fish cake in banana leaf', tags: ['grilled'], dietary: { veg: false, gf: true, pork: false }, spicy: true }
        ],
        utama: [
            { id: 'u1', name: 'Rendang', description: 'Slow-cooked beef in coconut and spices', tags: ['braised', 'coconut-heavy'], dietary: { veg: false, gf: true, pork: false }, spicy: true },
            { id: 'u2', name: 'Nasi Goreng', description: 'Indonesian fried rice with egg', tags: ['fried'], dietary: { veg: false, gf: false, pork: false }, spicy: true },
            { id: 'u3', name: 'Ayam Goreng', description: 'Crispy fried chicken with spices', tags: ['fried', 'grilled'], dietary: { veg: false, gf: true, pork: false }, spicy: false },
            { id: 'u4', name: 'Ikan Bakar', description: 'Grilled fish with sambal', tags: ['grilled'], dietary: { veg: false, gf: true, pork: false }, spicy: true },
            { id: 'u5', name: 'Babi Guling', description: 'Balinese roast pork', tags: ['roasted'], dietary: { veg: false, gf: true, pork: true }, spicy: false },
            { id: 'u6', name: 'Sate Kambing', description: 'Grilled lamb skewers', tags: ['grilled'], dietary: { veg: false, gf: true, pork: false }, spicy: false },
            { id: 'u7', name: 'Gudeg', description: 'Young jackfruit curry', tags: ['braised', 'coconut-heavy'], dietary: { veg: true, gf: true, pork: false }, spicy: false },
            { id: 'u8', name: 'Rawon', description: 'Black beef soup', tags: ['soup'], dietary: { veg: false, gf: true, pork: false }, spicy: true },
            { id: 'u9', name: 'Soto Ayam', description: 'Chicken soup with turmeric', tags: ['soup', 'fresh'], dietary: { veg: false, gf: true, pork: false }, spicy: false }
        ],
        sayur: [
            { id: 's1', name: 'Sayur Lodeh', description: 'Vegetable curry in coconut milk', tags: ['braised', 'coconut-heavy'], dietary: { veg: true, gf: true, pork: false }, spicy: false },
            { id: 's2', name: 'Capcay', description: 'Stir-fried mixed vegetables', tags: ['fried', 'fresh'], dietary: { veg: true, gf: true, pork: false }, spicy: false },
            { id: 's3', name: 'Tumis Kangkung', description: 'Stir-fried water spinach', tags: ['fried', 'fresh'], dietary: { veg: true, gf: true, pork: false }, spicy: true },
            { id: 's4', name: 'Urap', description: 'Steamed vegetables with spiced coconut', tags: ['fresh'], dietary: { veg: true, gf: true, pork: false }, spicy: true },
            { id: 's5', name: 'Pepes Tahu', description: 'Steamed tofu in banana leaf', tags: ['steamed', 'fresh'], dietary: { veg: true, gf: true, pork: false }, spicy: true }
        ],
        nasi: [
            { id: 'n1', name: 'Nasi Putih', description: 'Steamed jasmine rice', tags: ['staple'], dietary: { veg: true, gf: true, pork: false }, spicy: false },
            { id: 'n2', name: 'Nasi Kuning', description: 'Turmeric rice', tags: ['staple'], dietary: { veg: true, gf: true, pork: false }, spicy: false }
        ],
        sambal: [
            { id: 'sb1', name: 'Sambal Terasi', description: 'Shrimp paste chili sauce', tags: ['spicy'], dietary: { veg: false, gf: true, pork: false }, spicy: true },
            { id: 'sb2', name: 'Sambal Matah', description: 'Raw chili relish', tags: ['fresh', 'spicy'], dietary: { veg: true, gf: true, pork: false }, spicy: true },
            { id: 'sb3', name: 'Sambal Kecap', description: 'Sweet soy chili sauce', tags: ['spicy'], dietary: { veg: true, gf: true, pork: false }, spicy: false }
        ]
    }
};

// Course Templates
const courseTemplates = {
    3: {
        name: 'Simple',
        rounds: [
            { round: 1, items: ['krupuk', 'pembuka'], count: { krupuk: 1, pembuka: 2 } },
            { round: 2, items: ['utama'], count: { utama: 2 } },
            { round: 3, items: ['sayur', 'nasi', 'sambal'], count: { sayur: 2, nasi: 1, sambal: 1 } }
        ],
        required: ['nasi', 'sambal'],
        maxSpicy: 1
    },
    4: {
        name: 'Recommended',
        rounds: [
            { round: 1, items: ['krupuk', 'pembuka'], count: { krupuk: 1, pembuka: 2 } },
            { round: 2, items: ['utama'], count: { utama: 1 } },
            { round: 3, items: ['utama', 'sayur'], count: { utama: 1, sayur: 2 } },
            { round: 4, items: ['nasi', 'sambal', 'pembuka'], count: { nasi: 1, sambal: 1, pembuka: 1 } }
        ],
        required: ['nasi', 'sambal'],
        maxSpicy: 1
    },
    5: {
        name: 'Full Experience',
        rounds: [
            { round: 1, items: ['krupuk', 'sambal'], count: { krupuk: 1, sambal: 2 } },
            { round: 2, items: ['pembuka'], count: { pembuka: 2 } },
            { round: 3, items: ['utama'], count: { utama: 1 } },
            { round: 4, items: ['utama', 'sayur'], count: { utama: 1, sayur: 2 } },
            { round: 5, items: ['nasi', 'sambal', 'sayur'], count: { nasi: 1, sambal: 1, sayur: 1 } }
        ],
        required: ['nasi', 'sambal'],
        maxSpicy: 2
    }
};

// Pricing (per person, in USD)
const pricing = {
    standard: {
        base: 45,
        perCourse: 10
    },
    premium: {
        base: 65,
        perCourse: 15
    },
    luxury: {
        base: 95,
        perCourse: 25
    }
};

