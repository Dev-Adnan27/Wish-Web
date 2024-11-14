import { db } from './firebase-config.js';
import { getAllWishes } from './database.js';

const wishesContainer = document.getElementById('wishesContainer');
const wishFilter = document.getElementById('wishFilter');
const searchInput = document.getElementById('searchWishes');
const loadMoreBtn = document.getElementById('loadMore');

let lastVisible = null;
let currentFilter = 'all';
let currentSearch = '';

function createWishCard(wish) {
    return `
        <div class="col-md-4 mb-4">
            <div class="wish-card">
                <div class="d-flex justify-content-between mb-3">
                    <span class="badge bg-primary">${wish.category}</span>
                    <span class="badge ${wish.status === 'pending' ? 'bg-warning' : 'bg-success'}">${wish.status}</span>
                </div>
                <h5 class="card-title mb-3">${wish.wishText}</h5>
                <p class="card-text text-muted small">${wish.wishReason}</p>
                <div class="d-flex justify-content-between align-items-center mt-3">
                    <small class="text-muted">By ${wish.userName}</small>
                    <a href="/pages/fulfill.html?wishId=${wish.id}" class="btn btn-outline-primary btn-sm">
                        Fulfill This Wish
                    </a>
                </div>
            </div>
        </div>
    `;
}

async function loadWishes(filter = 'all', search = '') {
    try {
        wishesContainer.innerHTML = '<div class="text-center w-100"><i class="fas fa-spinner fa-spin fa-2x"></i></div>';
        
        const wishes = await getAllWishes(filter);
        
        // Filter by search term if present
        const filteredWishes = search 
            ? wishes.filter(wish => 
                wish.wishText.toLowerCase().includes(search.toLowerCase()) ||
                wish.wishReason.toLowerCase().includes(search.toLowerCase())
              )
            : wishes;

        if (filteredWishes.length === 0) {
            wishesContainer.innerHTML = `
                <div class="col-12 text-center">
                    <p class="text-muted">No wishes found</p>
                </div>
            `;
            return;
        }

        wishesContainer.innerHTML = filteredWishes
            .map(wish => createWishCard(wish))
            .join('');

    } catch (error) {
        console.error('Error loading wishes:', error);
        wishesContainer.innerHTML = `
            <div class="col-12 text-center">
                <p class="text-danger">Error loading wishes. Please try again later.</p>
            </div>
        `;
    }
}

// Event Listeners
wishFilter.addEventListener('change', (e) => {
    currentFilter = e.target.value;
    loadWishes(currentFilter, currentSearch);
});

searchInput.addEventListener('input', (e) => {
    currentSearch = e.target.value;
    loadWishes(currentFilter, currentSearch);
});

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    loadWishes();
}); 