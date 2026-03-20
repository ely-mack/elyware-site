/* ELYWARE — Main JS */

// ---- Mobile Menu ----
const menuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    menuBtn.classList.toggle('active');
});

// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        menuBtn.classList.remove('active');
    });
});

// ---- Navbar background on scroll ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(10, 10, 15, 0.95)';
    } else {
        navbar.style.background = 'rgba(10, 10, 15, 0.8)';
    }
});

// ---- Scroll fade-in ----
const fadeEls = document.querySelectorAll('.product-card, .coming-soon-section, .about-text, .about-values, .value-card');
fadeEls.forEach(el => el.classList.add('fade-in'));

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

fadeEls.forEach(el => observer.observe(el));

// ---- Buy Button ----
// Buy Now links directly to Payhip (set in HTML href)

// Shop links — point to products section until you have a separate store
document.getElementById('shop-link').href = '#products';
document.getElementById('shop-link-mobile').href = '#products';
document.getElementById('hero-shop-link').href = '#products';

// Demo download
document.getElementById('download-demo').addEventListener('click', (e) => {
    e.preventDefault();
    alert('Demo download coming soon! Sign up for the mailing list to be notified.');
});

// ---- Email form (stores locally until you connect a service) ----
document.getElementById('email-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;

    // For now, store in localStorage. Replace with Mailchimp/etc API call.
    const emails = JSON.parse(localStorage.getItem('elyware_waitlist') || '[]');
    if (!emails.includes(email)) {
        emails.push(email);
        localStorage.setItem('elyware_waitlist', JSON.stringify(emails));
    }

    e.target.innerHTML = '<p style="color: var(--accent-2); font-weight: 600;">You\'re on the list!</p>';
});

// ---- Smooth scroll for anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
