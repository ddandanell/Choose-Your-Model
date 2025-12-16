// Menu Data Structure
const menuData = {
    smallBites: [
        {
            id: 'krupuk_sambal_flight',
            name: 'Krupuk + Sambal Flight',
            description: 'Sambal matah, sambal bajak, sambal ijo',
            vegetarian: false,
            spicy: true
        },
        {
            id: 'sate_lilit',
            name: 'Sate Lilit',
            description: 'Balinese minced fish satay',
            vegetarian: false,
            spicy: false
        },
        {
            id: 'tempe_mendoan',
            name: 'Tempe Mendoan',
            description: 'Thin, crispy tempe with kecap + chili',
            vegetarian: true,
            spicy: true
        },
        {
            id: 'perkedel_jagung',
            name: 'Perkedel Jagung',
            description: 'Sweet corn fritters with chili-lime',
            vegetarian: true,
            spicy: true
        },
        {
            id: 'bakwan_sayur',
            name: 'Bakwan Sayur',
            description: 'Vegetable fritters with spicy dipping sauce',
            vegetarian: true,
            spicy: true
        }
    ],
    starters: [
        {
            id: 'gado_gado',
            name: 'Gado-Gado',
            description: 'Vegetables, tempe, peanut sauce, egg',
            vegetarian: true,
            spicy: false
        },
        {
            id: 'soto_ayam',
            name: 'Soto Ayam',
            description: 'Indonesian chicken soup, aromatic and comforting',
            vegetarian: false,
            spicy: false
        },
        {
            id: 'pempek_palembang',
            name: 'Pempek Palembang',
            description: 'Fish cakes with cuko sweet-sour chili vinegar',
            vegetarian: false,
            spicy: true
        },
        {
            id: 'tuna_sambal_matah',
            name: 'Tuna Sambal Matah',
            description: 'Light seared tuna with Balinese raw sambal',
            vegetarian: false,
            spicy: true
        },
        {
            id: 'lumpia_semarang',
            name: 'Lumpia Semarang',
            description: 'Crispy spring rolls with sweet chili',
            vegetarian: true,
            spicy: true
        }
    ],
    beforeMain: [
        {
            id: 'rawon',
            name: 'Rawon (small bowl)',
            description: 'East Java black beef soup, deep flavor',
            vegetarian: false,
            spicy: true
        },
        {
            id: 'sayur_asem',
            name: 'Sayur Asem (small bowl)',
            description: 'Tamarind vegetable soup, refreshing',
            vegetarian: true,
            spicy: false
        },
        {
            id: 'pepes_ikan',
            name: 'Pepes Ikan (mini portion)',
            description: 'Fish steamed in banana leaf, aromatic',
            vegetarian: false,
            spicy: true
        },
        {
            id: 'opor_tahu',
            name: 'Opor Tahu / Vegetable Curry (small)',
            description: 'Gentle coconut curry, vegetarian-friendly',
            vegetarian: true,
            spicy: false
        },
        {
            id: 'urap_sayur',
            name: 'Urap Sayur',
            description: 'Steamed greens with coconut spice mix, very Balinese',
            vegetarian: true,
            spicy: true
        }
    ],
    main: [
        {
            id: 'rendang_sapi',
            name: 'Rendang Sapi',
            description: 'Slow-cooked beef rendang, West Sumatra icon',
            vegetarian: false,
            spicy: true
        },
        {
            id: 'bebek_betutu',
            name: 'Bebek Betutu',
            description: 'Balinese slow-cooked spiced duck',
            vegetarian: false,
            spicy: true
        },
        {
            id: 'ikan_bakar',
            name: 'Ikan Bakar',
            description: 'Grilled fish with sambal + kecap, Bali classic',
            vegetarian: false,
            spicy: true
        },
        {
            id: 'ayam_taliwang',
            name: 'Ayam Taliwang',
            description: 'Spicy Lombok grilled chicken',
            vegetarian: false,
            spicy: true
        },
        {
            id: 'babi_guling',
            name: 'Babi Guling-style Pork Belly',
            description: 'If pork allowed; otherwise swap to chicken/duck',
            vegetarian: false,
            spicy: false
        }
    ],
    dessert: [
        {
            id: 'dadar_gulung',
            name: 'Dadar Gulung',
            description: 'Pandan crepe with coconut palm sugar filling',
            vegetarian: true,
            spicy: false
        },
        {
            id: 'klepon',
            name: 'Klepon',
            description: 'Glutinous rice balls, palm sugar center, coconut',
            vegetarian: true,
            spicy: false
        },
        {
            id: 'es_campur',
            name: 'Es Campur / Es Teler',
            description: 'Tropical fruit, coconut, shaved ice',
            vegetarian: true,
            spicy: false
        },
        {
            id: 'pisang_goreng',
            name: 'Pisang Goreng + Gula Aren Sauce',
            description: 'Fried banana with palm sugar caramel',
            vegetarian: true,
            spicy: false
        },
        {
            id: 'bubur_injin',
            name: 'Bubur Injin',
            description: 'Black rice pudding with coconut cream',
            vegetarian: true,
            spicy: false
        }
    ]
};

// Pricing Matrix
const pricingMatrix = {
    3: {
        standard: 450000,
        premium: 650000,
        luxury: 950000,
        minimum: 4
    },
    4: {
        standard: 550000,
        premium: 800000,
        luxury: 1200000,
        minimum: 4
    },
    5: {
        standard: 750000,
        premium: 1050000,
        luxury: 1600000,
        minimum: 6
    }
};

// Kids Menu (Indonesian + Western mix)
const kidsMenuData = {
    smallBites: [
        {
            id: 'kids_krupuk',
            name: 'Krupuk (Indonesian crackers)',
            description: 'Crispy Indonesian crackers',
            vegetarian: true,
            spicy: false
        },
        {
            id: 'kids_chicken_nuggets',
            name: 'Chicken Nuggets',
            description: 'Crispy chicken nuggets with mild sauce',
            vegetarian: false,
            spicy: false
        },
        {
            id: 'kids_spring_rolls',
            name: 'Mini Spring Rolls',
            description: 'Small vegetable spring rolls',
            vegetarian: true,
            spicy: false
        }
    ],
    starters: [
        {
            id: 'kids_chicken_soup',
            name: 'Chicken Soup',
            description: 'Mild Indonesian-style chicken soup',
            vegetarian: false,
            spicy: false
        },
        {
            id: 'kids_pasta',
            name: 'Pasta with Tomato Sauce',
            description: 'Simple pasta with mild tomato sauce',
            vegetarian: true,
            spicy: false
        },
        {
            id: 'kids_fried_rice',
            name: 'Nasi Goreng (Mild)',
            description: 'Indonesian fried rice, mild version',
            vegetarian: false,
            spicy: false
        }
    ],
    beforeMain: [
        {
            id: 'kids_vegetable_soup',
            name: 'Vegetable Soup',
            description: 'Light vegetable soup',
            vegetarian: true,
            spicy: false
        },
        {
            id: 'kids_macaroni',
            name: 'Macaroni & Cheese',
            description: 'Creamy macaroni and cheese',
            vegetarian: true,
            spicy: false
        }
    ],
    main: [
        {
            id: 'kids_chicken_teriyaki',
            name: 'Chicken Teriyaki',
            description: 'Sweet teriyaki chicken, mild',
            vegetarian: false,
            spicy: false
        },
        {
            id: 'kids_fish_fingers',
            name: 'Fish Fingers',
            description: 'Crispy fish fingers with mild sauce',
            vegetarian: false,
            spicy: false
        },
        {
            id: 'kids_chicken_satay',
            name: 'Chicken Satay (Mild)',
            description: 'Indonesian chicken satay, mild version',
            vegetarian: false,
            spicy: false
        },
        {
            id: 'kids_spaghetti',
            name: 'Spaghetti Bolognese',
            description: 'Classic spaghetti with mild meat sauce',
            vegetarian: false,
            spicy: false
        }
    ],
    dessert: [
        {
            id: 'kids_ice_cream',
            name: 'Ice Cream',
            description: 'Vanilla or chocolate ice cream',
            vegetarian: true,
            spicy: false
        },
        {
            id: 'kids_pancakes',
            name: 'Pancakes',
            description: 'Sweet pancakes with syrup',
            vegetarian: true,
            spicy: false
        },
        {
            id: 'kids_fruit_salad',
            name: 'Fruit Salad',
            description: 'Fresh tropical fruit salad',
            vegetarian: true,
            spicy: false
        }
    ]
};

// Default menu selections (first item in each category)
const defaultMenus = {
    3: {
        smallBite: 'krupuk_sambal_flight',
        starter: 'gado_gado',
        main: 'rendang_sapi'
    },
    4: {
        smallBite: 'krupuk_sambal_flight',
        starter: 'gado_gado',
        beforeMain: 'rawon',
        main: 'rendang_sapi'
    },
    5: {
        smallBite: 'krupuk_sambal_flight',
        starter: 'gado_gado',
        beforeMain: 'rawon',
        main: 'rendang_sapi',
        dessert: 'dadar_gulung'
    }
};

// Default kids menu selections
const defaultKidsMenus = {
    3: {
        smallBite: 'kids_krupuk',
        starter: 'kids_chicken_soup',
        main: 'kids_chicken_teriyaki'
    },
    4: {
        smallBite: 'kids_krupuk',
        starter: 'kids_chicken_soup',
        beforeMain: 'kids_vegetable_soup',
        main: 'kids_chicken_teriyaki'
    },
    5: {
        smallBite: 'kids_krupuk',
        starter: 'kids_chicken_soup',
        beforeMain: 'kids_vegetable_soup',
        main: 'kids_chicken_teriyaki',
        dessert: 'kids_ice_cream'
    }
};

