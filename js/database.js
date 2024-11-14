import { db } from './firebase-config.js';
import { 
    collection, 
    addDoc, 
    getDocs, 
    query, 
    where, 
    orderBy, 
    limit,
    startAfter 
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Add a new wish to the database
export async function addWish(wishData) {
    try {
        const docRef = await addDoc(collection(db, "wishes"), {
            ...wishData,
            createdAt: new Date(),
            status: 'pending'
        });
        return docRef.id;
    } catch (error) {
        console.error("Error adding wish: ", error);
        throw error;
    }
}

// Get featured wishes
export async function getFeaturedWishes() {
    try {
        const q = query(
            collection(db, "wishes"),
            where("status", "==", "pending"),
            orderBy("createdAt", "desc"),
            limit(3)
        );
        
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate()
        }));
    } catch (error) {
        console.error("Error getting featured wishes: ", error);
        throw error;
    }
}

// Submit a fulfillment request
export async function submitFulfillment(fulfillmentData) {
    try {
        const docRef = await addDoc(collection(db, "fulfillments"), {
            ...fulfillmentData,
            createdAt: new Date(),
            status: 'pending'
        });
        return docRef.id;
    } catch (error) {
        console.error("Error submitting fulfillment: ", error);
        throw error;
    }
}

// Get all wishes with optional filtering
export async function getAllWishes(filter = 'all', lastDoc = null, itemsPerPage = 9) {
    try {
        let q = collection(db, "wishes");
        
        // Create a basic query
        if (filter === 'recent') {
            // Calculate date 24 hours ago
            const oneDayAgo = new Date();
            oneDayAgo.setDate(oneDayAgo.getDate() - 1);
            
            q = query(q, 
                where("createdAt", ">=", oneDayAgo),
                orderBy("createdAt", "desc")
            );
        } else if (filter !== 'all') {
            q = query(q, 
                where("status", "==", filter),
                orderBy("createdAt", "desc")
            );
        } else {
            q = query(q, orderBy("createdAt", "desc"));
        }
        
        // Apply pagination if lastDoc is provided
        if (lastDoc) {
            q = query(q, startAfter(lastDoc), limit(itemsPerPage));
        } else {
            q = query(q, limit(itemsPerPage));
        }
        
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate()
        }));
    } catch (error) {
        console.error("Error getting wishes: ", error);
        throw error;
    }
} 