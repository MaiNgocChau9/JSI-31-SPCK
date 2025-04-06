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
    return querySnapshot.docs[0].data();
  } else {
    return null; // No user found
  }
}

// // Constructor function
// export default function Users(
//   username,
//   email,
//   role = "USER",
//   avatar = "https://lh3.googleusercontent.com/a/ACg8ocL7AWd2cGPoUVd66t5RqhuSjf3ZbRcdnR3N0LZlO8SiWgfrY0_U=s347-c-no"
// ) {
//   this.username = username;
//   this.email = email;
//   this.role = role;
//   this.avatar = avatar;

//   // Tạo phương thức (menthod) cho từng đối tượng
//   async function addUser() {
//     const postsRef = collection(firestore, "users");
//     await setDoc(doc(postsRef), {
//       username: this.username,
//       email: this.email,
//       role: this.role,
//       avatar: this.avatar,
//     });
//   }

//   async function getUser(uid) {
//     // get doc from firestore
//     const docRef = doc(firestore, "users", uid);
//     const docSnap = await getDoc(docRef);

//     if (docSnap.exists()) {
//       // declare some var for current post
//       this.username = docSnap.data().username;
//       this.email = docSnap.data().email;
//       this.avatar = docSnap.data().avatar;
//       this.role = docSnap.data().role;
//     } else {
//       // docSnap.data() will be undefined in this case
//       console.log("No such document!");
//     }
//   }

//   // Trả về đối tượng Users sau khi được quy định thuộc tính và phương thức
//   return {
//     username: this.username,
//     email: this.email,
//     role: this.role,
//     avatar: this.avatar,
//     addUser: addUser,
//   };

// }
