import { db } from './firebase-config.js';
import { submitFulfillment } from './database.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Get wish ID from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const wishId = urlParams.get('wishId');

// Get form element
const fulfillForm = document.getElementById('fulfillForm');

// Handle form submission
fulfillForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitButton = e.target.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Submitting...';

    const fulfillmentData = {
        wishId: wishId,
        fulfillerName: document.getElementById('fulfillerName').value,
        fulfillerEmail: document.getElementById('fulfillerEmail').value,
        message: document.getElementById('message').value,
        createdAt: new Date(),
        status: 'pending'
    };

    try {
        await submitFulfillment(fulfillmentData);
        alert('Thank you! Your fulfillment request has been submitted.');
        window.location.href = '/pages/wishes.html';
    } catch (error) {
        console.error('Error submitting fulfillment:', error);
        alert('There was an error submitting your request. Please try again.');
    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = 'Submit Request';
    }
});

// Load wish details if wishId is present
async function loadWishDetails() {
    if (!wishId) {
        window.location.href = '/pages/wishes.html';
        return;
    }

    try {
        // Updated to use the new Firestore syntax
        const wishDocRef = doc(db, 'wishes', wishId);
        const wishDoc = await getDoc(wishDocRef);
        
        if (!wishDoc.exists()) {
            alert('Wish not found!');
            window.location.href = '/pages/wishes.html';
            return;
        }

        const wishData = wishDoc.data();
        document.getElementById('wishDetails').innerHTML = `
            <div class="wish-card mb-4">
                <div class="d-flex justify-content-between mb-3">
                    <span class="badge bg-primary">${wishData.category}</span>
                </div>
                <h5 class="card-title mb-3">${wishData.wishText}</h5>
                <p class="card-text text-muted small">${wishData.wishReason}</p>
                <div class="mt-3">
                    <small class="text-muted">Posted by ${wishData.userName}</small>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error loading wish details:', error);
        alert('Error loading wish details. Please try again.');
    }
}

// Load wish details when page loads
document.addEventListener('DOMContentLoaded', loadWishDetails); 