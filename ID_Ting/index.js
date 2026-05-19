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

// QR code generator — produces a fake but visually realistic version-10 (57×57) QR code
function buildFakeQR(seed) {
    const N = 57;
    let s = seed >>> 0;
    function rng() {
        s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
        return s / 0x100000000;
    }

    const g = Array.from({length: N}, () => Array.from({length: N}, () => rng() > 0.55 ? 1 : 0));

    function finder(r0, c0) {
        for (let i = -1; i <= 7; i++)
            for (let j = -1; j <= 7; j++) {
                const r = r0+i, c = c0+j;
                if (r >= 0 && r < N && c >= 0 && c < N) g[r][c] = 0;
            }
        const p = [[1,1,1,1,1,1,1],[1,0,0,0,0,0,1],[1,0,1,1,1,0,1],[1,0,1,1,1,0,1],[1,0,1,1,1,0,1],[1,0,0,0,0,0,1],[1,1,1,1,1,1,1]];
        for (let i = 0; i < 7; i++)
            for (let j = 0; j < 7; j++)
                g[r0+i][c0+j] = p[i][j];
    }

    finder(0, 0);
    finder(0, N-7);
    finder(N-7, 0);

    for (let i = 8; i < N-8; i++) {
        g[6][i] = i % 2 === 0 ? 1 : 0;
        g[i][6] = i % 2 === 0 ? 1 : 0;
    }

    function align(cr, cc) {
        const p = [[1,1,1,1,1],[1,0,0,0,1],[1,0,1,0,1],[1,0,0,0,1],[1,1,1,1,1]];
        for (let i = 0; i < 5; i++)
            for (let j = 0; j < 5; j++)
                g[cr-2+i][cc-2+j] = p[i][j];
    }

    for (const ar of [6, 28, 50])
        for (const ac of [6, 28, 50]) {
            if (ar <= 8 && ac <= 8) continue;
            if (ar <= 8 && ac >= N-9) continue;
            if (ar >= N-9 && ac <= 8) continue;
            align(ar, ac);
        }

    const parts = ['<svg viewBox="0 0 57 57" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;height:auto"><rect width="57" height="57" fill="white"/><g fill="black">'];
    for (let r = 0; r < N; r++)
        for (let c = 0; c < N; c++)
            if (g[r][c]) parts.push(`<rect x="${c}" y="${r}" width="1.1" height="1.1"/>`);
    parts.push('</g></svg>');
    return parts.join('');
}

let qrTimer = null;

function startQRCycle() {
    const wrap = document.getElementById('qrCodeWrap');
    function tick() { wrap.innerHTML = buildFakeQR(Math.random() * 0xFFFFFFFF >>> 0); }
    tick();
    qrTimer = setInterval(tick, 167);
}

function stopQRCycle() {
    clearInterval(qrTimer);
    qrTimer = null;
}

// QR modal
const qrModal    = document.getElementById('qrModal');
const qrBackdrop = document.getElementById('qrBackdrop');
const qrClose    = document.getElementById('qrClose');
const btnShowQR  = document.getElementById('btnShowQR');

btnShowQR.addEventListener('click', () => { qrModal.classList.add('open'); startQRCycle(); });
qrBackdrop.addEventListener('click', () => { qrModal.classList.remove('open'); stopQRCycle(); });
qrClose.addEventListener('click',   () => { qrModal.classList.remove('open'); stopQRCycle(); });

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
                        <div class="field"><div class="field-label">Navn</div><div class="field-value">Victor Ninn Kuzimski</div></div>
                        <div class="field"><div class="field-label">Fødselsdag</div><div class="field-value">24 sep, 2007</div></div>
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
