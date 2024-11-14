import { db } from '../js/firebase-config.js';
import { addWish } from '../js/database.js';

document.getElementById('wishForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitButton = e.target.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Submitting...';
    
    const wishData = {
        userName: document.getElementById('userName').value,
        userEmail: document.getElementById('userEmail').value,
        category: document.getElementById('wishCategory').value,
        wishText: document.getElementById('wishText').value,
        wishReason: document.getElementById('wishReason').value,
        createdAt: new Date(),
        status: 'pending'
    };

    try {
        await addWish(wishData);
        alert('Your wish has been submitted successfully!');
        window.location.href = '/pages/wishes.html';
    } catch (error) {
        console.error('Error submitting wish:', error);
        alert('There was an error submitting your wish. Please try again.');
        submitButton.disabled = false;
        submitButton.innerHTML = 'Share Your Wish';
    }
}); 