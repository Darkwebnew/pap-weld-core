// ============================================
// PAP WELD CORE - MAIN JAVASCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', function() {

    // ----- MOBILE HAMBURGER MENU -----
    const hamburger = document.getElementById('hamburger');
    const navList = document.querySelector('.nav-list');

    if (hamburger && navList) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navList.classList.toggle('active');
        });
        // Close on link click (mobile), but not for the Products dropdown parent link
        document.querySelectorAll('.nav-list > li > a').forEach(link => {
            link.addEventListener('click', function(e) {
                const parentLi = this.closest('li');
                const isDropdownParent = parentLi && parentLi.classList.contains('dropdown');

                if (window.innerWidth <= 768 && isDropdownParent) {
                    // On mobile, first tap expands the submenu instead of navigating away
                    if (!parentLi.classList.contains('active')) {
                        e.preventDefault();
                        parentLi.classList.add('active');
                        return;
                    }
                }

                if (window.innerWidth <= 768) {
                    hamburger.classList.remove('active');
                    navList.classList.remove('active');
                }
            });
        });
    }

    // ----- STICKY HEADER -----
    const header = document.getElementById('header');
    window.addEventListener('scroll', function() {
        if (header) {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });

    // ----- BACK TO TOP BUTTON -----
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 400) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
        backToTop.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ----- SCROLL ANIMATIONS (Intersection Observer with AOS-like behaviour) -----
    const animateElements = document.querySelectorAll(
        '.capability-card, .industry-card, .product-card, .process-step, .quality-step-card, .cert-card, .testing-card, .case-card, .project-card, .stat-strip-item, .mv-card, .team-card, .timeline-item'
    );
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        animateElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease';
            observer.observe(el);
        });
    } else {
        // Fallback: show all
        animateElements.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
    }

    // ----- SMOOTH SCROLL FOR ANCHOR LINKS -----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ----- COUNTER ANIMATION (Trust Badges + Stat Strips) -----
    const counterEls = document.querySelectorAll('[data-count]');

    function animateCounter(counter) {
        const target = parseInt(counter.getAttribute('data-count'), 10);
        const suffix = counter.getAttribute('data-suffix') || '';
        if (isNaN(target)) return;

        let current = 0;
        const duration = 1500;
        const stepTime = 30;
        const steps = duration / stepTime;
        const increment = target / steps;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target + suffix;
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current) + suffix;
            }
        }, stepTime);
    }

    if (counterEls.length) {
        if ('IntersectionObserver' in window) {
            const counterObserver = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.4 });

            counterEls.forEach(counter => counterObserver.observe(counter));
        } else {
            // Fallback
            counterEls.forEach(animateCounter);
        }
    }

    console.log('✅ Pap Weld Core Automation website loaded successfully.');
});