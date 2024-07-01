import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { auth } from "./firebaseConfig";

const signup = async (email: string, password: string, name: string) => {
  // Create user with email and password
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Update user profile with the name
  await updateProfile(user, {
    displayName: name
  });

  return user;
};

const login = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

const logout = async () => {
  await signOut(auth);
};

export { signup, login, logout };
