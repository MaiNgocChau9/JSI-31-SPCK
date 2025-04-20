import { firestore } from "../js/firebase.js";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore-lite.js";

// Hàm tạo object blog
export function Blog({
  title = "",
  content = "",
  description = "",
  postedBy = "",
  postedAt = null,
  thumbnail = "https://images.unsplash.com/photo-1486572788966-cfd3df1f5b42?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  comments = []
} = {}) {
  return {
    title,
    content,
    description,
    postedBy,
    postedAt: postedAt || new Date().toISOString(),
    thumbnail,
    comments,
  };
}

// Hàm lưu blog lên Firestore
export async function addBlog(blogObj) {
  const blogsRef = doc(collection(firestore, "blogs"));
  await setDoc(blogsRef, {
    ...blogObj,
    postedAt: serverTimestamp(),
  });
}

// Hàm lấy tất cả blogs
export async function getAllBlogs() {
  const blogsRef = collection(firestore, "blogs");
  const querySnapshot = await getDocs(blogsRef);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
