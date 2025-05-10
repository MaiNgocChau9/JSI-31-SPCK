// Sửa bình luận
export async function editComment(blogId, commentIndex, newContent) {
  const blogRef = doc(firestore, "blogs", blogId);
  const blogDoc = await getDoc(blogRef);
  if (blogDoc.exists()) {
    const blogData = blogDoc.data();
    const comments = blogData.comments || [];
    if (comments[commentIndex]) {
      comments[commentIndex].content = newContent;
      comments[commentIndex].editedAt = new Date().toISOString();
      await setDoc(blogRef, { comments }, { merge: true });
    }
  }
}

// Xóa bình luận
export async function deleteComment(blogId, commentIndex) {
  const blogRef = doc(firestore, "blogs", blogId);
  const blogDoc = await getDoc(blogRef);
  if (blogDoc.exists()) {
    const blogData = blogDoc.data();
    const comments = blogData.comments || [];
    if (comments[commentIndex]) {
      comments.splice(commentIndex, 1);
      await setDoc(blogRef, { comments }, { merge: true });
    }
  }
}
import { firestore } from "../js/firebase.js";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
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
  thumbnail = "", // Reverted to thumbnail, default to empty string
  comments = []
} = {}) {
  return {
    title,
    content,
    description,
    postedBy,
    postedAt: postedAt || new Date().toISOString(),
    thumbnail, // Reverted to thumbnail
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

// Hàm lấy danh sách bài viết của người dùng theo email
export async function getBlogsByEmail(email) {
  const blogsRef = collection(firestore, "blogs");
  const q = query(blogsRef, where("postedBy", "==", email));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Hàm đăng comments
export async function addComment(blogId, comment) {
  const blogRef = doc(firestore, "blogs", blogId);
  const blogDoc = await getDoc(blogRef);
  if (blogDoc.exists()) {
    const blogData = blogDoc.data();
    const comments = blogData.comments || [];
    comments.push(comment);
    await setDoc(blogRef, { comments }, { merge: true });
  } else {
    console.log("No such document!");
  }
}
