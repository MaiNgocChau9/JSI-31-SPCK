import { firestore } from "../js/firebase.js";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
  query,
  serverTimestamp,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore-lite.js";

function Blogs(
  id,
  comments = [],
  createdAt,
  createdBy,
  description,
  postedAt,
  postedBy,
  thumbnail,
  title,
  content
) {
  this.comments = comments;
  this.createdAt = createdAt;
  this.createdBy = createdBy;
  this.description = description;
  this.postedAt = postedAt;
  this.postedBy = postedBy;
  this.thumbnail = thumbnail;
  this.title = title;
  this.content = content;

  function addComment(comment, createdAt, createdBy) {
    this.comments.push({
      comment: comment,
      createdAt: new Date(),
      createdBy: this.postedBy,
    });
    updateBlog();
  }
  function updateBlog() {
    const blogsRef = collection(firestore, "blogs");
    setDoc(doc(blogsRef), {
      comments: this.comments,
      createdAt: this.createdAt,
      createdBy: this.createdBy,
      description: this.description,
      postedAt: this.postedAt,
      postedBy: this.postedBy,
      thumbnail: this.thumbnail,
      title: this.title,
      content: this.content,
    });
  }

  async function deleteBlog() {
    const docRef = doc(firestore, "blogs", id);
    await deleteDoc(docRef);
  }

  async function getBlogList() {
    const q = await query(collection(firestore, "blogs"));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // list.push(doc);
    });
  }

  return {
    comments: this.comments,
    createdAt: this.createdAt,
    createdBy: this.createdBy,
    description: this.description,
    postedAt: this.postedAt,
    postedBy: this.postedBy,
    thumbnail: this.thumbnail,
    title: this.title,
    content: this.content,
  };
}
