// Menu Data Structure
const menuData = {
    smallBites: [
        {
            id: 'krupuk_sambal_flight',
            name: 'Krupuk + Sambal Flight',
            description: 'Sambal matah, sambal bajak, sambal ijo',
            detailedDescription: 'A delightful trio of Indonesian sambals (chili pastes) served with crispy krupuk crackers. Sambal matah is a fresh, raw Balinese sambal with shallots, lemongrass, and lime. Sambal bajak is a rich, cooked sambal with tomatoes and palm sugar. Sambal ijo is a green chili sambal from West Sumatra. Perfect for awakening your palate before the main meal.',
            vegetarian: false,
            spicy: true
        },
        {
            id: 'sate_lilit',
            name: 'Sate Lilit',
            description: 'Balinese minced fish satay',
            detailedDescription: 'A signature Balinese dish where minced fish (usually tuna or snapper) is mixed with grated coconut, lime leaves, and aromatic spices, then wrapped around lemongrass stalks and grilled. The result is a fragrant, tender satay with a unique texture and smoky flavor. This is one of Bali\'s most beloved street foods, elevated for fine dining.',
            vegetarian: false,
            spicy: false,
            meatType: 'fish'
        },
        {
            id: 'tempe_mendoan',
            name: 'Tempe Mendoan',
            description: 'Thin, crispy tempe with kecap + chili',
            detailedDescription: 'A Javanese specialty featuring thinly sliced tempe (fermented soybean cake) that\'s lightly battered and fried until crispy on the outside but still soft inside. Served with kecap manis (sweet soy sauce) and fresh chili. The name "mendoan" means "half-cooked" - the tempe should be crispy but not overdone. A beloved Indonesian snack that\'s both healthy and delicious.',
            vegetarian: true,
            spicy: true
        },
        {
            id: 'perkedel_jagung',
            name: 'Perkedel Jagung',
            description: 'Sweet corn fritters with chili-lime',
            detailedDescription: 'Crispy corn fritters made from fresh sweet corn, mixed with herbs and spices, then deep-fried to golden perfection. Served with a tangy chili-lime dipping sauce that balances the sweetness of the corn. These fritters are a popular Indonesian street food, combining the natural sweetness of corn with savory spices. Perfect for those who love crispy, flavorful bites.',
            vegetarian: true,
            spicy: true
        },
        {
            id: 'bakwan_sayur',
            name: 'Bakwan Sayur',
            description: 'Vegetable fritters with spicy dipping sauce',
            detailedDescription: 'Indonesian vegetable fritters made from a mix of shredded vegetables (carrots, cabbage, bean sprouts) bound together with a light batter and fried until golden and crispy. Served with a spicy, tangy dipping sauce. These fritters are a beloved Indonesian snack, offering a perfect balance of crispy texture and fresh vegetable flavors. Great for vegetarians and a favorite among children.',
            vegetarian: true,
            spicy: true
        }
    ],
    starters: [
        {
            id: 'gado_gado',
            name: 'Gado-Gado',
            description: 'Vegetables, tempe, peanut sauce, egg',
            detailedDescription: 'Indonesia\'s most famous salad, featuring a colorful mix of blanched vegetables (long beans, cabbage, bean sprouts, spinach), boiled potatoes, hard-boiled eggs, and fried tempe, all drizzled with a rich, creamy peanut sauce. The sauce is made from ground peanuts, palm sugar, tamarind, and spices. This dish is a complete meal in itself, offering protein, vegetables, and complex flavors. A national favorite that represents Indonesian cuisine at its best.',
            vegetarian: true,
            spicy: false
        },
        {
            id: 'soto_ayam',
            name: 'Soto Ayam',
            description: 'Indonesian chicken soup, aromatic and comforting',
            detailedDescription: 'A fragrant, turmeric-based chicken soup that\'s one of Indonesia\'s most beloved comfort foods. The broth is infused with lemongrass, galangal, lime leaves, and other aromatic spices. Served with shredded chicken, rice noodles, bean sprouts, and a side of sambal and lime. This soup is warming, nourishing, and deeply satisfying. Perfect for those who enjoy aromatic, flavorful soups with complex spice profiles.',
            vegetarian: false,
            spicy: false,
            meatType: 'chicken'
        },
        {
            id: 'pempek_palembang',
            name: 'Pempek Palembang',
            description: 'Fish cakes with cuko sweet-sour chili vinegar',
            detailedDescription: 'A specialty from Palembang, South Sumatra, featuring fish cakes made from ground fish (usually tenggiri/mackerel) mixed with tapioca flour, then boiled or fried. Served with cuko, a distinctive sweet-sour sauce made from palm sugar, tamarind, garlic, and chili. The texture is springy and chewy, while the sauce provides a perfect balance of sweet, sour, and spicy. This is a regional delicacy that showcases the diversity of Indonesian cuisine.',
            vegetarian: false,
            spicy: true,
            meatType: 'fish'
        },
        {
            id: 'tuna_sambal_matah',
            name: 'Tuna Sambal Matah',
            description: 'Light seared tuna with Balinese raw sambal',
            detailedDescription: 'Fresh, high-quality tuna lightly seared on the outside while remaining rare inside, served with sambal matah - a raw Balinese sambal made from finely chopped shallots, lemongrass, bird\'s eye chilies, lime leaves, and coconut oil. The sambal is mixed fresh and provides a bright, zesty, and spicy contrast to the rich tuna. This dish combines the best of Indonesian flavors with modern culinary techniques, perfect for seafood lovers.',
            vegetarian: false,
            spicy: true,
            meatType: 'fish'
        },
        {
            id: 'lumpia_semarang',
            name: 'Lumpia Semarang',
            description: 'Crispy spring rolls with sweet chili',
            detailedDescription: 'A specialty from Semarang, Central Java, featuring crispy spring rolls filled with a savory mixture of bamboo shoots, chicken, and vegetables. The filling is seasoned with garlic, shallots, and sweet soy sauce. Served with a sweet, tangy chili sauce that complements the crispy texture. These lumpia are larger and more substantial than typical spring rolls, representing the Chinese-Indonesian fusion cuisine that\'s integral to Indonesian food culture.',
            vegetarian: true,
            spicy: true
        }
    ],
    beforeMain: [
        {
            id: 'rawon',
            name: 'Rawon (small bowl)',
            description: 'East Java black beef soup, deep flavor',
            detailedDescription: 'A distinctive black beef soup from East Java, famous for its unique color derived from keluak (black nuts). The soup features tender beef simmered in a rich, aromatic broth with spices like galangal, lemongrass, and turmeric. Served with bean sprouts, lime, and sambal. The keluak gives it a deep, earthy flavor that\'s both complex and comforting. This is a regional specialty that showcases the depth of Javanese cuisine.',
            vegetarian: false,
            spicy: true,
            meatType: 'beef'
        },
        {
            id: 'sayur_asem',
            name: 'Sayur Asem (small bowl)',
            description: 'Tamarind vegetable soup, refreshing',
            detailedDescription: 'A refreshing, tangy vegetable soup from West Java, made with tamarind for its distinctive sour flavor. Contains a variety of vegetables like corn, long beans, chayote, and melinjo leaves, all cooked in a light, tangy broth. The tamarind provides a clean, refreshing sourness that\'s perfect for cleansing the palate between courses. This soup is light, healthy, and represents the balance of flavors in Indonesian cuisine.',
            vegetarian: true,
            spicy: false
        },
        {
            id: 'pepes_ikan',
            name: 'Pepes Ikan (mini portion)',
            description: 'Fish steamed in banana leaf, aromatic',
            detailedDescription: 'Fish (usually snapper or mackerel) marinated in a spice paste, wrapped in banana leaves, and steamed or grilled. The banana leaves impart a unique, aromatic flavor while keeping the fish moist and tender. The spice paste typically includes turmeric, galangal, shallots, garlic, and chilies. This cooking method is traditional throughout Indonesia and creates a dish that\'s both aromatic and flavorful. The banana leaf wrapping is part of the presentation and flavor.',
            vegetarian: false,
            spicy: true,
            meatType: 'fish'
        },
        {
            id: 'opor_tahu',
            name: 'Opor Tahu / Vegetable Curry (small)',
            description: 'Gentle coconut curry, vegetarian-friendly',
            detailedDescription: 'A mild, creamy coconut curry featuring tofu and vegetables. Opor is a Javanese curry style that\'s gentler and less spicy than other Indonesian curries, making it perfect for those who prefer milder flavors. The coconut milk creates a rich, creamy base, while the spices (turmeric, coriander, galangal) provide subtle warmth. This dish is vegetarian-friendly and represents the more delicate side of Indonesian cuisine, perfect as an intermezzo course.',
            vegetarian: true,
            spicy: false
        },
        {
            id: 'urap_sayur',
            name: 'Urap Sayur',
            description: 'Steamed greens with coconut spice mix, very Balinese',
            detailedDescription: 'A traditional Balinese dish featuring steamed vegetables (long beans, spinach, bean sprouts, cabbage) tossed with a spiced coconut dressing. The dressing is made from grated coconut, shallots, garlic, chilies, and lime, creating a fresh, aromatic coating. This dish is served at room temperature and provides a refreshing, crunchy contrast to richer dishes. It\'s a staple in Balinese cuisine and showcases the island\'s love for fresh, vibrant flavors.',
            vegetarian: true,
            spicy: true
        }
    ],
    main: [
        {
            id: 'rendang_sapi',
            name: 'Rendang Sapi',
            description: 'Slow-cooked beef rendang, West Sumatra icon',
            detailedDescription: 'Often called the "world\'s most delicious food," rendang is a slow-cooked dry curry from West Sumatra. Beef is simmered for hours in coconut milk and a complex spice paste until the liquid evaporates and the meat becomes incredibly tender and flavorful. The spices include galangal, turmeric, lemongrass, chilies, and other aromatics. The result is a rich, deeply flavored dish where the meat is so tender it falls apart. This is Indonesia\'s most famous dish and a true culinary masterpiece.',
            vegetarian: false,
            spicy: true,
            meatType: 'beef'
        },
        {
            id: 'bebek_betutu',
            name: 'Bebek Betutu',
            description: 'Balinese slow-cooked spiced duck',
            detailedDescription: 'A ceremonial Balinese dish featuring whole duck (or chicken) stuffed with a complex spice paste, wrapped in banana leaves, and slow-cooked for hours. The spice paste includes turmeric, ginger, galangal, shallots, garlic, chilies, and other aromatics. The long, slow cooking process results in incredibly tender, flavorful meat that falls off the bone. This dish is traditionally served at important ceremonies and represents the pinnacle of Balinese cooking. Rich, aromatic, and deeply satisfying.',
            vegetarian: false,
            spicy: true,
            meatType: 'duck'
        },
        {
            id: 'ikan_bakar',
            name: 'Ikan Bakar',
            description: 'Grilled fish with sambal + kecap, Bali classic',
            detailedDescription: 'A Balinese classic featuring whole fish (usually snapper or sea bass) marinated in a spice paste, then grilled over charcoal until the skin is crispy and the flesh is tender. Served with sambal matah (raw Balinese sambal) and kecap manis (sweet soy sauce). The grilling technique creates a smoky flavor while keeping the fish moist. This dish is a staple of Balinese beachside dining and represents the island\'s love for fresh seafood and bold flavors. Perfect for seafood enthusiasts.',
            vegetarian: false,
            spicy: true,
            meatType: 'fish'
        },
        {
            id: 'ayam_taliwang',
            name: 'Ayam Taliwang',
            description: 'Spicy Lombok grilled chicken',
            detailedDescription: 'A fiery specialty from Lombok, featuring chicken marinated in a spicy paste made from chilies, shallots, garlic, and other spices, then grilled to perfection. The marinade is intensely spicy and flavorful, creating a dish that\'s both bold and addictive. Named after Taliwang village in Lombok, this dish showcases the island\'s love for spicy food. The chicken is typically served with plecing kangkung (spicy water spinach) and rice. For those who love heat and bold flavors, this is an unforgettable experience.',
            vegetarian: false,
            spicy: true,
            meatType: 'chicken'
        },
        {
            id: 'babi_guling',
            name: 'Babi Guling-style Pork Belly',
            description: 'If pork allowed; otherwise swap to chicken/duck',
            detailedDescription: 'Inspired by Bali\'s famous babi guling (suckling pig), this dish features pork belly (or chicken/duck if pork is not allowed) slow-roasted with a complex spice paste. The spices include turmeric, coriander, galangal, and other aromatics. The result is crispy skin and tender, flavorful meat. This is one of Bali\'s most celebrated dishes, traditionally served at ceremonies and special occasions. Rich, indulgent, and deeply satisfying. If dietary restrictions don\'t allow pork, we\'ll prepare the same spice treatment with chicken or duck.',
            vegetarian: false,
            spicy: false,
            meatType: 'pork'
        }
    ],
    dessert: [
        {
            id: 'dadar_gulung',
            name: 'Dadar Gulung',
            description: 'Pandan crepe with coconut palm sugar filling',
            detailedDescription: 'A beloved Indonesian dessert featuring thin, green crepes made from pandan (screwpine) leaves, filled with sweetened grated coconut and palm sugar. The pandan gives the crepes a beautiful green color and a subtle, fragrant flavor. The filling is sweet, slightly chewy, and aromatic. These crepes are rolled up and served fresh. This is one of Indonesia\'s most popular traditional desserts, found everywhere from street vendors to fine dining. Light, sweet, and perfectly satisfying to end a meal.',
            vegetarian: true,
            spicy: false
        },
        {
            id: 'klepon',
            name: 'Klepon',
            description: 'Glutinous rice balls, palm sugar center, coconut',
            detailedDescription: 'Sweet, chewy rice balls made from glutinous rice flour, filled with liquid palm sugar that bursts in your mouth when you bite into them. The balls are boiled until they float, then rolled in freshly grated coconut. The combination of the chewy texture, the sweet, caramel-like palm sugar center, and the fresh coconut creates a delightful contrast. This is a classic Indonesian sweet snack, beloved for its playful texture and satisfying sweetness. A perfect ending to any Indonesian meal.',
            vegetarian: true,
            spicy: false
        },
        {
            id: 'es_campur',
            name: 'Es Campur / Es Teler',
            description: 'Tropical fruit, coconut, shaved ice',
            detailedDescription: 'A refreshing Indonesian shaved ice dessert featuring a colorful mix of tropical fruits (jackfruit, avocado, young coconut, palm fruit), jellies, and sometimes ice cream, all topped with shaved ice and sweetened condensed milk or coconut milk. The name means "mixed ice" and it\'s a popular street food dessert throughout Indonesia. Cool, refreshing, and perfect for tropical climates. This dessert is both visually appealing and delicious, offering a variety of textures and flavors in every spoonful.',
            vegetarian: true,
            spicy: false
        },
        {
            id: 'pisang_goreng',
            name: 'Pisang Goreng + Gula Aren Sauce',
            description: 'Fried banana with palm sugar caramel',
            detailedDescription: 'Crispy fried bananas, a beloved Indonesian street food. Ripe bananas are coated in a light batter and deep-fried until golden and crispy on the outside while remaining soft and sweet inside. Served with gula aren sauce - a rich, caramel-like sauce made from palm sugar. The combination of the crispy exterior, sweet banana, and rich caramel sauce is irresistible. This is one of Indonesia\'s most popular snacks, found everywhere from morning markets to late-night food stalls. Simple, satisfying, and delicious.',
            vegetarian: true,
            spicy: false
        },
        {
            id: 'bubur_injin',
            name: 'Bubur Injin',
            description: 'Black rice pudding with coconut cream',
            detailedDescription: 'A traditional Balinese dessert made from black glutinous rice cooked slowly with coconut milk and palm sugar until it becomes a thick, creamy pudding. The black rice has a nutty flavor and chewy texture, while the coconut cream adds richness. Often served with fresh fruit or additional coconut cream on top. This dessert is deeply satisfying, not overly sweet, and represents the more sophisticated side of Indonesian desserts. It\'s a staple in Balinese cuisine and a perfect, comforting end to a meal.',
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
            spicy: false,
            meatType: 'chicken'
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
            spicy: false,
            meatType: 'chicken'
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
            spicy: false,
            meatType: 'chicken'
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
            spicy: false,
            meatType: 'chicken'
        },
        {
            id: 'kids_fish_fingers',
            name: 'Fish Fingers',
            description: 'Crispy fish fingers with mild sauce',
            vegetarian: false,
            spicy: false,
            meatType: 'fish'
        },
        {
            id: 'kids_chicken_satay',
            name: 'Chicken Satay (Mild)',
            description: 'Indonesian chicken satay, mild version',
            vegetarian: false,
            spicy: false,
            meatType: 'chicken'
        },
        {
            id: 'kids_spaghetti',
            name: 'Spaghetti Bolognese',
            description: 'Classic spaghetti with mild meat sauce',
            vegetarian: false,
            spicy: false,
            meatType: 'beef'
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

