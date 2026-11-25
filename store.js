// =========================================================================
// SLAO STORE SETTINGS, BACKEND SYNC & CART/LIKE HELPERS (v13)
// =========================================================================

const SLAO_API_BASE = window.location.origin.startsWith('http')
    ? window.location.origin + '/api'
    : 'http://localhost:3000/api';


// =========================================================================
// FIREBASE CONFIG (slao-collections) & CUSTOMER PROFILE SYNC
// =========================================================================
const SLAO_FIREBASE_CONFIG = {
    apiKey: "AIzaSyCtte2KWzKsCWysJ0EGwMKs_KFjsg6r7_0",
    authDomain: "slao-collections.firebaseapp.com",
    projectId: "slao-collections",
    storageBucket: "slao-collections.firebasestorage.app",
    messagingSenderId: "505858269592",
    appId: "1:505858269592:web:dcbca234f8d2a352be8bed",
    measurementId: "G-EM759EGCR6"
};

function syncCustomerProfileToBackend(userObj) {
    if (!userObj || !userObj.email) return;
    const list = JSON.parse(localStorage.getItem('slao_customers') || '[]');
    const idx = list.findIndex(c => (c.email || '').toLowerCase() === userObj.email.toLowerCase());
    const rec = {
        ...userObj,
        updatedAt: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    };
    if (idx !== -1) list[idx] = rec;
    else list.unshift(rec);
    localStorage.setItem('slao_customers', JSON.stringify(list));

    fetch(`${SLAO_API_BASE}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rec)
    }).catch(() => {});
}

const SLAO_DELIVERY_FEE = 0;
const SLAO_URGENT_FEE = 0;
const SLAO_FREE_SHIPPING_MIN = 3500;
const SLAO_COD_FEE = 80;

const SLAO_SIZE_PRICE_DIFF = {
    "S": -200,
    "M": 0,
    "L": 300,
    "XL": 600
};

const SLAO_PRODUCTS = [
    {
        id: 1,
        name: "Noir Embroidered Lawn 3-Piece",
        category: "unstitched",
        price: 6490,
        originalPrice: 7990,
        isSale: true,
        image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop",
        colorImages: {
            "Black": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop",
            "Maroon": "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop",
            "Emerald": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop"
        },
        colors: ["Black", "Maroon", "Emerald"],
        tag: "Bestseller",
        description: "Exquisite embroidered lawn shirt accompanied by organza bordered trousers and printed chiffon dupatta."
    },
    {
        id: 2,
        name: "Dusty Rose Printed Pret Kurti",
        category: "ready",
        price: 3850,
        originalPrice: 3850,
        isSale: false,
        image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop",
        colorImages: {
            "Dusty Rose": "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop",
            "White": "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=800&auto=format&fit=crop",
            "Peach": "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=800&auto=format&fit=crop"
        },
        colors: ["Dusty Rose", "White", "Peach"],
        tag: "New",
        description: "Soft cotton pret kurti with delicate neck embroidery and straight cut silhouette."
    },
    {
        id: 3,
        name: "Lilac Chiffon Festive Edition",
        category: "unstitched",
        price: 8990,
        originalPrice: 10990,
        isSale: true,
        image: "https://images.unsplash.com/photo-1563178406-4cdc2923acbc?q=80&w=800&auto=format&fit=crop",
        colorImages: {
            "Lilac": "https://images.unsplash.com/photo-1563178406-4cdc2923acbc?q=80&w=800&auto=format&fit=crop",
            "Gold": "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop",
            "Lavender": "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop"
        },
        colors: ["Lilac", "Gold", "Lavender"],
        tag: "Luxury",
        description: "Graceful unstitched 3-piece suit featuring zari thread work."
    },
    {
        id: 4,
        name: "Maroon Embroidered Kurti Suit",
        category: "ready",
        price: 7450,
        originalPrice: 7450,
        isSale: false,
        image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop",
        colorImages: {
            "Maroon": "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop",
            "Black": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop",
            "Gold": "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop"
        },
        colors: ["Maroon", "Black", "Gold"],
        tag: "Trending",
        description: "Deep stitched ensemble tailored to perfection for formal evening wear."
    },
    {
        id: 5,
        name: "Olive Floral Daily Pret",
        category: "ready",
        price: 2950,
        originalPrice: 3500,
        isSale: true,
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
        colorImages: {
            "Olive": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
            "Sage": "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=800&auto=format&fit=crop",
            "Cream": "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=800&auto=format&fit=crop"
        },
        colors: ["Olive", "Sage", "Cream"],
        tag: "Sale",
        description: "Vibrant printed kurti set crafted in lightweight breathable cotton."
    },
    {
        id: 6,
        name: "Beige Minimal Silk Tunic",
        category: "western",
        price: 5290,
        originalPrice: 5290,
        isSale: false,
        image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=800&auto=format&fit=crop",
        colorImages: {
            "Beige": "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=800&auto=format&fit=crop",
            "Ivory": "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=800&auto=format&fit=crop",
            "Brown": "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop"
        },
        colors: ["Beige", "Ivory", "Brown"],
        tag: "Modern",
        description: "Elegant tunic crafted from premium silk blend fabric."
    },
    {
        id: 7,
        name: "Royal Crimson Jacquard 2-Piece",
        category: "unstitched",
        price: 5490,
        originalPrice: 6500,
        isSale: true,
        image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop",
        colorImages: {
            "Crimson": "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop",
            "Maroon": "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop",
            "Black": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop"
        },
        colors: ["Crimson", "Maroon", "Black"],
        tag: "Limited",
        description: "Rich jacquard weave fabric with detailed neck motif."
    },
    {
        id: 8,
        name: "Classic Ivory Linen Co-Ord Set",
        category: "western",
        price: 3200,
        originalPrice: 3200,
        isSale: false,
        image: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=800&auto=format&fit=crop",
        colorImages: {
            "Ivory": "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=800&auto=format&fit=crop",
            "Sand": "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=800&auto=format&fit=crop",
            "Black": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop"
        },
        colors: ["Ivory", "Sand", "Black"],
        tag: "Casual",
        description: "Minimalist matching co-ord set ideal for summer daytime outings."
    }
];

function getPriceForSize(product, size = "M") {
    if (product.sizePrices && typeof product.sizePrices[size] === "number") {
        return Math.max(0, product.sizePrices[size]);
    }
    const diff = SLAO_SIZE_PRICE_DIFF[size] || 0;
    return Math.max(0, product.price + diff);
}

function getImageForColor(product, color) {
    if (product.colorImages && color && product.colorImages[color]) {
        return product.colorImages[color];
    }
    return product.image;
}

function resolveProductImage(imgPath, prefix = "") {
    if (!imgPath) return "";
    if (imgPath.startsWith("http://") || imgPath.startsWith("https://") || imgPath.startsWith("data:")) {
        return imgPath;
    }
    return prefix + imgPath;
}

function getCart() {
    return JSON.parse(localStorage.getItem('slao_cart') || '[]');
}

function saveCart(cart) {
    localStorage.setItem('slao_cart', JSON.stringify(cart));
}

function getCartCount() {
    return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

function quickAddToCart(prodId, selectedColor) {
    const product = SLAO_PRODUCTS.find(p => p.id === Number(prodId));
    if (!product) return;
    const color = selectedColor || product.colors[0];
    const size = 'M';
    const cart = getCart();
    const existing = cart.find(x => x.id === product.id && x.size === size && x.color === color);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: getPriceForSize(product, size),
            image: getImageForColor(product, color),
            size,
            color,
            quantity: 1
        });
    }
    saveCart(cart);
    updateHeaderCounts();
    alert(`${product.name} (${color}) added to your cart!`);
}

function calculateDeliveryCharges(subtotal, deliveryType = "STANDARD") {
    return 0;
}

function calculateCodCharges(subtotal, payType = "COD") {
    if (subtotal <= 0) return 0;
    return payType === "COD" ? SLAO_COD_FEE : 0;
}

function getLikedProducts() {
    return JSON.parse(localStorage.getItem('slao_liked') || '[]');
}

function saveLikedProducts(ids) {
    localStorage.setItem('slao_liked', JSON.stringify(ids));
}

function syncLikeToServer(prodId, isLiked) {
    const product = SLAO_PRODUCTS.find(p => p.id === Number(prodId));
    const user = JSON.parse(localStorage.getItem('slao_current_user') || 'null');
    const payload = {
        productId: Number(prodId),
        productName: product ? product.name : ('Product #' + prodId),
        customerName: user ? user.name : 'Guest Shopper',
        customerEmail: user ? user.email : 'guest@slao.pk',
        liked: isLiked
    };

    const localLikeRecords = JSON.parse(localStorage.getItem('slao_admin_likes') || '[]')
        .filter(l => !(Number(l.productId) === payload.productId && l.customerEmail === payload.customerEmail));
    if (isLiked) {
        localLikeRecords.unshift({
            ...payload,
            date: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
        });
    }
    localStorage.setItem('slao_admin_likes', JSON.stringify(localLikeRecords));

    fetch(`${SLAO_API_BASE}/likes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    }).catch(() => {});
}

function toggleLikeProduct(prodId, btnEl) {
    const idNum = Number(prodId);
    const liked = getLikedProducts();
    const exists = liked.includes(idNum);
    const nowLiked = !exists;
    const updated = exists ? liked.filter(id => id !== idNum) : [...liked, idNum];
    saveLikedProducts(updated);
    updateHeaderCounts();
    syncLikeToServer(idNum, nowLiked);

    if (btnEl) {
        const icon = btnEl.querySelector('i');
        if (icon) {
            icon.className = nowLiked
                ? 'fa-solid fa-heart text-rose-600'
                : 'fa-regular fa-heart text-slao-maroon';
        }
        const label = btnEl.querySelector('span');
        if (label) {
            label.innerText = nowLiked ? 'Saved in Liked Items' : 'Save to Liked Items';
        }
    }
    return nowLiked;
}

function updateHeaderCounts() {
    const cartEl = document.getElementById('cart-count');
    if (cartEl) cartEl.innerText = getCartCount();

    const likedEl = document.getElementById('liked-count');
    if (likedEl) likedEl.innerText = getLikedProducts().length;

    const user = JSON.parse(localStorage.getItem('slao_current_user') || 'null');
    const profileIcon = document.getElementById('header-profile-icon');
    if (profileIcon) {
        const parentLink = profileIcon.closest('a');
        if (user && parentLink) {
            parentLink.title = `${user.name} (View Profile)`;
            if (user.picture) {
                parentLink.innerHTML = `<img id="header-profile-icon" src="${user.picture}" referrerpolicy="no-referrer" alt="${user.name}" class="w-8 h-8 rounded-full object-cover border-2 border-slao-maroon">`;
            } else {
                const initial = (user.name || 'U').charAt(0).toUpperCase();
                parentLink.innerHTML = `<span id="header-profile-icon" class="w-8 h-8 rounded-full bg-slao-maroon text-white text-xs font-bold inline-flex items-center justify-center">${initial}</span>`;
            }
        }
    }
}

function getBasePathPrefix() {
    return window.location.pathname.includes('/collections/') ? '../../' : '';
}

function toggleTopSearch() {
    let panel = document.getElementById('top-search-panel');
    if (!panel) {
        const header = document.querySelector('header');
        if (!header) return;
        panel = document.createElement('div');
        panel.id = 'top-search-panel';
        panel.className = 'hidden bg-white border-b border-gray-200 shadow-2xl px-4 py-4';
        panel.innerHTML = `
            <div class="max-w-4xl mx-auto space-y-3">
                <div class="flex items-center gap-2">
                    <div class="relative flex-grow">
                        <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-3.5 text-gray-400 text-sm"></i>
                        <input id="top-search-input" type="text" oninput="runTopSearch(this.value)"
                            placeholder="Search suits by name, category, or color..."
                            class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slao-maroon">
                    </div>
                    <button type="button" onclick="toggleTopSearch()" class="px-3.5 py-2.5 text-xs font-bold text-gray-600 hover:text-slao-maroon border rounded-xl">Close</button>
                </div>
                <div id="top-search-results" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-80 overflow-y-auto"></div>
            </div>
        `;
        header.appendChild(panel);
    }

    panel.classList.toggle('hidden');
    if (!panel.classList.contains('hidden')) {
        const input = document.getElementById('top-search-input');
        input.focus();
        runTopSearch(input.value);
    }
}

function runTopSearch(query) {
    const q = (query || '').trim().toLowerCase();
    const box = document.getElementById('top-search-results');
    if (!box) return;

    const prefix = getBasePathPrefix();
    const matches = !q
        ? SLAO_PRODUCTS
        : SLAO_PRODUCTS.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.colors.some(c => c.toLowerCase().includes(q))
        );

    if (!matches.length) {
        box.innerHTML = `<p class="text-xs text-rose-600 col-span-full py-2">No matching products found.</p>`;
        return;
    }

    box.innerHTML = matches.map(p => `
        <a href="${prefix}product.html?id=${p.id}" class="flex items-center gap-3 p-2.5 border rounded-xl hover:border-slao-maroon bg-slao-cream/50 transition">
            <img src="${resolveProductImage(p.image, prefix)}" alt="${p.name}" class="w-12 h-14 object-cover rounded-lg border">
            <div class="text-xs">
                <p class="font-bold text-gray-900 line-clamp-1">${p.name}</p>
                <p class="text-[11px] text-gray-500 capitalize">${p.category} &bull; ${p.colors.join(', ')}</p>
                <p class="text-slao-maroon font-bold mt-0.5">Rs. ${p.price.toLocaleString()}</p>
            </div>
        </a>
    `).join('');
}

document.addEventListener('DOMContentLoaded', updateHeaderCounts);


// =========================================================================
// GLOBAL CENTER POPUP FOR ALL NOTIFICATIONS/ERRORS + CENTER LOGO ZOOM MODAL
// =========================================================================
function ensureGlobalPopups() {
    if (!document.body) return;

    // 1. Center Notification / Error Popup Modal
    if (!document.getElementById('slao-global-popup')) {
        const popupEl = document.createElement('div');
        popupEl.id = 'slao-global-popup';
        popupEl.className = 'hidden fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4';
        popupEl.innerHTML = `
            <div id="slao-global-popup-card" class="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border-2 border-slao-maroon">
                <div id="slao-global-popup-header" class="bg-slao-maroon text-white px-6 py-4 flex items-center justify-between">
                    <div class="flex items-center gap-2.5">
                        <i id="slao-global-popup-icon" class="fa-solid fa-circle-info text-lg text-slao-gold"></i>
                        <h3 id="slao-global-popup-title" class="font-serif text-base sm:text-lg font-bold">SLAO Notification</h3>
                    </div>
                    <button type="button" onclick="closeSlaoPopup()" class="text-white/80 hover:text-white text-lg">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div class="p-6 space-y-4 text-xs sm:text-sm">
                    <div id="slao-global-popup-body" class="text-gray-800 leading-relaxed font-medium"></div>
                    <div class="flex justify-end pt-1">
                        <button type="button" onclick="closeSlaoPopup()" id="slao-global-popup-btn" class="px-6 py-2.5 bg-slao-maroon hover:bg-slao-maroonDark text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow">
                            OK
                        </button>
                    </div>
                </div>
            </div>
        `;
        popupEl.addEventListener('click', (e) => {
            if (e.target === popupEl) closeSlaoPopup();
        });
        document.body.appendChild(popupEl);
    }

    // 2. Center Logo Zoom Lightbox Modal
    if (!document.getElementById('slao-logo-zoom-modal')) {
        const prefix = typeof getBasePathPrefix === 'function' ? getBasePathPrefix() : '';
        const zoomEl = document.createElement('div');
        zoomEl.id = 'slao-logo-zoom-modal';
        zoomEl.className = 'hidden fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4';
        zoomEl.innerHTML = `
            <div class="relative bg-slao-charcoal border-2 border-slao-gold rounded-3xl p-6 sm:p-8 shadow-2xl max-w-md w-full flex flex-col items-center text-center space-y-4">
                <button type="button" onclick="closeSlaoLogoZoom()" class="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition" title="Close">
                    <i class="fa-solid fa-xmark text-lg"></i>
                </button>
                <img id="slao-logo-zoom-img" src="${prefix}images/slao-logo.png" alt="SLAO Collections Logo" class="w-64 h-64 sm:w-80 sm:h-80 rounded-full object-cover border-4 border-slao-gold shadow-2xl">
                <div>
                    <p class="font-serif text-xl sm:text-2xl font-extrabold tracking-widest text-white">SLAO COLLECTIONS</p>
                    <p class="text-xs text-slao-gold uppercase tracking-widest mt-1">100% Authentic Quality &bull; Premium Fabric &amp; Original Designer Prints</p>
                </div>
            </div>
        `;
        zoomEl.addEventListener('click', (e) => {
            if (e.target === zoomEl) closeSlaoLogoZoom();
        });
        document.body.appendChild(zoomEl);
    }
}

function showSlaoPopup(message, type = 'auto') {
    ensureGlobalPopups();
    const popup = document.getElementById('slao-global-popup');
    const card = document.getElementById('slao-global-popup-card');
    const header = document.getElementById('slao-global-popup-header');
    const icon = document.getElementById('slao-global-popup-icon');
    const title = document.getElementById('slao-global-popup-title');
    const body = document.getElementById('slao-global-popup-body');
    const btn = document.getElementById('slao-global-popup-btn');

    const msgStr = String(message || '');
    const lower = msgStr.toLowerCase();
    let detected = type;
    if (detected === 'auto') {
        if (lower.includes('error') || lower.includes('invalid') || lower.includes('incorrect') || lower.includes('not found') || lower.includes('empty') || lower.includes('please ') || lower.includes('must be')) {
            detected = 'error';
        } else if (lower.includes('success') || lower.includes('added') || lower.includes('confirmed') || lower.includes('thank you') || lower.includes('submitted') || lower.includes('recorded')) {
            detected = 'success';
        } else {
            detected = 'info';
        }
    }

    if (detected === 'error') {
        card.className = 'bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border-2 border-rose-600';
        header.className = 'bg-rose-600 text-white px-6 py-4 flex items-center justify-between';
        icon.className = 'fa-solid fa-triangle-exclamation text-lg text-white';
        title.innerText = 'Alert / Error';
        btn.className = 'px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow';
    } else if (detected === 'success') {
        card.className = 'bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border-2 border-emerald-600';
        header.className = 'bg-emerald-700 text-white px-6 py-4 flex items-center justify-between';
        icon.className = 'fa-solid fa-circle-check text-lg text-emerald-200';
        title.innerText = 'Notification';
        btn.className = 'px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow';
    } else {
        card.className = 'bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border-2 border-slao-maroon';
        header.className = 'bg-slao-maroon text-white px-6 py-4 flex items-center justify-between';
        icon.className = 'fa-solid fa-circle-info text-lg text-slao-gold';
        title.innerText = 'SLAO Notice';
        btn.className = 'px-6 py-2.5 bg-slao-maroon hover:bg-slao-maroonDark text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow';
    }

    body.innerText = msgStr;
    popup.classList.remove('hidden');
}

function closeSlaoPopup() {
    const popup = document.getElementById('slao-global-popup');
    if (popup) popup.classList.add('hidden');
}

function openSlaoLogoZoom(e, imgSrc) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    ensureGlobalPopups();
    const zoomEl = document.getElementById('slao-logo-zoom-modal');
    const zoomImg = document.getElementById('slao-logo-zoom-img');
    if (zoomImg && imgSrc) {
        zoomImg.src = imgSrc;
    }
    if (zoomEl) zoomEl.classList.remove('hidden');
}

function closeSlaoLogoZoom() {
    const zoomEl = document.getElementById('slao-logo-zoom-modal');
    if (zoomEl) zoomEl.classList.add('hidden');
}

// Override native window.alert so ALL alerts across every page open in the center popup
window.alert = function (msg) {
    showSlaoPopup(msg, 'auto');
};

document.addEventListener('DOMContentLoaded', () => {

    // Keep hand pointer cursor consistently over text, links, buttons, and clickable sections (except text inputs/textareas)
    const handSelector = '.copyable-text, .copyable-text *, a, a *, button, button *, [onclick], [onclick] *, .cursor-pointer, .cursor-pointer *, img[src*="slao-logo"], .slao-logo-clickable';
    document.querySelectorAll(handSelector).forEach((el) => {
        if (el.matches('input, textarea, select')) return;
        el.style.setProperty('cursor', 'pointer', 'important');
    });

    ensureGlobalPopups();
    // Make every SLAO logo image show hand pointer cursor and zoom large in center when clicked
    document.querySelectorAll('img[src*="slao-logo"], .slao-logo-clickable').forEach((img) => {
        img.style.setProperty('cursor', 'pointer', 'important');
        img.classList.add('cursor-pointer');
        img.title = 'Click to view SLAO Logo';
        img.addEventListener('click', (e) => openSlaoLogoZoom(e, img.src));
    });
});


// =========================================================================
// 100% AUTHENTIC QUALITY DETAILS POPUP MODAL
// =========================================================================
function openAuthenticQualityModal() {
    let modal = document.getElementById('slao-quality-details-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'slao-quality-details-modal';
        modal.className = 'hidden fixed inset-0 z-[9997] bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto';
        modal.innerHTML = `
            <div class="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border-2 border-slao-maroon my-auto">
                <div class="bg-slao-maroon text-white px-6 py-4 flex items-center justify-between">
                    <div class="flex items-center gap-2.5">
                        <i class="fa-solid fa-shield-halved text-xl text-slao-gold"></i>
                        <div>
                            <h3 class="font-serif text-lg font-bold">100% Authentic Quality</h3>
                            <p class="text-[11px] text-slao-gold">Premium fabric &amp; original designer prints</p>
                        </div>
                    </div>
                    <button type="button" onclick="closeAuthenticQualityModal()" class="text-white/80 hover:text-white text-lg">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div class="p-6 space-y-4 text-xs sm:text-sm text-gray-700">
                    <p class="font-semibold text-gray-900">
                        At SLAO Collections, every outfit goes through strict quality inspection before dispatch so you receive genuine luxury wear.
                    </p>
                    <div class="space-y-2.5">
                        <div class="p-3.5 rounded-2xl bg-slao-cream border border-slao-gold/40 flex items-start gap-3">
                            <i class="fa-solid fa-check-circle text-slao-maroon mt-0.5"></i>
                            <div>
                                <p class="font-bold text-slao-maroon">Premium Export-Grade Fabrics</p>
                                <p class="text-xs text-gray-600 mt-0.5">Pure breathable lawn, soft cotton, fine chiffon, jacquard, and silk blends woven for comfort and long-lasting wear.</p>
                            </div>
                        </div>
                        <div class="p-3.5 rounded-2xl bg-slao-cream border border-slao-gold/40 flex items-start gap-3">
                            <i class="fa-solid fa-palette text-slao-maroon mt-0.5"></i>
                            <div>
                                <p class="font-bold text-slao-maroon">Original Designer Prints &amp; Intricate Embroidery</p>
                                <p class="text-xs text-gray-600 mt-0.5">Exclusive in-house artwork, color-fast dyes that resist fading, and neat zari/thread detailing.</p>
                            </div>
                        </div>
                        <div class="p-3.5 rounded-2xl bg-slao-cream border border-slao-gold/40 flex items-start gap-3">
                            <i class="fa-solid fa-award text-slao-maroon mt-0.5"></i>
                            <div>
                                <p class="font-bold text-slao-maroon">Multi-Step Quality Check &amp; Safe Packaging</p>
                                <p class="text-xs text-gray-600 mt-0.5">Each suit is checked for stitching precision, fabric measurement, and defect-free finishing before sealing.</p>
                            </div>
                        </div>
                    </div>
                    <div class="flex justify-end pt-1">
                        <button type="button" onclick="closeAuthenticQualityModal()" class="px-6 py-2.5 bg-slao-maroon hover:bg-slao-maroonDark text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        `;
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeAuthenticQualityModal();
        });
        document.body.appendChild(modal);
    }
    modal.classList.remove('hidden');
}

function closeAuthenticQualityModal() {
    const modal = document.getElementById('slao-quality-details-modal');
    if (modal) modal.classList.add('hidden');
}
