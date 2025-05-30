// Sửa tên lịch sử trò chuyện
export async function editHistoryTitle(email, oldTitle, newTitle) {
  const historiesRef = collection(firestore, "history");
  const q = query(historiesRef, where("createdBy", "==", email), where("title", "==", oldTitle));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const docRef = querySnapshot.docs[0].ref;
    await setDoc(docRef, { title: newTitle }, { merge: true });
  }
}

// Xóa lịch sử trò chuyện
export async function deleteHistory(email, title) {
  const historiesRef = collection(firestore, "history");
  const q = query(historiesRef, where("createdBy", "==", email), where("title", "==", title));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const docRef = querySnapshot.docs[0].ref;
    await deleteDoc(docRef); // Use deleteDoc function
  }
}
import { firestore } from "../js/firebase.js";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore-lite.js";

// Hàm tạo object lịch sử trò chuyện
export function History({
  comments = [],
  createdAt = null,
  createdBy = "",
  description = "",
  features = [],
  genres = [],
  image = "",
  imageUrl = "",
  similar_games = [],
  system_requirements = [],
  title = ""
}) {
  return {
    comments,
    createdAt: createdAt || new Date().toISOString(),
    createdBy,
    description,
    features,
    genres,
    image,
    imageUrl,
    similar_games,
    system_requirements,
    title
  };
}

// Hàm lưu lịch sử trò chuyện lên Firestore
export async function addHistory(historyObj) {
  const historiesRef = doc(collection(firestore, "history"));
  await setDoc(historiesRef, {
    ...historyObj,
    createdAt: serverTimestamp(),
  });
}

// Hàm lấy lịch sử theo email người tạo
export async function getHistoriesByUser(email) {
  const historiesRef = collection(firestore, "history");
  const q = query(historiesRef, where("createdBy", "==", email));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data());
}
