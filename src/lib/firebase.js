import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Firestore helper functions
export const addCase = async (caseData) => {
  try {
    const docRef = await addDoc(collection(db, 'cases'), caseData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding case:', error);
    throw error;
  }
};

export const getCases = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'cases'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting cases:', error);
    throw error;
  }
};

export const updateCase = async (caseId, updates) => {
  try {
    const caseRef = doc(db, 'cases', caseId);
    await updateDoc(caseRef, updates);
  } catch (error) {
    console.error('Error updating case:', error);
    throw error;
  }
};

// Auth helper functions
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};