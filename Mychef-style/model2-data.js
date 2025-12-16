// Model 2 Data: Cuisine Options and Pricing

const CUISINE_OPTIONS = {
    italian: {
        name: "Italian Cuisine",
        icon: "🍝",
        chefRequirement: "5+ years Italian culinary experience",
        specialties: [
            "Fresh pasta from scratch",
            "Risotto & regional classics",
            "Authentic sauces & techniques",
            "Italian desserts"
        ],
        typicalIngredientCost: {
            perPersonBudget: 250000,
            perPersonMidRange: 450000,
            perPersonPremium: 800000
        }
    },
    french: {
        name: "French Cuisine",
        icon: "🥖",
        chefRequirement: "5+ years French culinary experience",
        specialties: [
            "French sauces & techniques",
            "Coq au vin, beef bourguignon",
            "Soufflés & French pastries",
            "Wine pairing recommendations"
        ],
        typicalIngredientCost: {
            perPersonBudget: 300000,
            perPersonMidRange: 500000,
            perPersonPremium: 900000
        }
    },
    indonesian: {
        name: "Indonesian Cuisine",
        icon: "🍜",
        chefRequirement: "5+ years Indonesian culinary experience",
        specialties: [
            "Rendang, bebek betutu, sate",
            "Regional specialties",
            "Traditional spice blends",
            "Indonesian desserts"
        ],
        typicalIngredientCost: {
            perPersonBudget: 200000,
            perPersonMidRange: 400000,
            perPersonPremium: 700000
        }
    }
};

// Service Configuration
const SERVICE_CONFIG = {
    hourlyRate: 800000, // Rp 800,000 per hour
    standardHours: {
        consultation: 1,
        shopping: 1,
        cooking: 5,
        total: 7
    },
    
    calculateStandardCost: function() {
        return this.standardHours.total * this.hourlyRate;
    },
    
    customizeHours: function(cookingHours) {
        const total = 2 + cookingHours; // consultation + shopping always included
        const cost = total * this.hourlyRate;
        
        return {
            hours: {
                consultation: 1,
                shopping: 1,
                cooking: cookingHours,
                total: total
            },
            cost: cost
        };
    }
};

// Time slots for dining (12:00 PM - 10:00 PM in 30-min intervals)
function generateTimeSlots() {
    const slots = [];
    for (let hour = 12; hour <= 22; hour++) {
        slots.push(`${hour.toString().padStart(2, '0')}:00`);
        if (hour < 22) {
            slots.push(`${hour.toString().padStart(2, '0')}:30`);
        }
    }
    return slots;
}

