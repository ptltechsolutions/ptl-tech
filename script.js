// ===== DOM Elements =====
const header = document.getElementById('header');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const scrollTopBtn = document.getElementById('scrollTop');
const progressBar = document.getElementById('progressBar');
const heroSlides = document.querySelectorAll('.hero-slide');
const heroDots = document.querySelectorAll('.dot');
const contactForm = document.getElementById('contactForm');

// ===== Header Scroll Effect =====
function handleScroll() {
    const scrollY = window.scrollY;

    // Header background change
    if (scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Scroll to top button visibility
    if (scrollY > 100) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }

    // Progress bar
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollY / docHeight) * 100;
    progressBar.style.width = scrollPercent + '%';

    // Active nav link based on scroll position
    updateActiveNavLink();

    // Animate elements on scroll (AOS-like)
    animateOnScroll();
}

// ===== Mobile Navigation Toggle =====
function toggleNav() {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
}

// Close nav when clicking outside
function closeNavOnClickOutside(e) {
    if (navMenu.classList.contains('active') &&
        !navMenu.contains(e.target) &&
        !navToggle.contains(e.target)) {
        toggleNav();
    }
}

// Close nav when clicking a link
function closeNavOnLinkClick() {
    if (navMenu.classList.contains('active')) {
        toggleNav();
    }
}

// ===== Update Active Nav Link =====
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// ===== Smooth Scroll =====
function smoothScroll(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetSection = document.querySelector(targetId);

    if (targetSection) {
        const headerHeight = header.offsetHeight;
        const targetPosition = targetSection.offsetTop - headerHeight;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// ===== Scroll to Top =====
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ===== Hero Slider =====
let currentSlide = 0;
let slideInterval;

function showSlide(index) {
    heroSlides.forEach((slide, i) => {
        slide.classList.remove('active');
        heroDots[i].classList.remove('active');
    });

    heroSlides[index].classList.add('active');
    heroDots[index].classList.add('active');
    currentSlide = index;
}

function nextSlide() {
    const next = (currentSlide + 1) % heroSlides.length;
    showSlide(next);
}

function startSlideshow() {
    slideInterval = setInterval(nextSlide, 5000);
}

function stopSlideshow() {
    clearInterval(slideInterval);
}

function handleDotClick(e) {
    const slideIndex = parseInt(e.target.dataset.slide);
    stopSlideshow();
    showSlide(slideIndex);
    startSlideshow();
}

// ===== Animate on Scroll (AOS-like) =====
function animateOnScroll() {
    const elements = document.querySelectorAll('[data-aos]');

    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        const windowHeight = window.innerHeight;

        // Check if element is in viewport
        if (elementTop < windowHeight * 0.85 && elementBottom > 0) {
            const delay = element.dataset.aosDelay || 0;
            setTimeout(() => {
                element.classList.add('aos-animate');
            }, delay);
        }
    });
}

// ===== Contact Form Handler =====
async function handleFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(contactForm);

    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        company: formData.get('company'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };

    try {
        const response = await fetch(
            'https://script.google.com/macros/s/AKfycbxdsLdGGDgOdZBxzKHhc15HsXEDq0c4_YiQdoerC7_Emn5NPeHjx9vwqfAIkCPeYUGsWQ/exec',
            {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }
        );

        alert('Thank you! Your enquiry has been submitted.');

        contactForm.reset();

    } catch (error) {
        console.error('Form Error:', error);
        alert('Error submitting form.');
    }
}

// ===== Counter Animation =====
function animateCounters() {
    const counters = document.querySelectorAll('.counter');

    counters.forEach(counter => {
        const target = parseInt(counter.dataset.target);
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };

        updateCounter();
    });
}

// ===== Initialize =====
function init() {
    // Event Listeners
    window.addEventListener('scroll', handleScroll);
    navToggle.addEventListener('click', toggleNav);
    document.addEventListener('click', closeNavOnClickOutside);
    scrollTopBtn.addEventListener('click', scrollToTop);

    // Nav links smooth scroll
    navLinks.forEach(link => {
        link.addEventListener('click', smoothScroll);
        link.addEventListener('click', closeNavOnLinkClick);
    });

    // Hero dots
    heroDots.forEach(dot => {
        dot.addEventListener('click', handleDotClick);
    });

    // Contact form
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }

    // CTA buttons smooth scroll
    document.querySelectorAll('.btn[href^="#"]').forEach(btn => {
        btn.addEventListener('click', smoothScroll);
    });

    // Start hero slideshow
    startSlideshow();

    // Initial scroll check
    handleScroll();

    // Initial animation check
    setTimeout(animateOnScroll, 100);
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Pause slideshow on tab visibility change
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopSlideshow();
    } else {
        startSlideshow();
    }
});
