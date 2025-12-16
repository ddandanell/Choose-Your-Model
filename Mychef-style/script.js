// Model selection handler
document.addEventListener('DOMContentLoaded', function() {
    const modelCards = document.querySelectorAll('.model-card');
    
    modelCards.forEach(card => {
        card.addEventListener('click', function() {
            const modelNumber = this.dataset.model;
            
            // Add visual feedback
            this.style.transform = 'scale(0.98)';
            
            setTimeout(() => {
                // Navigate based on model number
                // For now, just log - you'll create the pages later
                console.log(`Model ${modelNumber} selected`);
                
                // Navigate to model pages
                if (modelNumber === '1') {
                    window.location.href = 'model1.html';
                } else if (modelNumber === '2') {
                    window.location.href = 'model2.html';
                }
            }, 200);
        });
    });
});
