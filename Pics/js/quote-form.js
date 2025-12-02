document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('quote-form');
    const steps = Array.from(document.querySelectorAll('.form-step'));
    const nextButtons = document.querySelectorAll('.btn-next');
    const prevButtons = document.querySelectorAll('.btn-prev');
    const progressBar = document.getElementById('progress-bar');
    
    // Logic Elements
    const interestTypeInputs = document.querySelectorAll('input[name="interest_type"]');
    const businessFields = document.getElementById('business-fields');
    const residentialFields = document.getElementById('residential-fields');
    const radioCards = document.querySelectorAll('.radio-card');

    let currentStep = 0;

    // Initialize
    updateStep();
    initRadioCards();

    // Event Listeners for Navigation
    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                currentStep++;
                updateStep();
            }
        });
    });

    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentStep--;
            updateStep();
        });
    });

    // Dynamic Fields based on Interest Type (Property vs Business)
    interestTypeInputs.forEach(input => {
        input.addEventListener('change', function() {
            if (this.value === 'business') {
                businessFields.classList.remove('hidden');
                residentialFields.classList.add('hidden');
            } else {
                businessFields.classList.add('hidden');
                residentialFields.classList.remove('hidden');
            }
        });
    });

    // Radio Card Styling
    function initRadioCards() {
        // Handle initial state
        document.querySelectorAll('input[type="radio"]:checked').forEach(input => {
            const card = input.closest('.radio-card');
            if (card) highlightCard(card);
        });

        // Handle changes
        radioCards.forEach(card => {
            const input = card.querySelector('input[type="radio"]');
            if (input) {
                input.addEventListener('change', () => {
                    // Reset all cards with same name
                    const name = input.name;
                    document.querySelectorAll(`input[name="${name}"]`).forEach(otherInput => {
                        const otherCard = otherInput.closest('.radio-card');
                        if (otherCard) resetCard(otherCard);
                    });
                    
                    // Highlight this one
                    highlightCard(card);
                });
            }
        });
    }

    function highlightCard(card) {
        card.classList.add('ring-2', 'ring-brand-primary', 'bg-brand-primary/5', 'border-brand-primary');
        card.classList.remove('border-gray-100'); // Default border
    }

    function resetCard(card) {
        card.classList.remove('ring-2', 'ring-brand-primary', 'bg-brand-primary/5', 'border-brand-primary');
        card.classList.add('border-gray-100');
    }

    // Update UI based on current step
    function updateStep() {
        // Show/Hide Steps
        steps.forEach((step, index) => {
            if (index === currentStep) {
                step.classList.remove('hidden');
                step.classList.add('animate-fade-in-up');
            } else {
                step.classList.add('hidden');
                step.classList.remove('animate-fade-in-up');
            }
        });

        // Update Progress Bar
        const progress = ((currentStep + 1) / steps.length) * 100;
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
    }

    // Simple Validation
    function validateStep(stepIndex) {
        const currentStepEl = steps[stepIndex];
        const inputs = currentStepEl.querySelectorAll('input[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value) {
                isValid = false;
                input.classList.add('border-red-500', 'ring-1', 'ring-red-500');
            } else {
                input.classList.remove('border-red-500', 'ring-1', 'ring-red-500');
            }
            
            // Checkbox/Radio specific check
            if ((input.type === 'checkbox' || input.type === 'radio')) {
                // For radio buttons, check if any in the group is checked
                if (input.type === 'radio') {
                    const group = document.getElementsByName(input.name);
                    let groupChecked = false;
                    for(let i=0; i<group.length; i++) {
                        if(group[i].checked) groupChecked = true;
                    }
                    if(!groupChecked) isValid = false;
                } else if (!input.checked) {
                     isValid = false;
                }
            }
        });

        return isValid;
    }

    // Form Submission
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validateStep(currentStep)) {
                // Collect data
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                console.log('Form Data:', data);
                
                alert('Thank you! Your quote request has been received. We will contact you shortly.');
                // Here you would typically send data to a server
                form.reset();
                currentStep = 0;
                updateStep();
                
                // Reset radio cards styling
                radioCards.forEach(card => resetCard(card));
            }
        });
    }
});
