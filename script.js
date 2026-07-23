/**
 * Pradyumna Shetty - Developer Portfolio JavaScript Logic
 * Contains: Mobile nav, typewriter effect, scrollspy, scroll reveal,
 * project filters, contact validation, custom toast, and back to top features.
 */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // DOM ELEMENTS
    // ==========================================
    const header = document.getElementById('header');
    const navMenu = document.getElementById('nav-menu');
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const rolesTypewriter = document.getElementById('roles-typewriter');
    
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    const backToTopBtn = document.getElementById('back-to-top');
    
    const contactForm = document.getElementById('portfolio-contact-form');
    const toastContainer = document.getElementById('toast-container');

    // ==========================================
    // HEADER SCROLL & MOBILE NAVIGATION
    // ==========================================
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });

    // Toggle hamburger menu
    hamburgerMenu.addEventListener('click', () => {
        hamburgerMenu.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when nav link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburgerMenu.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburgerMenu.contains(e.target) && !navMenu.contains(e.target)) {
            hamburgerMenu.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // ==========================================
    // HERO TYPEWRITER EFFECT
    // ==========================================
    const roles = [
        "Data Engineering Specialist",
        "Cloud Analytics Architect",
        "ETL/ELT Pipeline Builder",
        "AI & Backend Developer"
    ];
    let currentRoleIdx = 0;
    let currentCharIdx = 0;
    let isDeleting = false;
    let typewriterDelay = 150;

    function typeWriter() {
        const currentRole = roles[currentRoleIdx];
        
        if (isDeleting) {
            // Erasing characters
            rolesTypewriter.textContent = currentRole.substring(0, currentCharIdx - 1);
            currentCharIdx--;
            typewriterDelay = 50; // Speed up erasing
        } else {
            // Typing characters
            rolesTypewriter.textContent = currentRole.substring(0, currentCharIdx + 1);
            currentCharIdx++;
            typewriterDelay = 100; // Regular typing speed
        }

        // Handle states
        if (!isDeleting && currentCharIdx === currentRole.length) {
            // Wait before starting deletion
            typewriterDelay = 2000;
            isDeleting = true;
        } else if (isDeleting && currentCharIdx === 0) {
            isDeleting = false;
            // Move to next word
            currentRoleIdx = (currentRoleIdx + 1) % roles.length;
            typewriterDelay = 500; // Pause before typing next word
        }

        setTimeout(typeWriter, typewriterDelay);
    }

    // Start Typewriter
    if (rolesTypewriter) {
        setTimeout(typeWriter, 1000);
    }

    // ==========================================
    // SCROLL REVEAL (Intersection Observer)
    // ==========================================
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target); // Reveal once
            }
        });
    }, revealOptions);

    const revealElements = document.querySelectorAll('.scroll-reveal');
    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // ==========================================
    // SCROLLSPY (Highlight nav menu on scroll)
    // ==========================================
    const sections = document.querySelectorAll('section[id]');
    
    function scrollSpy() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) + 20);
            const sectionId = current.getAttribute('id');
            const navLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);
            
            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active-link'));
                    navLink.classList.add('active-link');
                }
            }
        });
    }
    
    window.addEventListener('scroll', scrollSpy);

    // ==========================================
    // PROJECT FILTER LOGIC
    // ==========================================
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category').split(' ');
                
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    card.classList.remove('hide');
                    // Add micro fade animation
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.classList.add('hide');
                }
            });
        });
    });

    // ==========================================
    // BACK TO TOP BUTTON
    // ==========================================
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ==========================================
    // TOAST NOTIFICATIONS SYSTEM
    // ==========================================
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        let iconHtml = '<i class="fa-solid fa-circle-check toast-icon"></i>';
        if (type === 'error') {
            iconHtml = '<i class="fa-solid fa-circle-exclamation toast-icon"></i>';
        }
        
        toast.innerHTML = `
            ${iconHtml}
            <span class="toast-msg">${message}</span>
        `;
        
        toastContainer.appendChild(toast);
        
        // Triggers reveal transition
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Auto remove toast
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 400); // matches transition time
        }, 4000);
    }

    // ==========================================
    // CONTACT FORM VALIDATION & SUBMISSION
    // ==========================================
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nameInput = document.getElementById('contact-name');
            const emailInput = document.getElementById('contact-email');
            const subjectInput = document.getElementById('contact-subject');
            const messageInput = document.getElementById('contact-message');
            
            let isValid = true;
            
            // Name validation
            if (!nameInput.value.trim()) {
                nameInput.parentElement.classList.add('invalid');
                isValid = false;
            } else {
                nameInput.parentElement.classList.remove('invalid');
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
                emailInput.parentElement.classList.add('invalid');
                isValid = false;
            } else {
                emailInput.parentElement.classList.remove('invalid');
            }
            
            // Subject validation
            if (!subjectInput.value.trim()) {
                subjectInput.parentElement.classList.add('invalid');
                isValid = false;
            } else {
                subjectInput.parentElement.classList.remove('invalid');
            }
            
            // Message validation
            if (!messageInput.value.trim()) {
                messageInput.parentElement.classList.add('invalid');
                isValid = false;
            } else {
                messageInput.parentElement.classList.remove('invalid');
            }
            
            if (isValid) {
                const submitBtn = document.getElementById('contact-submit-btn');
                const originalBtnText = submitBtn.innerHTML;
                
                // Set loading state
                submitBtn.disabled = true;
                submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-circle-notch fa-spin icon-space-left"></i>';
                
                // Prepare form data for Web3Forms API
                const formData = {
                    access_key: "56112482-1ba4-4f6c-9b60-9c0869e50b8b",
                    name: nameInput.value.trim(),
                    email: emailInput.value.trim(),
                    subject: subjectInput.value.trim(),
                    message: messageInput.value.trim(),
                    from_name: "Pradyumna Portfolio"
                };

                fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(formData)
                })
                .then(async (response) => {
                    const json = await response.json();
                    if (response.status === 200) {
                        showToast('Thank you! Your message has been sent successfully.', 'success');
                        contactForm.reset();
                    } else {
                        console.error(json);
                        showToast(json.message || 'Something went wrong. Please try again.', 'error');
                    }
                })
                .catch((error) => {
                    console.error(error);
                    showToast('Network error. Please check your connection and try again.', 'error');
                })
                .finally(() => {
                    // Reset Button state
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                });
            } else {
                showToast('Please correct the highlighted errors before submitting.', 'error');
            }
        });
        
        // Remove validation error on input change
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.value.trim()) {
                    input.parentElement.classList.remove('invalid');
                }
            });
        });
    }
});
