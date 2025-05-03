import { firestore } from "../js/firebase.js";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
  query,
  serverTimestamp,
  where,
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore-lite.js";

export default function User(
  username,
  email,
  role = "USER",
  avatar = "https://..."
) {
  this.username = username;
  this.email = email;
  this.role = role;
  this.avatar = avatar;
  return {
    username: this.username,
    email: this.email,
    role: this.role,
    avatar: this.avatar,
  };
}

// Async method on the class prototype
export async function addUser(user) {
  const postsRef = doc(collection(firestore, "users"));
  await setDoc(postsRef, {
    username: user.username,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
  });
}

export async function getUser(email) {
  const usersRef = collection(firestore, "users");
  const q = query(usersRef, where("email", "==", email));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    // Assuming email is unique and you want the first match
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  } else {
    return null; // No user found
  }
}

// export async function editUser(email, newData) {
//   const usersRef = collection(firestore, "users");
//   const q = query(usersRef, where("email", "==", email));
//   const querySnapshot = await getDocs(q);

//   if (!querySnapshot.empty) {
//     // Assuming email is unique and you want the first match
//     const doc = querySnapshot.docs[0];
//     const userRef = doc(firestore, "users", doc.id);
//     await setDoc(userRef, newData, { merge: true });
//   } else {
//     return null; // No user found
//   }
// }