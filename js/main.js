/* ================================================================
   PAP WELD CORE AUTOMATION — UNIFIED JAVASCRIPT
   Covers: nav, sticky header, back-to-top, AOS, counter animation,
           home products, product page (filter + modal), gallery (lightbox)
           Plus: form field focus class (replaces :has()), gallery from JSON
   ================================================================ */
'use strict';

document.addEventListener('DOMContentLoaded', function () {

    /* ============================================================
       1. HAMBURGER MENU
       ============================================================ */
    var hamburger = document.getElementById('hamburger');
    var navList   = document.querySelector('.nav-list');

    if (hamburger && navList) {
        hamburger.addEventListener('click', function () {
            this.classList.toggle('active');
            navList.classList.toggle('active');
        });
        navList.querySelectorAll('li > a').forEach(function (link) {
            link.addEventListener('click', function (e) {
                if (window.innerWidth > 860) return;
                var parentLi = this.closest('li');
                if (parentLi && parentLi.classList.contains('dropdown')) {
                    if (!parentLi.classList.contains('active')) {
                        e.preventDefault();
                        parentLi.classList.add('active');
                        return;
                    }
                }
                hamburger.classList.remove('active');
                navList.classList.remove('active');
            });
        });
        // Close menu on outside click
        document.addEventListener('click', function (e) {
            if (!hamburger.contains(e.target) && !navList.contains(e.target)) {
                hamburger.classList.remove('active');
                navList.classList.remove('active');
            }
        });
    }

    /* ============================================================
       2. STICKY HEADER
       ============================================================ */
    var header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', function () {
            header.classList.toggle('scrolled', window.scrollY > 90);
        }, { passive: true });
    }

    /* ============================================================
       3. BACK TO TOP
       ============================================================ */
    var backBtn = document.getElementById('backToTop');
    if (backBtn) {
        window.addEventListener('scroll', function () {
            backBtn.classList.toggle('visible', window.scrollY > 400);
        }, { passive: true });
        backBtn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ============================================================
       4. SCROLL ANIMATIONS (AOS-like)
       ============================================================ */
    var animEls = document.querySelectorAll('[data-aos]');
    if ('IntersectionObserver' in window && animEls.length) {
        var aoObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-visible');
                    aoObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });
        animEls.forEach(function (el) { aoObs.observe(el); });
    } else {
        animEls.forEach(function (el) { el.classList.add('aos-visible'); });
    }

    /* ============================================================
       5. COUNTER ANIMATION
       ============================================================ */
    var counters = document.querySelectorAll('[data-count]');
    if (counters.length && 'IntersectionObserver' in window) {
        var cntObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var el     = entry.target;
                var target = parseInt(el.getAttribute('data-count'), 10);
                var suffix = el.getAttribute('data-suffix') || '';
                if (!isNaN(target) && target > 0) {
                    var current = 0;
                    var step    = Math.max(1, Math.floor(target / 45));
                    var timer   = setInterval(function () {
                        current += step;
                        if (current >= target) { current = target; clearInterval(timer); }
                        el.textContent = current + suffix;
                    }, 25);
                }
                cntObs.unobserve(el);
            });
        }, { threshold: 0.4 });
        counters.forEach(function (c) {
            if (!isNaN(parseInt(c.getAttribute('data-count'), 10))) cntObs.observe(c);
        });
    }

    /* ============================================================
       6. SMOOTH ANCHOR SCROLL
       ============================================================ */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var id = this.getAttribute('href');
            if (id === '#') return;
            var target = document.querySelector(id);
            if (target) {
                e.preventDefault();
                var top = target.getBoundingClientRect().top + window.pageYOffset - 110;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

    /* ============================================================
       7. CONTACT FORM FIELD FOCUS CLASSES (replaces :has())
       ============================================================ */
    var formFields = document.querySelectorAll('.contact-form .field input, .contact-form .field select, .contact-form .field textarea');
    formFields.forEach(function (field) {
        field.addEventListener('focus', function () {
            this.closest('.field').classList.add('field-focused');
        });
        field.addEventListener('blur', function () {
            this.closest('.field').classList.remove('field-focused');
        });
    });

    /* ============================================================
       8. HOME PAGE — PRODUCT PREVIEW CARDS
       ============================================================ */
    var homeGrid = document.getElementById('home-products');
    if (homeGrid) {
        var homeProducts = [
            {
                name: 'H‑Beam Welding Machine',
                description: 'Advanced system for precise H‑Beam fabrication, optimizing weld quality and production efficiency.',
                image: 'images/banners/hero-machine.png'
            },
            {
                name: 'Robotic Welding System',
                description: 'Automated multi‑axis robotic cell delivering high‑speed, repeatable welding for complex components.',
                image: 'images/banners/hero-machine.png'
            },
            {
                name: 'CNC Plate Drilling Machine',
                description: 'Precision CNC drilling and milling equipment for complex part manufacturing with tight tolerances.',
                image: 'images/banners/hero-machine.png'
            }
        ];
        homeGrid.innerHTML = '';
        homeProducts.forEach(function (p) {
            var card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML =
                '<img src="' + p.image + '" alt="' + p.name + '" loading="lazy">' +
                '<h4>' + p.name + '</h4>' +
                '<p>' + p.description.substring(0, 85) + '…</p>' +
                '<div class="card-actions">' +
                '<a href="products.html" class="btn btn-outline btn-small" style="flex:1;min-width:80px;">View Specs</a>' +
                '<a href="contact.html" class="btn btn-primary btn-small" style="flex:1;min-width:80px;">Get Quote</a>' +
                '</div>';
            homeGrid.appendChild(card);
        });
    }

    /* ============================================================
       9. PRODUCTS PAGE — DATA, FILTER, MODAL
       ============================================================ */
    var productGrid = document.getElementById('productGrid');
    if (productGrid) {

        var categoryMap = {
            'H Beam Welding Machine': 'welding',
            'H-Beam Welding Machine': 'welding',
            'Robotic Welding System': 'robotic',
            'CNC Machines': 'cnc',
            'Robotic Welding Cell': 'robotic',
            'Robotic Welding Automation': 'robotic',
            'PEB Beam Welding Automation': 'welding',
            'CNC Plate Drilling Machine': 'cnc',
            'Beam Welding Line': 'welding',
            'New Items': 'cnc'
        };

        var serviceItems = [
            {
                id: 'service-1',
                category: 'Services',
                name: 'Custom Fabrication Solutions',
                badge: 'Service',
                description: 'Tailored automation solutions for your specific fabrication needs – from design to commissioning. We work with you to engineer, build, and install custom welding automation systems.',
                image: 'https://5.imimg.com/data5/SELLER/Default/2026/2/585683545/LX/RX/VE/106518927/custom-fabrication-solutions-500x500.jpg',
                gallery: [
                    'https://5.imimg.com/data5/SELLER/Default/2026/2/585683545/LX/RX/VE/106518927/custom-fabrication-solutions-500x500.jpg',
                    'https://5.imimg.com/data5/SELLER/Default/2026/5/611757523/GN/KD/AH/106518927/custom-fabrication-solutions-500x500.jpg'
                ],
                specs: [
                    { label: 'Service Type', value: 'Design & Build' },
                    { label: 'Coverage', value: 'Worldwide' },
                    { label: 'Support', value: '24/7 Available' }
                ],
                features: [
                    'Custom engineering for unique requirements',
                    'On-site installation and training',
                    'Ongoing maintenance and support',
                    'Process optimization consulting'
                ],
                applications: [{ name: 'All Industries', desc: 'Structural Steel, PEB, Heavy Fab' }]
            },
            {
                id: 'service-2',
                category: 'Services',
                name: 'Installation & Commissioning Support',
                badge: 'Service',
                description: 'End-to-end installation, commissioning, and operator training for all Pap Weld Core systems. We ensure your production line is operational and your team is confident from day one.',
                image: 'https://5.imimg.com/data5/SELLER/Default/2026/2/585700505/AJ/FV/GY/106518927/industrial-automation-services-500x500.jpg',
                gallery: [
                    'https://5.imimg.com/data5/SELLER/Default/2026/2/585700505/AJ/FV/GY/106518927/industrial-automation-services-500x500.jpg',
                    'https://5.imimg.com/data5/SELLER/Default/2026/5/611757635/XP/ZZ/BS/106518927/installation-commissioning-support-500x500.jpg'
                ],
                specs: [
                    { label: 'Service Type', value: 'On-Site Support' },
                    { label: 'Coverage', value: 'Pan India' },
                    { label: 'Response Time', value: 'Within 48 Hours' }
                ],
                features: [
                    'Expert installation by certified engineers',
                    'Comprehensive operator training',
                    'Remote troubleshooting & diagnostics',
                    'Preventive maintenance packages'
                ],
                applications: [{ name: 'All Industries', desc: 'Structural Steel, PEB, Heavy Fab' }]
            }
        ];

        var allItems     = [];
        var currentFilter = 'all';
        var filterTabs   = document.querySelectorAll('.filter-tab');

        var countAll      = document.getElementById('countAll');
        var countWelding  = document.getElementById('countWelding');
        var countRobotic  = document.getElementById('countRobotic');
        var countCnc      = document.getElementById('countCnc');
        var countServices = document.getElementById('countServices');

        var modalOverlay    = document.getElementById('modalOverlay');
        var modalClose      = document.getElementById('modalClose');
        var modalCloseBtn   = document.getElementById('modalCloseBtn');
        var modalViewFull   = document.getElementById('modalViewFull');
        var modalMainImage  = document.getElementById('modalMainImage');
        var modalThumbnails = document.getElementById('modalThumbnails');
        var modalBadge      = document.getElementById('modalBadge');
        var modalTitle      = document.getElementById('modalTitle');
        var modalDesc       = document.getElementById('modalDescription');
        var modalSpecs      = document.getElementById('modalSpecs');
        var modalFeatures   = document.getElementById('modalFeatures');
        var modalApps       = document.getElementById('modalApps');

        // REMOVE the "View Full Details" button entirely – we'll keep only Quick View and Quote
        if (modalViewFull) modalViewFull.style.display = 'none';

        function getFilterValue(item) {
            if (item.type === 'service') return 'services';
            return categoryMap[item.category] || 'welding';
        }

        function updateCounts(items) {
            var c = { all: 0, welding: 0, robotic: 0, cnc: 0, services: 0 };
            items.forEach(function (item) {
                var cat = getFilterValue(item);
                c.all++;
                if (c[cat] !== undefined) c[cat]++;
            });
            if (countAll)      countAll.textContent      = c.all;
            if (countWelding)  countWelding.textContent  = c.welding;
            if (countRobotic)  countRobotic.textContent  = c.robotic;
            if (countCnc)      countCnc.textContent      = c.cnc;
            if (countServices) countServices.textContent = c.services;
        }

        function renderCards(items, filter) {
            var filtered = filter === 'all' ? items : items.filter(function (i) {
                return getFilterValue(i) === filter;
            });
            productGrid.innerHTML = '';
            if (!filtered.length) {
                productGrid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--gray);padding:60px 0;">No products found for this filter.</p>';
                return;
            }
            filtered.forEach(function (item, idx) {
                var card = document.createElement('div');
                card.className = 'product-card';
                card.setAttribute('data-aos', 'fade-up');
                card.setAttribute('data-id', item.id);
                var badgeClass = '';
                if (item.badge === 'Service') badgeClass = 'service-badge';
                else if (['Featured','Turnkey','Complete Line','PEB Specialist','Precision'].indexOf(item.badge) > -1) badgeClass = 'teal';
                var badgeHtml = item.badge ? '<span class="product-card-badge ' + badgeClass + '">' + item.badge + '</span>' : '';
                card.innerHTML =
                    '<div style="position:relative;">' +
                    '<img src="' + (item.image || 'images/banners/hero-machine.png') + '" alt="' + item.name + '" loading="lazy">' +
                    badgeHtml +
                    '</div>' +
                    '<h4>' + item.name + '</h4>' +
                    '<p>' + (item.description || '').substring(0, 110) + '…</p>' +
                    '<div class="card-actions">' +
                    '<button class="btn btn-outline btn-small view-details" data-id="' + item.id + '" style="flex:1;">Quick View</button>' +
                    '<a href="contact.html" class="btn btn-primary btn-small" style="flex:1;">Get Quote</a>' +
                    '</div>';
                productGrid.appendChild(card);
            });

            // Attach quick view events
            document.querySelectorAll('.view-details').forEach(function (btn) {
                btn.addEventListener('click', function () {
                    var id   = this.getAttribute('data-id');
                    var item = allItems.find(function (i) { return i.id === id; });
                    if (item) openModal(item);
                });
            });

            // Re-animate
            setTimeout(function () {
                productGrid.querySelectorAll('[data-aos]').forEach(function (el) {
                    el.classList.add('aos-visible');
                });
            }, 50);
        }

        function openModal(item) {
            var mainImg = item.image || 'images/banners/hero-machine.png';
            modalMainImage.src = mainImg;
            modalMainImage.alt = item.name;

            modalThumbnails.innerHTML = '';
            var imgs = (item.gallery && item.gallery.length) ? item.gallery : [mainImg];
            imgs.forEach(function (src, idx) {
                var thumb = document.createElement('img');
                thumb.className = 'thumb' + (idx === 0 ? ' active' : '');
                thumb.src = src;
                thumb.alt = item.name;
                thumb.addEventListener('click', function () {
                    document.querySelectorAll('.modal-thumbnails .thumb').forEach(function (t) { t.classList.remove('active'); });
                    this.classList.add('active');
                    modalMainImage.src = src;
                });
                modalThumbnails.appendChild(thumb);
            });

            if (item.badge) {
                var bc = '';
                if (item.badge === 'Service') bc = 'service-badge';
                else if (['Featured','Turnkey','Complete Line','PEB Specialist','Precision'].indexOf(item.badge) > -1) bc = 'teal';
                modalBadge.className = 'modal-badge ' + bc;
                modalBadge.textContent = item.badge;
                modalBadge.style.display = 'inline-block';
            } else {
                modalBadge.style.display = 'none';
            }

            modalTitle.textContent = item.name;
            modalDesc.textContent  = item.description || 'No description available.';

            modalSpecs.innerHTML = '';
            (item.specs && item.specs.length ? item.specs : [{ label: 'No specifications available.', value: '' }])
                .forEach(function (spec) {
                    var row = document.createElement('div');
                    row.className = 'spec-row';
                    row.innerHTML = '<span class="spec-label">' + spec.label + '</span><span class="spec-value">' + spec.value + '</span>';
                    modalSpecs.appendChild(row);
                });

            modalFeatures.innerHTML = '';
            (item.features && item.features.length ? item.features : ['No features listed.'])
                .forEach(function (f) {
                    var li = document.createElement('li');
                    li.textContent = f.replace(/^✓\s*/, '');
                    modalFeatures.appendChild(li);
                });

            modalApps.innerHTML = '';
            (item.applications && item.applications.length ? item.applications : [{ name: 'Various Industries', desc: '' }])
                .forEach(function (app) {
                    var tag = document.createElement('span');
                    tag.className = 'app-tag';
                    tag.textContent = app.name + (app.desc ? ' — ' + app.desc : '');
                    modalApps.appendChild(tag);
                });

            modalOverlay.classList.add('open');
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            modalOverlay.classList.remove('open');
            document.body.style.overflow = '';
        }

        if (modalClose)   modalClose.addEventListener('click', closeModal);
        if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
        if (modalOverlay) modalOverlay.addEventListener('click', function (e) { if (e.target === this) closeModal(); });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });

        filterTabs.forEach(function (tab) {
            tab.addEventListener('click', function () {
                filterTabs.forEach(function (t) { t.classList.remove('active'); });
                this.classList.add('active');
                currentFilter = this.getAttribute('data-filter');
                renderCards(allItems, currentFilter);
            });
        });

        // Fetch product data
        fetch('data/products-data.json')
            .then(function (r) { if (!r.ok) throw new Error('fetch failed'); return r.json(); })
            .then(function (data) {
                var products = data.products.map(function (p) { return Object.assign({}, p, { type: 'product' }); });
                var services = serviceItems.map(function (s) { return Object.assign({}, s, { type: 'service' }); });
                allItems = products.concat(services);
            })
            .catch(function () {
                allItems = serviceItems.map(function (s) { return Object.assign({}, s, { type: 'service' }); });
            })
            .finally(function () {
                updateCounts(allItems);
                renderCards(allItems, 'all');
            });
    }

    /* ============================================================
       10. GALLERY PAGE — LOAD FROM JSON
       ============================================================ */
    var galleryGrid = document.getElementById('galleryGrid');
    if (galleryGrid) {

        var galleryData = [];
        var filterTabs2 = document.querySelectorAll('.filter-tab');
        var countAll2   = document.getElementById('countAll');
        var countMachines = document.getElementById('countMachines');
        var countFacility = document.getElementById('countFacility');
        var countProjects2 = document.getElementById('countProjects');
        var countQuality2 = document.getElementById('countQuality');

        var lightboxOverlay = document.getElementById('lightboxOverlay');
        var lightboxClose   = document.getElementById('lightboxClose');
        var lightboxImage   = document.getElementById('lightboxImage');
        var lightboxTitle   = document.getElementById('lightboxTitle');
        var lightboxDesc    = document.getElementById('lightboxDesc');
        var lightboxCat     = document.getElementById('lightboxCat');
        var lightboxCounter = document.getElementById('lightboxCounter');
        var lightboxPrev    = document.getElementById('lightboxPrev');
        var lightboxNext    = document.getElementById('lightboxNext');
        var currentIndex    = 0;
        var filteredItems   = [];

        // Load gallery data from JSON
        fetch('data/gallery.json')
            .then(function (r) { if (!r.ok) throw new Error('fetch failed'); return r.json(); })
            .then(function (data) {
                galleryData = data.images || [];
                countCats();
                renderGallery('all');
            })
            .catch(function () {
                // Fallback to hardcoded data if fetch fails (only for demo)
                galleryData = [
                    { id: 'g-1', title: 'PTW – Pull Thru Welding Machine', category: 'machines', image: 'https://5.imimg.com/data5/SELLER/Default/2026/2/585704480/VQ/DI/VJ/106518927/ptw-pull-thru-welding-machine-1000x1000.jpg', thumbnail: 'https://5.imimg.com/data5/SELLER/Default/2026/2/585704480/VQ/DI/VJ/106518927/ptw-pull-thru-welding-machine-500x500.jpg', description: 'Automatic pull-through welding system for continuous H-Beam fabrication.' }
                    // add more fallback items if needed
                ];
                countCats();
                renderGallery('all');
            });

        function countCats() {
            var c = { machines: 0, facility: 0, projects: 0, quality: 0 };
            galleryData.forEach(function (i) { if (c[i.category] !== undefined) c[i.category]++; });
            if (countAll2)      countAll2.textContent      = galleryData.length;
            if (countMachines)  countMachines.textContent  = c.machines;
            if (countFacility)  countFacility.textContent  = c.facility;
            if (countProjects2) countProjects2.textContent = c.projects;
            if (countQuality2)  countQuality2.textContent  = c.quality;
        }

        function renderGallery(filter) {
            filteredItems = filter === 'all' ? galleryData : galleryData.filter(function (i) { return i.category === filter; });
            galleryGrid.innerHTML = '';
            filteredItems.forEach(function (item, idx) {
                var div = document.createElement('div');
                div.className = 'gallery-item';
                div.innerHTML =
                    '<img src="' + item.thumbnail + '" alt="' + item.title + '" loading="lazy">' +
                    '<div class="gallery-overlay">' +
                    '<h4>' + item.title + '</h4>' +
                    '<p>' + item.description + '</p>' +
                    '</div>' +
                    '<div class="gallery-zoom-icon"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></div>' +
                    '<span class="gallery-cat-badge">' + item.category + '</span>';
                div.addEventListener('click', function () { openLightbox(idx); });
                galleryGrid.appendChild(div);
            });
        }

        function openLightbox(idx) {
            currentIndex = idx;
            updateLightbox();
            lightboxOverlay.classList.add('open');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            lightboxOverlay.classList.remove('open');
            document.body.style.overflow = '';
        }

        function updateLightbox() {
            var item = filteredItems[currentIndex];
            if (!item) return;
            lightboxImage.src = item.image;
            lightboxImage.alt = item.title;
            if (lightboxTitle)   lightboxTitle.textContent   = item.title;
            if (lightboxDesc)    lightboxDesc.textContent    = item.description;
            if (lightboxCat)     lightboxCat.textContent     = item.category;
            if (lightboxCounter) lightboxCounter.textContent = (currentIndex + 1) + ' of ' + filteredItems.length;
        }

        if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
        if (lightboxOverlay) lightboxOverlay.addEventListener('click', function (e) { if (e.target === this) closeLightbox(); });
        if (lightboxPrev) lightboxPrev.addEventListener('click', function () { currentIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length; updateLightbox(); });
        if (lightboxNext) lightboxNext.addEventListener('click', function () { currentIndex = (currentIndex + 1) % filteredItems.length; updateLightbox(); });
        document.addEventListener('keydown', function (e) {
            if (!lightboxOverlay || !lightboxOverlay.classList.contains('open')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft' && lightboxPrev) lightboxPrev.click();
            if (e.key === 'ArrowRight' && lightboxNext) lightboxNext.click();
        });

        filterTabs2.forEach(function (tab) {
            tab.addEventListener('click', function () {
                filterTabs2.forEach(function (t) { t.classList.remove('active'); });
                this.classList.add('active');
                renderGallery(this.getAttribute('data-filter'));
            });
        });
    }

    /* ============================================================
       11. CONTACT FORM AJAX
       ============================================================ */
    var contactForm = document.getElementById('contact-form-el');
    var statusEl    = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var nameField  = this.querySelector('#name');
            var emailField = this.querySelector('#email');

            if (!nameField || !nameField.value.trim() || !emailField || !emailField.value.trim()) {
                showStatus('Please fill in your name and email address.', 'error');
                return;
            }
            var honeypot = this.querySelector('input[name="honeypot"]');
            if (honeypot && honeypot.value.trim() !== '') {
                showStatus('Thanks — your message has been sent. We\'ll respond within one business day.', 'success');
                this.reset();
                return;
            }

            var btn          = this.querySelector('button[type="submit"]');
            var origText     = btn.textContent;
            var formData     = new FormData(this);

            btn.textContent = 'Sending…';
            btn.disabled    = true;
            if (statusEl) { statusEl.textContent = ''; statusEl.className = 'form-status'; }

            fetch(this.getAttribute('action'), {
                method: 'POST',
                body: formData,
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            })
            .then(function (r) {
                if (r.ok) return r.text();
                throw new Error('Server error ' + r.status);
            })
            .then(function (responseText) {
                if (responseText.trim() === 'success') {
                    btn.textContent = 'Message Sent ✓';
                    btn.style.background = 'var(--teal)';
                    btn.style.borderColor = 'var(--teal)';
                    showStatus('Thanks — your message has been sent. We\'ll respond within one business day.', 'success');
                    contactForm.reset();
                } else {
                    throw new Error('Unexpected response');
                }
            })
            .catch(function (err) {
                btn.textContent = origText;
                btn.style.background = '';
                btn.style.borderColor = '';
                showStatus('Something went wrong. Please email us at weldcoreautomation@gmail.com or call +91 73581 89267.', 'error');
                console.error(err);
            })
            .finally(function () {
                btn.disabled = false;
                setTimeout(function () {
                    if (btn.textContent === 'Message Sent ✓') {
                        btn.textContent = origText;
                        btn.style.background = '';
                        btn.style.borderColor = '';
                    }
                }, 4000);
            });
        });
    }

    function showStatus(msg, type) {
        if (!statusEl) return;
        statusEl.textContent  = msg;
        statusEl.className    = 'form-status form-status-' + type;
    }

    console.log('✅ Pap Weld Core Automation — loaded successfully.');
});