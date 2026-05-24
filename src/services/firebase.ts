import {
  signInWithEmailAndPassword
} from "firebase/auth";

import {
  collection,
  getDocs
} from "firebase/firestore";

import { auth, db } from "../firebase.ts";

export async function login(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  return {
    token: await userCredential.user.getIdToken(),
    user: userCredential.user
  };
}

export async function getCategories() {
  const snapshot = await getDocs(collection(db, "categories"));

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}
