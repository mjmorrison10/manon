// ============================================
// MANON — L'Art de Vivre
// Interactive Scripts
// ============================================

(function() {
    'use strict';

    // ---- DOM Elements ----
    const header = document.getElementById('siteHeader');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const scrollProgress = document.getElementById('scrollProgress');
    const backToTop = document.getElementById('backToTop');
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    const openDot = document.getElementById('openDot');
    const openText = document.getElementById('openText');

    // ---- Mobile Menu ----
    function toggleMobileMenu() {
        const isActive = hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', isActive);
        mobileMenu.setAttribute('aria-hidden', !isActive);
        document.body.style.overflow = isActive ? 'hidden' : '';
    }

    hamburger.addEventListener('click', toggleMobileMenu);

    // Close mobile menu on link click
    mobileMenu.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', function() {
            if (hamburger.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });

    // ---- Navbar Scroll Effect ----
    let lastScroll = 0;
    function handleNavbarScroll() {
        const scrollY = window.pageYOffset;
        header.classList.toggle('scrolled', scrollY > 50);
        lastScroll = scrollY;
    }

    // ---- Scroll Progress Bar ----
    function updateScrollProgress() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        scrollProgress.style.width = progress + '%';
    }

    // ---- Back to Top ----
    function handleBackToTop() {
        backToTop.classList.toggle('visible', window.pageYOffset > 500);
    }

    backToTop.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ---- Open/Closed Status ----
    function updateOpenStatus() {
        if (!openDot || !openText) return;
        var now = new Date();
        var day = now.getDay(); // 0=Sun, 1=Mon, ...
        var hour = now.getHours();
        var minute = now.getMinutes();
        var currentMinutes = hour * 60 + minute;
        var isOpen = false;
        var statusLabel = '';

        if (day === 0) {
            // Sunday: 11AM–5PM
            isOpen = currentMinutes >= 660 && currentMinutes < 1020;
            statusLabel = isOpen ? 'Open Now' : 'Closed';
        } else if (day >= 1 && day <= 6) {
            // Mon–Sat: 10AM–7PM
            isOpen = currentMinutes >= 600 && currentMinutes < 1140;
            statusLabel = isOpen ? 'Open Now' : 'Closed';
        }

        openDot.classList.remove('open', 'closed');
        openDot.classList.add(isOpen ? 'open' : 'closed');
        openText.textContent = statusLabel;
    }
    updateOpenStatus();
    setInterval(updateOpenStatus, 60000);

    // ---- Smooth Scroll ----
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            var href = this.getAttribute('href');
            if (href === '#') return;
            var target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ---- Scroll Animations (Intersection Observer) ----
    var scrollObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
    });

    document.querySelectorAll('.animate-on-scroll').forEach(function(el) {
        scrollObserver.observe(el);
    });

    // ---- Counter Animation ----
    function animateCounter(el, target, duration) {
        var startTime = performance.now();
        function update(currentTime) {
            var elapsed = currentTime - startTime;
            var progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            var eased = 1 - Math.pow(1 - progress, 3);
            var current = Math.floor(eased * target);
            el.textContent = current + '+';
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        requestAnimationFrame(update);
    }

    var counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var el = entry.target;
                var target = parseInt(el.getAttribute('data-count'), 10);
                if (!isNaN(target) && target > 0) {
                    animateCounter(el, target, 2000);
                }
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-count]').forEach(function(el) {
        counterObserver.observe(el);
    });

    // ---- Form Validation & Submission ----
    var formFields = contactForm.querySelectorAll('input, select, textarea');

    formFields.forEach(function(field) {
        field.addEventListener('input', function() {
            if (this.value.trim().length > 0) {
                this.closest('.form-group').classList.add('valid');
            } else {
                this.closest('.form-group').classList.remove('valid');
            }
            // Clear error on input
            var errorEl = this.parentElement.querySelector('.form-error');
            if (errorEl) errorEl.textContent = '';
        });

        field.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.closest('.form-group').classList.remove('valid');
            }
        });
    });

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validate
        var isValid = true;
        var nameField = document.getElementById('name');
        var nameError = document.getElementById('nameError');

        if (!nameField.value.trim()) {
            nameError.textContent = 'Please enter your name';
            isValid = false;
        }

        if (!isValid) return;

        // Submit via mailto
        var formData = new FormData(this);
        var data = Object.fromEntries(formData.entries());
        var subject = encodeURIComponent('Contact from Manon Website');
        var body = encodeURIComponent(
            'Name: ' + (data.name || 'N/A') + '\n' +
            'Phone: ' + (data.phone || 'N/A') + '\n' +
            'Email: ' + (data.email || 'N/A') + '\n' +
            'Interest: ' + (data.interest || 'N/A') + '\n' +
            'Message: ' + (data.message || 'N/A') + '\n\n' +
            'Please get back to me.'
        );
        window.location.href = 'mailto:info@manonboutique.com?subject=' + subject + '&body=' + body;

        // Show success
        formSuccess.classList.add('active');

        // Reset after delay
        setTimeout(function() {
            formSuccess.classList.remove('active');
            contactForm.reset();
            formFields.forEach(function(f) {
                f.closest('.form-group').classList.remove('valid');
            });
        }, 4000);
    });

    // ---- Active Nav Section Tracking ----
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav-list a');

    function updateActiveNav() {
        var scrollPos = window.pageYOffset + 120;
        sections.forEach(function(section) {
            var top = section.offsetTop;
            var height = section.offsetHeight;
            var id = section.getAttribute('id');
            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(function(link) {
                    var href = link.getAttribute('href');
                    if (href && href.substring(1) === id) {
                        link.style.color = 'var(--black)';
                    } else if (!link.classList.contains('nav-cta')) {
                        link.style.color = '';
                    }
                });
            }
        });
    }

    // ---- Hero Parallax ----
    var heroContent = document.querySelector('.hero-content');
    function handleHeroParallax() {
        var scrollY = window.pageYOffset;
        var heroHeight = document.querySelector('.hero').offsetHeight;
        if (scrollY < heroHeight && heroContent) {
            heroContent.style.transform = 'translateY(' + (scrollY * 0.2) + 'px)';
            heroContent.style.opacity = 1 - (scrollY / heroHeight) * 0.5;
        }
    }

    // ---- Consolidated Scroll Handler ----
    var ticking = false;
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(function() {
                handleNavbarScroll();
                updateScrollProgress();
                handleBackToTop();
                updateActiveNav();
                handleHeroParallax();
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // ---- Phone Call Tracking ----
    document.querySelectorAll('a[href^="tel:"]').forEach(function(link) {
        link.addEventListener('click', function() {
            if (typeof gtag === 'function') {
                gtag('event', 'click_to_call', { business: 'Manon' });
            }
        });
    });

    // ---- Initial Calls ----
    updateScrollProgress();
    updateActiveNav();
    handleNavbarScroll();

    // ---- Hero Entrance Animation ----
    window.addEventListener('load', function() {
        var heroEls = document.querySelectorAll('.hero .animate-on-scroll');
        heroEls.forEach(function(el, i) {
            setTimeout(function() {
                el.classList.add('is-visible');
            }, 300 + i * 200);
        });
    });

})();
