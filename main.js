// Keep only the Size Calculator functionality
class SizeCalculator {
    constructor() {
        this.sizeChart = {
            XS: { bust: [30, 32], waist: [23, 25], hips: [33, 35] },
            S:  { bust: [33, 35], waist: [26, 28], hips: [36, 38] },
            M:  { bust: [36, 38], waist: [29, 31], hips: [39, 41] },
            L:  { bust: [39, 41], waist: [32, 34], hips: [42, 44] },
            XL: { bust: [42, 44], waist: [35, 37], hips: [45, 47] }
        };
        
        this.initializeCalculator();
    }

    initializeCalculator() {
        const calculateBtn = document.getElementById('calculate-size');
        const inputs = document.querySelectorAll('#bust, #waist, #hips');

        // Set up input restrictions
        inputs.forEach(input => {
            // Only allow numbers and decimal point
            input.addEventListener('keypress', (e) => {
                if (!/[\d.]/.test(e.key)) {
                    e.preventDefault();
                }
                
                // Prevent multiple decimal points
                if (e.key === '.' && input.value.includes('.')) {
                    e.preventDefault();
                }
            });

            // Clean up and validate on blur
            input.addEventListener('blur', (e) => {
                let value = parseFloat(e.target.value);
                if (isNaN(value)) {
                    e.target.value = '';
                } else {
                    value = Math.min(Math.max(value, 20), 60);
                    e.target.value = value;
                }
            });
        });

        // Calculate size on button click
        calculateBtn.addEventListener('click', () => this.calculateSize());
    }

    calculateSize() {
        const bust = parseFloat(document.getElementById('bust').value);
        const waist = parseFloat(document.getElementById('waist').value);
        const hips = parseFloat(document.getElementById('hips').value);

        if (!this.validateMeasurements(bust, waist, hips)) {
            return;
        }

        const size = this.determineSize(bust, waist, hips);
        document.getElementById('size-output').textContent = size;
    }

    validateMeasurements(bust, waist, hips) {
        if (isNaN(bust) || isNaN(waist) || isNaN(hips)) {
            alert('Please enter all measurements');
            return false;
        }

        if (bust < 20 || bust > 60 || waist < 20 || waist > 60 || hips < 20 || hips > 60) {
            alert('All measurements must be between 20 and 60 inches');
            return false;
        }

        return true;
    }

    determineSize(bust, waist, hips) {
        for (const [size, measurements] of Object.entries(this.sizeChart)) {
            if (bust >= measurements.bust[0] && bust <= measurements.bust[1] &&
                waist >= measurements.waist[0] && waist <= measurements.waist[1] &&
                hips >= measurements.hips[0] && hips <= measurements.hips[1]) {
                return size;
            }
        }
        return 'Custom Size';
    }
}

// Initialize calculator and appointment form
document.addEventListener('DOMContentLoaded', function() {
    new SizeCalculator();

    // Initialize EmailJS
    emailjs.init("s5zCl0eo3nxJun0a1"); // Replace with your EmailJS public key

    // Appointment button handler
    const bookBtn = document.querySelector('.book-btn');
    if (bookBtn) {
        bookBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector('#contact').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }

    // Appointment form handler
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Prepare email parameters
            const templateParams = {
                name: this.name.value,
                email: this.email.value,
                phone: this.phone.value,
                service: this.service.value,
                notes: this.notes.value,
                to_email: 'khushiboutique016@gmail.com' // Replace with your email
            };

            // Send email
            emailjs.send('service_o57ojba', 'template_ho84hkr', templateParams)
                .then(() => {
                    // Success
                    alert('Thank you! Your appointment request has been sent. We will contact you shortly.');
                    appointmentForm.reset();
                })
                .catch((error) => {
                    // Error
                    console.error('Email error:', error);
                    alert('Sorry, there was an error sending your request. Please try again or contact us directly.');
                })
                .finally(() => {
                    // Reset button
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                });
        });
    }

    // View Collections button handler
    const ctaBtn = document.querySelector('.cta-btn');
    if (ctaBtn) {
        ctaBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector('#designs').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }

    // Create custom hamburger icon
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        // Remove existing icon
        menuToggle.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;
    }

    const menu = document.querySelector('.menu');
    const navbar = document.querySelector('.navbar');

    if (menuToggle && menu) {
        // Toggle menu
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        // Close menu when clicking a link
        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target)) {
                menu.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });

        // Prevent menu from closing when clicking inside
        menu.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Close menu on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                menu.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    }
});
