/* ==========================================================================
   Aura Holidays - JavaScript Dynamic Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Systems
    initTheme();
    initNavbarScroll();
    initMobileMenu();
    initPackages();
    initCalculator();
    initTestimonials();
    initBookingForm();
    initAdminPortal();
});

/* ==========================================================================
   Theme Controller (Light/Dark Mode)
   ========================================================================== */
function initTheme() {
    const themeBtn = document.querySelector('.theme-toggle');
    if (!themeBtn) return;

    // Check saved preference
    const savedTheme = localStorage.getItem('aura-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Default to dark, unless user previously set light
    if (savedTheme === 'light' || (!savedTheme && !systemPrefersDark)) {
        document.body.classList.add('light-theme');
    }

    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
        localStorage.setItem('aura-theme', currentTheme);
    });
}

/* ==========================================================================
   Navbar Scroll Effect
   ========================================================================== */
function initNavbarScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
}

/* ==========================================================================
   Mobile Navigation Menu Toggle
   ========================================================================== */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (!menuToggle || !navMenu) return;

    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = navMenu.style.display === 'flex';
        
        if (isOpen) {
            navMenu.style.display = 'none';
        } else {
            // Apply styled overlay properties for mobile menu
            navMenu.style.display = 'flex';
            navMenu.style.flexDirection = 'column';
            navMenu.style.position = 'absolute';
            navMenu.style.top = '100%';
            navMenu.style.left = '0';
            navMenu.style.width = '100%';
            navMenu.style.background = 'var(--bg-secondary)';
            navMenu.style.padding = '30px';
            navMenu.style.borderBottom = '1px solid var(--card-border)';
            navMenu.style.gap = '20px';
            navMenu.style.zIndex = '999';
        }
    });

    // Close menu when clicking outside or resizing
    document.addEventListener('click', () => {
        if (window.innerWidth <= 850) {
            navMenu.style.display = 'none';
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 850) {
            navMenu.style.display = 'flex';
            navMenu.style.flexDirection = 'row';
            navMenu.style.position = 'static';
            navMenu.style.background = 'transparent';
            navMenu.style.padding = '0';
            navMenu.style.borderBottom = 'none';
            navMenu.style.gap = '40px';
        } else {
            navMenu.style.display = 'none';
        }
    });
}

/* ==========================================================================
   Tour Packages Data & Filtering System
   ========================================================================== */
const TOUR_PACKAGES = [
    {
        id: 'maldives',
        title: 'Maldives Private Overwater Sanctuary',
        description: 'Indulge in a luxurious escape featuring private overwater villas, crystal lagoons, and personal butler service.',
        image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=600&q=80',
        rating: 4.9,
        reviewsCount: 148,
        duration: 7, // days
        price: 3200,
        category: 'beach',
        features: ['Flights Incl.', 'Overwater Villa', 'All Meals']
    },
    {
        id: 'swiss-alps',
        title: 'Swiss Alps Luxury Winter Expedition',
        description: 'Explore the peak of Zermatt, enjoy panoramic train rides, and stay in heated luxury ski chateaus.',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
        rating: 4.8,
        reviewsCount: 96,
        duration: 8,
        price: 2850,
        category: 'mountain',
        features: ['Ski Passes', 'Alpine Chalet', 'Spa Access']
    },
    {
        id: 'kyoto',
        title: 'Kyoto Cultural Heritage Journey',
        description: 'Wander through ancient golden temples, witness traditional geisha ceremonies, and taste gourmet kaiseki cuisine.',
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
        rating: 4.9,
        reviewsCount: 112,
        duration: 6,
        price: 1950,
        category: 'cultural',
        features: ['Private Guide', 'Tea Ceremony', 'Bullet Train']
    },
    {
        id: 'safari',
        title: 'Serengeti Premium Wilderness Safari',
        description: 'Witness the Great Migration, enjoy luxury glamping, and experience private off-road game drives.',
        image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=600&q=80',
        rating: 4.7,
        reviewsCount: 84,
        duration: 10,
        price: 4100,
        category: 'safari',
        features: ['4x4 Safari Cruiser', 'Glamping Suite', 'All-Inclusive']
    },
    {
        id: 'bali',
        title: 'Bali Tropical Wellness Retreat',
        description: 'Rejuvenate your soul with holistic jungle spa sessions, infinity pool villas, and spiritual temple tours.',
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80',
        rating: 4.8,
        reviewsCount: 165,
        duration: 5,
        price: 1450,
        category: 'beach',
        features: ['Yoga Retreat', 'Pool Villa', 'Detox Organic Meals']
    },
    {
        id: 'iceland',
        title: 'Icelandic Northern Lights Adventure',
        description: 'Chase the Aurora Borealis, explore frozen ice caves, and relax in the steamy volcanic Blue Lagoon.',
        image: 'https://images.unsplash.com/photo-1529963183134-61a90db47eaf?auto=format&fit=crop&w=600&q=80',
        rating: 4.9,
        reviewsCount: 130,
        duration: 6,
        price: 2400,
        category: 'mountain',
        features: ['Northern Lights Hunt', 'Lagoon Pass', 'Ice Cave Tour']
    }
];

let activeCategory = 'all';
let maxBudget = 5000;

function initPackages() {
    const packagesGrid = document.querySelector('.packages-grid');
    const categoryTabs = document.querySelectorAll('.filter-tab');
    const budgetSlider = document.getElementById('budget-range');
    const budgetVal = document.getElementById('budget-val');
    const searchInput = document.getElementById('hero-search');
    const widgetSearchInput = document.getElementById('widget-search');
    const widgetDuration = document.getElementById('widget-duration');
    const widgetDestination = document.getElementById('widget-destination');
    const searchBtn = document.getElementById('hero-search-btn');

    if (!packagesGrid) return;

    // Initial render
    renderPackages();

    // Category Tabs filtering
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            categoryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            activeCategory = tab.dataset.category;
            renderPackages();
        });
    });

    // Budget Slider filtering
    if (budgetSlider && budgetVal) {
        budgetSlider.addEventListener('input', (e) => {
            maxBudget = parseInt(e.target.value);
            budgetVal.textContent = `$${maxBudget}`;
            renderPackages();
        });
    }

    // Live search event bindings
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            renderPackages(searchInput.value);
        });
    }

    if (widgetSearchInput) {
        widgetSearchInput.addEventListener('input', () => {
            renderPackages(widgetSearchInput.value);
        });
    }

    // Dynamic checks on widget search filters
    if (widgetDuration || widgetDestination) {
        const handleWidgetChange = () => {
            const destVal = widgetDestination ? widgetDestination.value.toLowerCase() : '';
            const durVal = widgetDuration ? parseInt(widgetDuration.value) : 0;
            
            const filtered = TOUR_PACKAGES.filter(pkg => {
                const matchesCategory = activeCategory === 'all' || pkg.category === activeCategory;
                const matchesBudget = pkg.price <= maxBudget;
                const matchesDestination = !destVal || pkg.title.toLowerCase().includes(destVal) || pkg.description.toLowerCase().includes(destVal);
                const matchesDuration = !durVal || pkg.duration <= durVal;
                
                return matchesCategory && matchesBudget && matchesDestination && matchesDuration;
            });
            
            displayPackages(filtered);
        };

        if (widgetDuration) widgetDuration.addEventListener('change', handleWidgetChange);
        if (widgetDestination) widgetDestination.addEventListener('change', handleWidgetChange);
    }
}

function renderPackages(searchQuery = '') {
    const query = searchQuery.toLowerCase().trim();
    
    const filtered = TOUR_PACKAGES.filter(pkg => {
        const matchesCategory = activeCategory === 'all' || pkg.category === activeCategory;
        const matchesBudget = pkg.price <= maxBudget;
        const matchesSearch = !query || pkg.title.toLowerCase().includes(query) || pkg.description.toLowerCase().includes(query);
        
        return matchesCategory && matchesBudget && matchesSearch;
    });

    displayPackages(filtered);
}

function displayPackages(packages) {
    const packagesGrid = document.querySelector('.packages-grid');
    if (!packagesGrid) return;
    
    packagesGrid.innerHTML = '';

    if (packages.length === 0) {
        packagesGrid.innerHTML = `
            <div class="no-results">
                <h3>No Packages Found</h3>
                <p>Try adjusting your search filters or raising your budget slider.</p>
            </div>
        `;
        return;
    }

    packages.forEach(pkg => {
        const card = document.createElement('div');
        card.className = 'package-card';
        card.innerHTML = `
            <div class="package-img-wrap">
                <img src="${pkg.image}" alt="${pkg.title}" class="package-img" loading="lazy">
                <span class="package-badge">${pkg.duration} Days</span>
            </div>
            <div class="package-content">
                <div class="package-rating">
                    ★ ${pkg.rating.toFixed(1)} <span>(${pkg.reviewsCount} reviews)</span>
                </div>
                <h3>${pkg.title}</h3>
                <p class="package-desc" style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 20px;">
                    ${pkg.description}
                </p>
                <ul class="package-features">
                    ${pkg.features.map(f => `<li>✓ ${f}</li>`).join('')}
                </ul>
                <div class="package-footer">
                    <div class="package-price">
                        <span class="price-label">Price per person</span>
                        <span class="price-amt">$${pkg.price}</span>
                    </div>
                    <button class="btn btn-primary book-pkg-btn" data-id="${pkg.id}" data-title="${pkg.title}">Book Now</button>
                </div>
            </div>
        `;
        packagesGrid.appendChild(card);
    });

    // Add event listeners to newly rendered booking buttons
    document.querySelectorAll('.book-pkg-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const pkgId = btn.dataset.id;
            const pkgTitle = btn.dataset.title;
            autoFillBooking(pkgId, pkgTitle);
        });
    });
}

function autoFillBooking(packageId, packageTitle) {
    // Update Calculator
    const calcPkg = document.getElementById('calc-package');
    if (calcPkg) {
        calcPkg.value = packageId;
        // Trigger calculator update
        calcPkg.dispatchEvent(new Event('change'));
    }

    // Scroll down to Booking Section
    const bookingSection = document.getElementById('calculator');
    if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
}

/* ==========================================================================
   Trip Budget Calculator
   ========================================================================== */
function initCalculator() {
    const calcPkg = document.getElementById('calc-package');
    const calcTravelers = document.getElementById('calc-travelers');
    const calcDuration = document.getElementById('calc-duration');
    const calcAccommodation = document.getElementById('calc-accommodation');
    const calcGuide = document.getElementById('calc-guide');
    const calcLounge = document.getElementById('calc-lounge');
    const calcMeals = document.getElementById('calc-meals');

    const resultBasePrice = document.getElementById('result-base-price');
    const resultExtras = document.getElementById('result-extras');
    const resultDiscount = document.getElementById('result-discount');
    const resultTotal = document.getElementById('result-total-price');

    if (!calcPkg) return;

    // Populate packages in the calculator dropdown dynamically
    calcPkg.innerHTML = TOUR_PACKAGES.map(pkg => `
        <option value="${pkg.id}" data-price="${pkg.price}" data-duration="${pkg.duration}">${pkg.title}</option>
    `).join('');

    const calculateBudget = () => {
        const selectedOption = calcPkg.options[calcPkg.selectedIndex];
        if (!selectedOption) return;

        const basePersonPrice = parseInt(selectedOption.dataset.price);
        const defaultDuration = parseInt(selectedOption.dataset.duration);
        
        const travelers = parseInt(calcTravelers.value) || 1;
        const duration = parseInt(calcDuration.value) || defaultDuration;

        // Base package cost (scaled by travelers and duration ratio if user overrides default duration)
        const durationMultiplier = duration / defaultDuration;
        const baseCost = basePersonPrice * travelers * durationMultiplier;

        // Extras calculations
        let extrasCost = 0;
        
        if (calcAccommodation && calcAccommodation.checked) {
            // Luxury Hotel: $120 extra per person per night
            extrasCost += 120 * travelers * duration;
        }
        if (calcMeals && calcMeals.checked) {
            // Gourmet Dining Plan: $60 extra per person per day
            extrasCost += 60 * travelers * duration;
        }
        if (calcLounge && calcLounge.checked) {
            // VIP airport lounge: $45 flat per person
            extrasCost += 45 * travelers;
        }
        if (calcGuide && calcGuide.checked) {
            // Private driver / personal guide: $150 flat per day
            extrasCost += 150 * duration;
        }

        // Apply discount for larger groups (3+ travelers = 10% off base package)
        let discountPercent = 0;
        if (travelers >= 5) {
            discountPercent = 0.15; // 15% off base package for group tours
        } else if (travelers >= 3) {
            discountPercent = 0.10; // 10% group discount
        }

        const discountAmt = baseCost * discountPercent;
        const totalCost = baseCost + extrasCost - discountAmt;

        // Display results with animation transitions
        if (resultBasePrice) resultBasePrice.textContent = `$${Math.round(baseCost).toLocaleString()}`;
        if (resultExtras) resultExtras.textContent = `$${Math.round(extrasCost).toLocaleString()}`;
        if (resultDiscount) resultDiscount.textContent = discountAmt > 0 ? `-$${Math.round(discountAmt).toLocaleString()}` : '$0';
        if (resultTotal) resultTotal.textContent = `$${Math.round(totalCost).toLocaleString()}`;
    };

    // Bind event listeners to input elements
    [calcPkg, calcTravelers, calcDuration].forEach(el => {
        el.addEventListener('change', calculateBudget);
        el.addEventListener('input', calculateBudget);
    });

    [calcAccommodation, calcGuide, calcLounge, calcMeals].forEach(el => {
        if (el) el.addEventListener('change', calculateBudget);
    });

    // Auto-fill duration field based on default package duration when package changes
    calcPkg.addEventListener('change', () => {
        const selectedOption = calcPkg.options[calcPkg.selectedIndex];
        if (selectedOption && calcDuration) {
            calcDuration.value = selectedOption.dataset.duration;
        }
        calculateBudget();
    });

    // Initial calc execution
    calculateBudget();
}

/* ==========================================================================
   Testimonials Slider
   ========================================================================== */
function initTestimonials() {
    const slider = document.querySelector('.testimonials-slider');
    const dotsContainer = document.querySelector('.slider-dots');
    
    if (!slider || !dotsContainer) return;

    const testimonials = [
        {
            text: "Our Maldives honeymoon with Aura Holidays was absolute perfection. Every detail from private dining to flight transfers was handled seamlessly. Worth every penny!",
            name: "Emily & David Watson",
            title: "Luxurious Honeymoon Travelers",
            img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
        },
        {
            text: "The Swiss Alps winter trek was unforgettable. The local ski guides were incredibly professional, and coming back to a warm heated chalet with private spa was heaven.",
            name: "Marcus Aurelius Vance",
            title: "Adventure and Winter Sports Enthusiast",
            img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
        },
        {
            text: "We booked the Kyoto cultural expedition for our family of 5. Aura Holidays custom tailored the duration and guide, making ancient temples engaging even for kids.",
            name: "Dr. Sofia Rodriguez",
            title: "Cultural & Family Group Leader",
            img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
        }
    ];

    // Render testimonial slides
    slider.innerHTML = testimonials.map(item => `
        <div class="testimonial-slide">
            <div class="quote-icon">“</div>
            <p class="testimonial-text">"${item.text}"</p>
            <div class="testimonial-user">
                <img src="${item.img}" alt="${item.name}" class="user-img" loading="lazy">
                <span class="user-name">${item.name}</span>
                <span class="user-title">${item.title}</span>
            </div>
        </div>
    `).join('');

    // Render dot indicators
    dotsContainer.innerHTML = testimonials.map((_, i) => `
        <span class="dot ${i === 0 ? 'active' : ''}" data-index="${i}"></span>
    `).join('');

    const dots = document.querySelectorAll('.dot');
    const slides = document.querySelectorAll('.testimonial-slide');
    let currentIndex = 0;
    let autoSlideTimer;

    const goToSlide = (index) => {
        currentIndex = index;
        slider.style.transform = `translateX(-${index * 100}%)`;
        
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');
    };

    const nextSlide = () => {
        const nextIdx = (currentIndex + 1) % testimonials.length;
        goToSlide(nextIdx);
    };

    // User dot navigation clicks
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const targetIdx = parseInt(dot.dataset.index);
            goToSlide(targetIdx);
            resetAutoSlide();
        });
    });

    // Start auto slide
    const startAutoSlide = () => {
        autoSlideTimer = setInterval(nextSlide, 6000);
    };

    const resetAutoSlide = () => {
        clearInterval(autoSlideTimer);
        startAutoSlide();
    };

    startAutoSlide();

    // Pause auto-sliding on hover
    const testimonialsSection = document.getElementById('testimonials');
    if (testimonialsSection) {
        testimonialsSection.addEventListener('mouseenter', () => clearInterval(autoSlideTimer));
        testimonialsSection.addEventListener('mouseleave', startAutoSlide);
    }
}

/* ==========================================================================
   Booking Form & Enquiry Submission
   ========================================================================== */
function initBookingForm() {
    const contactForm = document.getElementById('booking-enquiry-form');
    const successOverlay = document.querySelector('.success-overlay');
    const closeSuccessBtn = document.getElementById('close-success-btn');

    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Perform basic validation checks
        const nameInput = document.getElementById('form-name');
        const emailInput = document.getElementById('form-email');
        const phoneInput = document.getElementById('form-phone');
        const travelMonthInput = document.getElementById('form-date');
        const calcPkg = document.getElementById('calc-package');
        const detailsInput = document.getElementById('form-details');
        const resultTotalPrice = document.getElementById('result-total-price');

        if (!nameInput.value.trim()) {
            nameInput.focus();
            return;
        }
        if (!emailInput.value.trim() || !validateEmail(emailInput.value)) {
            emailInput.focus();
            return;
        }

        // Save Lead to LocalStorage
        try {
            const pkgName = calcPkg.options[calcPkg.selectedIndex] ? calcPkg.options[calcPkg.selectedIndex].text : 'Custom Package';
            const estPrice = resultTotalPrice ? resultTotalPrice.textContent : '$0';
            
            const newLead = {
                id: Date.now().toString(),
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                phone: phoneInput.value.trim() || 'N/A',
                travelMonth: travelMonthInput.value || 'N/A',
                packageName: pkgName,
                price: estPrice,
                notes: detailsInput.value.trim() || 'No specific requests.',
                status: 'active'
            };

            const existingLeads = JSON.parse(localStorage.getItem('aura_leads') || '[]');
            existingLeads.unshift(newLead);
            localStorage.setItem('aura_leads', JSON.stringify(existingLeads));

            // Generate Dispatch Links for Owner
            const emailBtn = document.getElementById('success-email-btn');
            const whatsappBtn = document.getElementById('success-whatsapp-btn');

            const emailSubject = encodeURIComponent(`Aura Holidays Enquiry - ${newLead.name}`);
            const textBody = `Aura Holidays Booking Enquiry:\n\nName: ${newLead.name}\nEmail: ${newLead.email}\nPhone: ${newLead.phone}\nPreferred Month: ${newLead.travelMonth}\nPackage Selection: ${newLead.packageName}\nEstimated Pricing: ${newLead.price}\nBespoke Requests: ${newLead.notes}\n\nLogged on: ${new Date().toLocaleString()}`;
            
            const encodedBody = encodeURIComponent(textBody);

            if (emailBtn) {
                emailBtn.href = `mailto:avinashavinash2904@gmail.com?subject=${emailSubject}&body=${encodedBody}`;
            }
            if (whatsappBtn) {
                whatsappBtn.href = `https://wa.me/919025790483?text=${encodedBody}`;
            }
        } catch (err) {
            console.error('Error saving or dispatching lead details:', err);
        }

        // Show premium success overlay modal
        if (successOverlay) {
            successOverlay.classList.add('active');
        }

        // Reset form inputs
        contactForm.reset();
        
        // Refresh the calculator after form reset
        if (calcPkg) {
            calcPkg.dispatchEvent(new Event('change'));
        }
    });

    if (closeSuccessBtn && successOverlay) {
        closeSuccessBtn.addEventListener('click', () => {
            successOverlay.classList.remove('active');
        });
        
        // Close modal on clicking backdrop
        successOverlay.addEventListener('click', (e) => {
            if (e.target === successOverlay) {
                successOverlay.classList.remove('active');
            }
        });
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

/* ==========================================================================
   Admin Portal (Login Validation & Leads Dashboard Console)
   ========================================================================== */
function initAdminPortal() {
    const adminModal = document.getElementById('admin-modal');
    const navAdminBtn = document.getElementById('nav-admin-btn');
    const footerAdminBtn = document.getElementById('footer-admin-btn');
    const closeAdminBtn = document.getElementById('close-admin-modal-btn');
    
    const loginView = document.getElementById('admin-login-view');
    const registerView = document.getElementById('admin-register-view');
    const dashboardView = document.getElementById('admin-dashboard-view');
    
    // Login Forms & Inputs
    const loginForm = document.getElementById('admin-login-form');
    const usernameInput = document.getElementById('admin-username');
    const passwordInput = document.getElementById('admin-password');
    const loginErrorMsg = document.getElementById('login-error-msg');
    
    // Captcha Elements
    const captchaVisualCode = document.getElementById('captcha-visual-code');
    const refreshCaptchaBtn = document.getElementById('refresh-captcha-btn');
    const captchaInput = document.getElementById('admin-captcha-input');
    
    // Register Forms & Inputs
    const registerForm = document.getElementById('admin-register-form');
    const regNameInput = document.getElementById('reg-name');
    const regEmailInput = document.getElementById('reg-email');
    const regPasswordInput = document.getElementById('reg-password');
    const regBioInput = document.getElementById('reg-bio');
    const registerErrorMsg = document.getElementById('register-error-msg');
    const registerSuccessMsg = document.getElementById('register-success-msg');
    
    // Toggle View Links
    const toggleRegisterBtn = document.getElementById('toggle-register-btn');
    const toggleLoginBtn = document.getElementById('toggle-login-btn');
    
    // Dashboard Profile Elements
    const profileBox = document.getElementById('dashboard-profile-box');
    const profileName = document.getElementById('profile-name');
    const profileEmail = document.getElementById('profile-email');
    const profileBio = document.getElementById('profile-bio');
    
    const logoutBtn = document.getElementById('admin-logout-btn');
    const exportCsvBtn = document.getElementById('export-csv-btn');
    const clearLeadsBtn = document.getElementById('clear-leads-btn');
    const searchInput = document.getElementById('dashboard-search');

    if (!adminModal) return;

    let selectedRole = 'coordinator'; // Default selected role
    let currentCaptchaCode = '';

    // Helper: Generate Random Captcha
    const generateCaptcha = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'; // omit ambiguous characters like 0, O, 1, I, l
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        currentCaptchaCode = code;
        if (captchaVisualCode) {
            // Keep style lines and add text
            captchaVisualCode.innerHTML = `
                ${code}
                <div style="position: absolute; width: 120%; height: 2px; background: var(--accent-color); transform: rotate(-10deg); opacity: 0.4;"></div>
                <div style="position: absolute; width: 120%; height: 2px; background: var(--secondary-color); transform: rotate(10deg); opacity: 0.4;"></div>
            `;
        }
        if (captchaInput) {
            captchaInput.value = '';
        }
    };

    if (refreshCaptchaBtn) {
        refreshCaptchaBtn.addEventListener('click', generateCaptcha);
    }

    // Toggle register/login card views
    if (toggleRegisterBtn) {
        toggleRegisterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginView.style.display = 'none';
            registerView.style.display = 'block';
            if (registerForm) registerForm.reset();
            if (registerErrorMsg) registerErrorMsg.style.display = 'none';
            if (registerSuccessMsg) registerSuccessMsg.style.display = 'none';
        });
    }

    if (toggleLoginBtn) {
        toggleLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            registerView.style.display = 'none';
            loginView.style.display = 'block';
            generateCaptcha();
        });
    }

    // Handle Login Role Tabs
    const roleTabs = document.querySelectorAll('.role-tab');
    roleTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            roleTabs.forEach(t => {
                t.classList.remove('active');
                t.style.background = 'transparent';
                t.style.color = 'var(--text-secondary)';
            });
            
            tab.classList.add('active');
            tab.style.background = 'var(--primary-color)';
            tab.style.color = '#050811';
            
            selectedRole = tab.dataset.role;
            
            // Adjust input placeholders and toggles
            if (selectedRole === 'coordinator') {
                usernameInput.placeholder = 'e.g. coordinator email';
                if (toggleRegisterBtn) toggleRegisterBtn.style.display = 'inline';
            } else {
                usernameInput.placeholder = 'e.g. admin';
                if (toggleRegisterBtn) toggleRegisterBtn.style.display = 'none'; // admin cannot register from client dashboard
            }
            
            // Reset fields and errors
            usernameInput.value = '';
            passwordInput.value = '';
            if (loginErrorMsg) loginErrorMsg.style.display = 'none';
        });
    });

    // Helper: Render Dashboard view
    const renderDashboard = () => {
        const leads = JSON.parse(localStorage.getItem('aura_leads') || '[]');
        const tableBody = document.getElementById('leads-table-body');
        const totalLeadsSpan = document.getElementById('stat-total-leads');
        const activeLeadsSpan = document.getElementById('stat-active-leads');
        const revenueSpan = document.getElementById('stat-revenue');
        const query = searchInput.value.toLowerCase().trim();
        const mainTitle = document.getElementById('dashboard-main-title');

        const userRole = sessionStorage.getItem('aura_user_role') || 'coordinator';
        const userId = sessionStorage.getItem('aura_user_id');

        // Update title based on logged-in role
        if (mainTitle) {
            const roleLabel = userRole === 'admin' ? 'Administrator' : 'Coordinator';
            mainTitle.innerHTML = `Aura Console [${roleLabel}] | <span class="gradient-text">Leads Manager</span>`;
        }

        // Restrict destructive actions to Administrator role only
        if (clearLeadsBtn) {
            if (userRole === 'admin') {
                clearLeadsBtn.style.display = 'inline-block';
            } else {
                clearLeadsBtn.style.display = 'none';
            }
        }

        // Show/Hide coordinator profile bio details
        if (profileBox && userRole === 'coordinator') {
            const coordinators = JSON.parse(localStorage.getItem('aura_coordinators') || '[]');
            const activeUser = coordinators.find(c => c.id === userId);
            
            if (activeUser) {
                profileBox.style.display = 'flex';
                if (profileName) profileName.textContent = activeUser.name;
                if (profileEmail) profileEmail.textContent = activeUser.email;
                if (profileBio) profileBio.textContent = `"${activeUser.bio}"`;
            } else {
                profileBox.style.display = 'none';
            }
        } else if (profileBox) {
            profileBox.style.display = 'none';
        }

        // Calculate statistics
        const totalCount = leads.length;
        const activeCount = leads.filter(l => l.status === 'active').length;
        
        let estRevenue = 0;
        leads.forEach(lead => {
            const numVal = parseInt(lead.price.replace(/[^0-9]/g, '')) || 0;
            estRevenue += numVal;
        });

        // Set stats metrics
        if (totalLeadsSpan) totalLeadsSpan.textContent = totalCount;
        if (activeLeadsSpan) activeLeadsSpan.textContent = activeCount;
        if (revenueSpan) revenueSpan.textContent = `$${estRevenue.toLocaleString()}`;

        if (!tableBody) return;
        tableBody.innerHTML = '';

        // Filter leads based on query
        const filteredLeads = leads.filter(lead => {
            return (
                lead.name.toLowerCase().includes(query) ||
                lead.email.toLowerCase().includes(query) ||
                lead.packageName.toLowerCase().includes(query) ||
                lead.notes.toLowerCase().includes(query)
            );
        });

        if (filteredLeads.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 30px 0;">
                        No enquiries logged in storage.
                    </td>
                </tr>
            `;
            return;
        }

        // Render table rows
        filteredLeads.forEach(lead => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="color: var(--text-muted); font-size: 0.8rem; font-weight: 500;">
                    ${lead.date}
                </td>
                <td>
                    <div style="font-weight: 700; color: var(--text-primary);">${lead.name}</div>
                    <div style="font-size: 0.8rem; color: var(--text-secondary);">${lead.email}</div>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">${lead.phone}</div>
                </td>
                <td style="font-weight: 600; color: var(--primary-color);">
                    ${lead.packageName}
                </td>
                <td>
                    <div style="font-size: 0.8rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 3px;">
                        Month: ${lead.travelMonth}
                    </div>
                    <div style="font-size: 0.8rem; color: var(--text-muted); max-width: 320px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${lead.notes}">
                        "${lead.notes}"
                    </div>
                </td>
                <td style="font-weight: 800; color: var(--accent-color); font-size: 1rem;">
                    ${lead.price}
                </td>
                <td>
                    <span class="status-pill ${lead.status}">
                        ${lead.status}
                    </span>
                </td>
                <td>
                    <button class="action-btn-sm toggle-status-btn" data-id="${lead.id}">
                        ${lead.status === 'active' ? 'Mark Contacted' : 'Mark Active'}
                    </button>
                    <button class="action-btn-sm action-btn-danger delete-lead-btn" data-id="${lead.id}">
                        Delete
                    </button>
                </td>
            `;
            tableBody.appendChild(tr);
        });

        // Bind events to dynamic buttons
        tableBody.querySelectorAll('.toggle-status-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const leadId = btn.dataset.id;
                toggleLeadStatus(leadId);
            });
        });

        tableBody.querySelectorAll('.delete-lead-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const leadId = btn.dataset.id;
                deleteLead(leadId);
            });
        });
    };

    const toggleLeadStatus = (leadId) => {
        const leads = JSON.parse(localStorage.getItem('aura_leads') || '[]');
        const updated = leads.map(l => {
            if (l.id === leadId) {
                l.status = l.status === 'active' ? 'contacted' : 'active';
            }
            return l;
        });
        localStorage.setItem('aura_leads', JSON.stringify(updated));
        renderDashboard();
    };

    const deleteLead = (leadId) => {
        if (!confirm('Are you sure you want to delete this enquiry?')) return;
        const leads = JSON.parse(localStorage.getItem('aura_leads') || '[]');
        const filtered = leads.filter(l => l.id !== leadId);
        localStorage.setItem('aura_leads', JSON.stringify(filtered));
        renderDashboard();
    };

    // Open Admin Modal
    const openModal = (e) => {
        if (e) e.preventDefault();
        adminModal.classList.add('active');
        
        // Check session login state
        const isLoggedIn = sessionStorage.getItem('aura_admin_logged_in') === 'true';
        if (isLoggedIn) {
            loginView.style.display = 'none';
            registerView.style.display = 'none';
            dashboardView.style.display = 'flex';
            renderDashboard();
        } else {
            loginView.style.display = 'block';
            registerView.style.display = 'none';
            dashboardView.style.display = 'none';
            if (loginErrorMsg) loginErrorMsg.style.display = 'none';
            if (loginForm) loginForm.reset();
            
            // Set initial selector active state
            selectedRole = 'coordinator';
            roleTabs.forEach(t => {
                if (t.dataset.role === 'coordinator') {
                    t.classList.add('active');
                    t.style.background = 'var(--primary-color)';
                    t.style.color = '#050811';
                } else {
                    t.classList.remove('active');
                    t.style.background = 'transparent';
                    t.style.color = 'var(--text-secondary)';
                }
            });
            usernameInput.placeholder = 'e.g. coordinator email';
            if (toggleRegisterBtn) toggleRegisterBtn.style.display = 'inline';
            generateCaptcha();
        }
    };

    // Close Modal
    const closeModal = () => {
        adminModal.classList.remove('active');
    };

    if (navAdminBtn) navAdminBtn.addEventListener('click', openModal);
    if (footerAdminBtn) footerAdminBtn.addEventListener('click', openModal);
    if (closeAdminBtn) closeAdminBtn.addEventListener('click', closeModal);
    
    // Close on overlay click
    adminModal.addEventListener('click', (e) => {
        if (e.target === adminModal) {
            closeModal();
        }
    });

    // Coordinator registration form submission
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = regNameInput.value.trim();
            const email = regEmailInput.value.trim().toLowerCase();
            const password = regPasswordInput.value.trim();
            const bio = regBioInput.value.trim();

            const coordinators = JSON.parse(localStorage.getItem('aura_coordinators') || '[]');
            const exists = coordinators.some(c => c.email === email);

            if (exists) {
                if (registerErrorMsg) {
                    registerErrorMsg.style.display = 'block';
                }
                return;
            }

            const newUser = {
                id: Date.now().toString(),
                name,
                email,
                password,
                bio
            };

            coordinators.push(newUser);
            localStorage.setItem('aura_coordinators', JSON.stringify(coordinators));

            if (registerErrorMsg) registerErrorMsg.style.display = 'none';
            if (registerSuccessMsg) registerSuccessMsg.style.display = 'block';

            setTimeout(() => {
                registerView.style.display = 'none';
                loginView.style.display = 'block';
                generateCaptcha();
            }, 1500);
        });
    }

    // Login Form Handler (Supports captcha validation and matching database lookups)
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = usernameInput.value.trim().toLowerCase();
            const password = passwordInput.value.trim();
            const enteredCaptcha = captchaInput.value.trim().toLowerCase();

            // Validate Captcha first
            if (enteredCaptcha !== currentCaptchaCode.toLowerCase()) {
                if (loginErrorMsg) {
                    loginErrorMsg.textContent = 'Captcha validation failed. Please try again.';
                    loginErrorMsg.style.display = 'block';
                }
                generateCaptcha();
                return;
            }

            let isValid = false;
            let activeUserId = '';
            
            if (selectedRole === 'admin') {
                if (username === 'admin' && password === '12345678') {
                    isValid = true;
                }
            } else if (selectedRole === 'coordinator') {
                const coordinators = JSON.parse(localStorage.getItem('aura_coordinators') || '[]');
                const foundUser = coordinators.find(c => c.email === username && c.password === password);
                
                if (foundUser) {
                    isValid = true;
                    activeUserId = foundUser.id;
                }
            }

            if (isValid) {
                sessionStorage.setItem('aura_admin_logged_in', 'true');
                sessionStorage.setItem('aura_user_role', selectedRole);
                if (activeUserId) {
                    sessionStorage.setItem('aura_user_id', activeUserId);
                } else {
                    sessionStorage.removeItem('aura_user_id');
                }
                
                loginView.style.display = 'none';
                dashboardView.style.display = 'flex';
                renderDashboard();
            } else {
                if (loginErrorMsg) {
                    loginErrorMsg.textContent = 'Invalid Username or Password for selected role.';
                    loginErrorMsg.style.display = 'block';
                }
                generateCaptcha();
            }
        });
    }

    // Logout Handler
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('aura_admin_logged_in');
            sessionStorage.removeItem('aura_user_role');
            sessionStorage.removeItem('aura_user_id');
            dashboardView.style.display = 'none';
            loginView.style.display = 'block';
            if (loginForm) loginForm.reset();
            if (loginErrorMsg) loginErrorMsg.style.display = 'none';
        });
    }

    // Search dynamic updates
    if (searchInput) {
        searchInput.addEventListener('input', renderDashboard);
    }

    // Clear all logs handler
    if (clearLeadsBtn) {
        clearLeadsBtn.addEventListener('click', () => {
            if (!confirm('WARNING: Are you absolutely sure you want to delete ALL logged enquiries? This cannot be undone.')) return;
            localStorage.removeItem('aura_leads');
            renderDashboard();
        });
    }

    // CSV Export Handler
    if (exportCsvBtn) {
        exportCsvBtn.addEventListener('click', () => {
            const leads = JSON.parse(localStorage.getItem('aura_leads') || '[]');
            if (leads.length === 0) {
                alert('No leads available to export.');
                return;
            }

            // CSV Column Headers
            let csvContent = 'data:text/csv;charset=utf-8,';
            csvContent += 'Submission Date,Client Name,Client Email,Phone,Preferred Month,Package,Est Price,Status,Bespoke Requests\r\n';

            // Populate rows
            leads.forEach(l => {
                const name = `"${l.name.replace(/"/g, '""')}"`;
                const email = `"${l.email.replace(/"/g, '""')}"`;
                const phone = `"${l.phone.replace(/"/g, '""')}"`;
                const travelMonth = `"${l.travelMonth.replace(/"/g, '""')}"`;
                const packageName = `"${l.packageName.replace(/"/g, '""')}"`;
                const price = `"${l.price.replace(/"/g, '""')}"`;
                const status = `"${l.status.replace(/"/g, '""')}"`;
                const notes = `"${l.notes.replace(/"/g, '""')}"`;
                
                csvContent += `${l.date},${name},${email},${phone},${travelMonth},${packageName},${price},${status},${notes}\r\n`;
            });

            // Trigger browser CSV file download
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement('a');
            link.setAttribute('href', encodedUri);
            link.setAttribute('download', `aura_holidays_leads_${Date.now()}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }
}
