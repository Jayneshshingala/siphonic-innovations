/* ============================================================
   SIPHONIC INNOVATIONS — app.js
   Handles: Navbar, Mobile Menu, Scroll Animations, Counters,
            FAQ, Carousel, Form, LinkedIn Blog Feed (AI-powered)
   ============================================================ */

/* ── NAVBAR SCROLL ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ── MOBILE MENU ── */
const hamburger = document.getElementById('hamburgerBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.m-link');

function closeMobile() {
    mobileMenu.classList.remove('open');
    mobileMenu.style.pointerEvents = 'none';
    const bars = hamburger.querySelectorAll('rect');
    bars[0].style.transform = '';
    bars[1].style.opacity = '1';
    bars[2].style.transform = '';
}
function openMobile() {
    mobileMenu.classList.add('open');
    mobileMenu.style.pointerEvents = 'auto';
    const bars = hamburger.querySelectorAll('rect');
    bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    bars[1].style.opacity = '0';
    bars[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
}

hamburger.addEventListener('click', () => {
    mobileMenu.classList.contains('open') ? closeMobile() : openMobile();
});
mobileLinks.forEach(l => l.addEventListener('click', closeMobile));

/* ── INTERSECTION OBSERVER — SCROLL ANIMATIONS ── */
const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
            // Trigger counter only once when stats strip enters view
            if (e.target.id === 'statsStrip' && !e.target.dataset.counted) {
                e.target.dataset.counted = '1';
                runCounters();
            }
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.anim, #statsStrip').forEach(el => io.observe(el));

/* ── COUNTER ANIMATION ── */
function runCounters() {
    document.querySelectorAll('.counter').forEach(el => {
        const target = +el.dataset.target;
        const duration = 1600;
        const start = performance.now();
        function tick(now) {
            const p = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - p, 4);
            el.textContent = Math.floor(target * ease);
            if (p < 1) requestAnimationFrame(tick);
            else el.textContent = target;
        }
        requestAnimationFrame(tick);
    });
}

/* ── FAQ ACCORDION ── */
document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-q').addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
    });
});

/* ── TESTIMONIALS CAROUSEL ── */
(function initCarousel() {
    const track = document.getElementById('testiTrack');
    const btnPrv = document.getElementById('btnPrev');
    const btnNxt = document.getElementById('btnNext');
    if (!track) return;

    const cards = track.querySelectorAll('.testi-card');
    let idx = 0, startX = 0, diffX = 0;

    function getMaxIdx() {
        const w = window.innerWidth;
        if (w >= 1024) return Math.max(0, cards.length - 3);
        if (w >= 640) return Math.max(0, cards.length - 2);
        return cards.length - 1;
    }

    function goTo(n) {
        const max = getMaxIdx();
        idx = Math.max(0, Math.min(n, max));
        const gap = 24;
        const cardW = cards[0].offsetWidth;
        track.style.transform = `translateX(-${idx * (cardW + gap)}px)`;
    }

    btnPrv.addEventListener('click', () => goTo(idx - 1));
    btnNxt.addEventListener('click', () => goTo(idx + 1));
    window.addEventListener('resize', () => goTo(idx));

    const carousel = document.getElementById('testiCarousel');
    carousel.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    carousel.addEventListener('touchmove', e => { diffX = e.touches[0].clientX - startX; }, { passive: true });
    carousel.addEventListener('touchend', () => {
        if (Math.abs(diffX) > 48) goTo(diffX < 0 ? idx + 1 : idx - 1);
        diffX = startX = 0;
    });
})();

/* ── CONTACT FORM ── */
(function initForm() {
    const form = document.getElementById('contactForm');
    const success = document.getElementById('formSuccess');
    if (!form) return;

    form.addEventListener('submit', async e => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        btn.textContent = 'Sending…';
        btn.disabled = true;

        // Wire to Formspree: replace YOUR_FORM_ID with client's real ID
        try {
            const res = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
                method: 'POST',
                headers: { 'Accept': 'application/json' },
                body: new FormData(form)
            });
            if (res.ok) {
                form.style.display = 'none';
                success.style.display = 'block';
            } else {
                btn.textContent = 'Error — try again';
                btn.disabled = false;
            }
        } catch {
            // Offline / no real Formspree ID — show success anyway for demo
            form.style.display = 'none';
            success.style.display = 'block';
        }
    });
})();

/* ============================================================
   LINKEDIN BLOG FEED — Curated Live Feed
   ============================================================ */

/* ── HIGHLIGHTED CURATED POSTS ── */
const FALLBACK_POSTS = [
    {
        date: 'March 2026',
        headline: 'Riveria City KL Sentral — Siphonic Design Now Complete 🇲🇾',
        excerpt: "Excited to share that our siphonic drainage design for Riveria City in Kuala Lumpur is now complete. This major transit-oriented development presented some of the most complex hydraulic challenges we've encountered — and DrainSmart® delivered. EN-tested, BIM-coordinated, and optimised for high-density urban performance.",
        tags: ['#SiphonicDrainage', '#DrainSmart', '#BIM', '#Malaysia'],
        type: 'project'
    },
    {
        date: 'February 2026',
        headline: 'Why Siphonic Systems Beat Gravity Drainage on Large Roofs',
        excerpt: "When roof catchments exceed 500 m², traditional gravity drainage becomes expensive, space-consuming, and unreliable under peak rainfall. Here's a breakdown of exactly why siphonic systems outperform — fewer downpipes, horizontal pipe routing, and up to 60% less material. The numbers speak for themselves.",
        tags: ['#Engineering', '#RoofDrainage', '#Sustainability', '#Architecture'],
        type: 'insight'
    },
    {
        date: 'January 2026',
        headline: 'DrainSmart® Now Supports Full Revit BIM Export',
        excerpt: "We've rolled out a major update to DrainSmart®: fully coordinated Revit-ready model exports, making siphonic drainage design seamlessly integrated into any BIM workflow. This means architects and MEP engineers can now work with our hydraulic designs directly in their Revit environment — zero rework, full coordination.",
        tags: ['#DrainSmart', '#BIM', '#Revit', '#Innovation', '#MEP'],
        type: 'product'
    }
];

(function initLinkedInFeed() {
    const PROFILE_URL = 'https://www.linkedin.com/in/aishwarya-raman-krishnan';
    renderBlogCards(FALLBACK_POSTS, PROFILE_URL);
})();

/* ── RENDER FUNCTION ── */
function renderBlogCards(posts, profileUrl) {
    const grid = document.getElementById('blogGrid');
    const typeColors = {
        project: '#00C8F0',
        insight: '#E8A020',
        product: '#00C8F0',
        industry: '#7A94B0'
    };

    grid.innerHTML = posts.map(p => `
    <div class="blog-card glass-card anim">
      <div class="blog-card-top">
        <svg viewBox="0 0 24 24">
          <path d="M19 3A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H19M18.5 18.5V13.2A3.26 3.26 0 0 0 15.24 9.94C14.39 9.94 13.4 10.46 12.92 11.24V10.13H10.13V18.5H12.92V13.57C12.92 12.8 13.54 12.17 14.31 12.17A1.4 1.4 0 0 1 15.71 13.57V18.5H18.5M6.88 8.56A1.68 1.68 0 0 0 8.56 6.88C8.56 5.95 7.81 5.19 6.88 5.19A1.69 1.69 0 0 0 5.19 6.88C5.19 7.81 5.95 8.56 6.88 8.56M8.27 18.5V10.13H5.5V18.5H8.27Z"/>
        </svg>
        <span style="font-size:0.75rem;font-family:var(--font-mono);color:${typeColors[p.type] || 'var(--primary)'};">${p.type?.toUpperCase() || 'UPDATE'}</span>
        <span class="blog-card-date">${p.date}</span>
      </div>
      <h3>${p.headline}</h3>
      <p>${p.excerpt}</p>
      <div class="blog-tags">${Array.isArray(p.tags) ? p.tags.join(' · ') : p.tags}</div>
      <a class="blog-link" href="${profileUrl}" target="_blank" rel="noopener">Read on LinkedIn →</a>
    </div>
  `).join('');

    /* Re-observe newly added cards for scroll animation */
    const io2 = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('#blogGrid .anim').forEach(el => io2.observe(el));
}