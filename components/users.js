import { firestore } from "../js/firebase.js";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  setDoc,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore-lite.js";

export default function User(
  username,
  email,
  role = "USER",
  avatar = "https://raw.githubusercontent.com/MaiNgocChau9/JSI-31-SPCK/refs/heads/main/default_avatar.png"
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

export async function updateUserInfo(email, data) {
  try {
    const usersRef = collection(firestore, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.error("Không tìm thấy người dùng với email:", email);
      return false;
    }
    
    // Giả sử chỉ có 1 document phù hợp
    const userDoc = querySnapshot.docs[0];
    const userRef = doc(firestore, "users", userDoc.id);
    await updateDoc(userRef, data);
    return true;
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin người dùng:", error);
    return false;
  }
}