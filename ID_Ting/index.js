const inner = document.getElementById('carouselInner');
const dotEls = document.querySelectorAll('.dot');

let current = 0;
const total = 2;
let startX = 0;
let lastX = 0;
let dragging = false;

function setSlide(idx, animate = true) {
    current = Math.max(0, Math.min(idx, total - 1));
    inner.style.transition = animate
        ? 'transform 0.36s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        : 'none';
    inner.style.transform = `translateX(${-current * 100}%)`;
    dotEls.forEach((d, i) => d.classList.toggle('active', i === current));
}

function onStart(x) {
    startX = x;
    lastX = x;
    dragging = true;
    inner.style.transition = 'none';
}

function onMove(x) {
    if (!dragging) return;
    lastX = x;
    const dx = x - startX;
    inner.style.transform = `translateX(calc(${-current * 100}% + ${dx}px))`;
}

function onEnd() {
    if (!dragging) return;
    dragging = false;
    const dx = lastX - startX;
    if (dx < -50) setSlide(current + 1);
    else if (dx > 50) setSlide(current - 1);
    else setSlide(current);
}

inner.addEventListener('touchstart', e => onStart(e.touches[0].clientX), { passive: true });
inner.addEventListener('touchmove',  e => onMove(e.touches[0].clientX),  { passive: true });
inner.addEventListener('touchend',   onEnd);

inner.addEventListener('mousedown', e => { e.preventDefault(); onStart(e.clientX); });
document.addEventListener('mousemove', e => onMove(e.clientX));
document.addEventListener('mouseup',   onEnd);

dotEls.forEach(d => d.addEventListener('click', () => setSlide(+d.dataset.idx)));

// QR modal
const qrModal    = document.getElementById('qrModal');
const qrBackdrop = document.getElementById('qrBackdrop');
const qrClose    = document.getElementById('qrClose');
const btnShowQR  = document.getElementById('btnShowQR');

btnShowQR.addEventListener('click', () => qrModal.classList.add('open'));
qrBackdrop.addEventListener('click', () => qrModal.classList.remove('open'));
qrClose.addEventListener('click',   () => qrModal.classList.remove('open'));

// Landscape view
const btnLandscape = document.getElementById('btnLandscape');

function buildLandscapeOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'landscape-overlay open';
    overlay.id = 'landscapeOverlay';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'landscape-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', () => overlay.remove());

    const cards = [
        {
            cls: 'card--id',
            html: `
                <div class="card-top">
                    <img class="eboks-logo-img" src="assets/e-boks-logo-white.png" alt="e-Boks">
                    <span class="card-type-text">e-Boks ID</span>
                </div>
                <div class="card-bottom">
                    <div class="photo-wrap">
                        <img src="assets/person-image.jpg" alt="Foto" width="100%" height="100%" style="object-fit:cover;display:block;">
                    </div>
                    <div class="id-fields">
                        <div class="field"><div class="field-label">Navn</div><div class="field-value">Frida Wedell Seerup</div></div>
                        <div class="field"><div class="field-label">Fødselsdag</div><div class="field-value">07 jan, 2008</div></div>
                    </div>
                </div>`
        },
        {
            cls: 'card--age',
            html: `
                <div class="card-top">
                    <img class="eboks-logo-img" src="assets/e-boks-logo-white.png" alt="e-Boks">
                    <span class="card-type-text">Aldersbevis</span>
                </div>
                <div class="card-bottom">
                    <div class="photo-wrap">
                        <img src="assets/person-image.jpg" alt="Foto" width="100%" height="100%" style="object-fit:cover;display:block;">
                    </div>
                    <div class="age-display">18+</div>
                </div>`
        }
    ];

    const cardData = cards[current];
    const cardEl = document.createElement('div');
    cardEl.className = `card landscape-card ${cardData.cls}`;
    cardEl.innerHTML = `<div class="card-content">${cardData.html}</div>`;

    overlay.appendChild(closeBtn);
    overlay.appendChild(cardEl);
    document.body.appendChild(overlay);
}

btnLandscape.addEventListener('click', buildLandscapeOverlay);

// Tab bar (cosmetic switching)
document.getElementById('tabHjem').addEventListener('click', function() {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('tab--active'));
    this.classList.add('tab--active');
});
document.getElementById('tabSettings').addEventListener('click', function() {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('tab--active'));
    this.classList.add('tab--active');
});
