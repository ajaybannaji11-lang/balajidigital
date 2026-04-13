/* ============================================
   BALAJI DIGITAL ADS — products.js
   Product Modal + Wishlist + WhatsApp Inquiry
   ============================================ */

const WA = '918989593938';
let currentProduct = null;

/* ─── FILTER ─── */
function filterProducts(cat, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.prod-card').forEach(card => {
        if (cat === 'all' || card.dataset.cat === cat) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
}

/* ─── PRODUCT MODAL ─── */
function openProductModal(card) {
    const name  = card.dataset.name  || '';
    const desc  = card.dataset.desc  || '';
    const price = card.dataset.price || '';
    const badge = card.dataset.badge || '';
    const img   = card.dataset.img   || '';

    currentProduct = { name, desc, price, badge, img, card };

    document.getElementById('modalProductName').textContent  = name;
    document.getElementById('modalProductDesc').textContent  = desc;
    document.getElementById('modalProductPrice').textContent = price;
    const badgeEl = document.getElementById('modalProductBadge');
    badgeEl.textContent = badge;
    badgeEl.style.display = badge ? 'inline-block' : 'none';

    const imgEl = document.getElementById('modalProductImg');
    imgEl.src = img;
    imgEl.onerror = function() {
        this.src = `https://placehold.co/500x375/800020/f5f0f0?text=${encodeURIComponent(name)}`;
    };

    // Update wishlist button state in modal
    const wishBtn = card.querySelector('.prod-wish-btn');
    const modalWishBtn = document.getElementById('modalWishBtn');
    if (wishBtn && wishBtn.classList.contains('wished')) {
        modalWishBtn.textContent = '❤️ Remove from Wishlist';
    } else {
        modalWishBtn.textContent = '🤍 Add to Wishlist';
    }

    document.getElementById('productModal').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeProductModal(e) {
    if (e.target === document.getElementById('productModal')) closeProductModalBtn();
}

function closeProductModalBtn() {
    document.getElementById('productModal').classList.remove('open');
    document.body.style.overflow = '';
    currentProduct = null;
}

/* ─── INQUIRE PRODUCT (from modal) ─── */
function inquireProduct() {
    if (!currentProduct) return;
    const user = getCurrentUser();
    const userName = user ? user.name : 'Customer';
    const userPhone = user ? user.phone : '';
    const msg = `Hello Balaji Digital Ads! 👋%0A%0AProduct Inquiry:%0A*Product:* ${encodeURIComponent(currentProduct.name)}%0A*Price:* ${encodeURIComponent(currentProduct.price)}%0A*Customer Name:* ${encodeURIComponent(userName)}%0A*Phone:* ${encodeURIComponent(userPhone || 'Not provided')}%0A%0AMain is product ke baare mein aur jaankari chahta hoon.`;
    window.open(`https://wa.me/${WA}?text=${msg}`, '_blank');
}

/* ─── INQUIRE PRODUCT (direct from card) ─── */
function inquireProductDirect(card) {
    const name  = card.dataset.name  || '';
    const price = card.dataset.price || '';
    const user = getCurrentUser();
    const userName = user ? user.name : 'Customer';
    const userPhone = user ? user.phone : '';
    const msg = `Hello Balaji Digital Ads! 👋%0A%0AProduct Inquiry:%0A*Product:* ${encodeURIComponent(name)}%0A*Price:* ${encodeURIComponent(price)}%0A*Customer Name:* ${encodeURIComponent(userName)}%0A*Phone:* ${encodeURIComponent(userPhone || 'Not provided')}%0A%0AMain is product ke baare mein interested hoon.`;
    window.open(`https://wa.me/${WA}?text=${msg}`, '_blank');
}

/* ─── WISHLIST ─── */
function getWishlist() { try { return JSON.parse(localStorage.getItem('bd_wishlist') || '[]'); } catch { return []; } }
function saveWishlist(w) { localStorage.setItem('bd_wishlist', JSON.stringify(w)); }

function toggleWishlist(btn) {
    const card = btn.closest('.prod-card');
    if (!card) return;
    const name  = card.dataset.name  || '';
    const price = card.dataset.price || '';
    const img   = card.dataset.img   || '';

    let wishlist = getWishlist();
    const idx = wishlist.findIndex(i => i.name === name);

    if (idx > -1) {
        // Remove
        wishlist.splice(idx, 1);
        // Update all wish buttons for this product
        card.querySelectorAll('.prod-wish-btn, .prod-wish-btn-sm').forEach(b => {
            b.classList.remove('wished');
            if (b.classList.contains('prod-wish-btn')) b.textContent = '🤍';
        });
    } else {
        // Add
        wishlist.push({ name, price, img });
        card.querySelectorAll('.prod-wish-btn, .prod-wish-btn-sm').forEach(b => {
            b.classList.add('wished');
            if (b.classList.contains('prod-wish-btn')) b.textContent = '❤️';
        });
    }

    saveWishlist(wishlist);
    updateWishlistUI();
}

function toggleWishlistFromModal() {
    if (!currentProduct) return;
    const wishBtn = currentProduct.card ? currentProduct.card.querySelector('.prod-wish-btn') : null;
    if (wishBtn) toggleWishlist(wishBtn);

    // Update modal button
    const wishlist = getWishlist();
    const inWishlist = wishlist.some(i => i.name === currentProduct.name);
    document.getElementById('modalWishBtn').textContent = inWishlist ? '❤️ Remove from Wishlist' : '🤍 Add to Wishlist';
}

function updateWishlistUI() {
    const wishlist = getWishlist();
    const count = wishlist.length;

    // Update FAB count
    const countEl = document.getElementById('wishlistCount');
    if (countEl) {
        countEl.textContent = count;
        countEl.style.display = count > 0 ? 'inline-flex' : 'none';
    }

    // Update sidebar
    const itemsEl = document.getElementById('wishlistItems');
    const footerEl = document.getElementById('wishlistFooter');
    if (!itemsEl) return;

    if (wishlist.length === 0) {
        itemsEl.innerHTML = '<p class="wishlist-empty">Wishlist khali hai. Products add karein!</p>';
        if (footerEl) footerEl.style.display = 'none';
        return;
    }

    if (footerEl) footerEl.style.display = 'block';

    itemsEl.innerHTML = wishlist.map((item, i) => `
        <div class="wishlist-item">
            <div class="wi-emoji">🛍️</div>
            <div class="wi-info">
                <div class="wi-name">${item.name}</div>
                <div class="wi-price">${item.price}</div>
            </div>
            <button class="wi-remove" onclick="removeFromWishlist(${i})" title="Remove">✕</button>
        </div>
    `).join('');
}

function removeFromWishlist(idx) {
    const wishlist = getWishlist();
    const removed = wishlist[idx];
    wishlist.splice(idx, 1);
    saveWishlist(wishlist);

    // Unmark on card
    if (removed) {
        document.querySelectorAll('.prod-card').forEach(card => {
            if (card.dataset.name === removed.name) {
                card.querySelectorAll('.prod-wish-btn').forEach(b => {
                    b.classList.remove('wished');
                    b.textContent = '🤍';
                });
            }
        });
    }
    updateWishlistUI();
}

function openWishlist() {
    document.getElementById('wishlistSidebar').classList.add('open');
    document.getElementById('wishlistOverlay').classList.add('active');
    updateWishlistUI();
}

function closeWishlist() {
    document.getElementById('wishlistSidebar').classList.remove('open');
    document.getElementById('wishlistOverlay').classList.remove('active');
}

function sendWishlistWA() {
    const wishlist = getWishlist();
    if (wishlist.length === 0) return;
    const user = getCurrentUser();
    const userName = user ? user.name : 'Customer';
    let items = wishlist.map((i, idx) => `${idx + 1}. *${i.name}* — ${i.price}`).join('%0A');
    const msg = `Hello Balaji Digital Ads! 👋%0A%0AMeri Wishlist:%0A${items}%0A%0A*Customer:* ${encodeURIComponent(userName)}%0A%0AIn sab ke baare mein jaankari chahiye.`;
    window.open(`https://wa.me/${WA}?text=${msg}`, '_blank');
}

/* ─── RESTORE WISHLIST STATE ON LOAD ─── */
document.addEventListener('DOMContentLoaded', () => {
    const wishlist = getWishlist();
    wishlist.forEach(item => {
        document.querySelectorAll('.prod-card').forEach(card => {
            if (card.dataset.name === item.name) {
                card.querySelectorAll('.prod-wish-btn').forEach(b => {
                    b.classList.add('wished');
                    b.textContent = '❤️';
                });
            }
        });
    });
    updateWishlistUI();
});

/* getCurrentUser is defined in script.js — products.js uses it */
function getCurrentUser() { try { return JSON.parse(localStorage.getItem('bd_current') || 'null'); } catch { return null; } }
