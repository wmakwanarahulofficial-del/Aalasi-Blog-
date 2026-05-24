import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBsoMdtPkUjve7sQiWaeKurtgYsfh8S0rg",
  authDomain: "aalasi-bloge.firebaseapp.com",
  projectId: "aalasi-bloge",
  storageBucket: "aalasi-bloge.firebasestorage.app",
  messagingSenderId: "482698844148",
  appId: "1:482698844148:web:f459e225bdce12bdb74ba1"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;



export const getAdsConfig = async () => {
  return null;
};

export const getAds = async () => {
  return [];
};

export const getBlogs = async () => {
  return [];
};

export const getBlogBySlug = async () => {
  return null;
};

export const getCategories = async () => {
  return [];
};

export const trackAdEvent = async () => {
  return true;
};
