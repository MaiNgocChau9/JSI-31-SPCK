import { auth, firestore } from "./firebase.js";
import { getUser } from "../components/users.js";
import { collection, query, where, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

// DOM elements
const avatarImg = document.getElementById("profile-avatar");
const displayName = document.getElementById("display-name");
const displayUsername = document.getElementById("display-username");
const displayIntro = document.getElementById("display-intro");
const editForm = document.getElementById("profile-edit-form");
const avatarUrlInput = document.getElementById("avatar-url");
const nameInput = document.getElementById("profile-name-input");
const introInput = document.getElementById("profile-intro-input");
const editBtn = document.getElementById("edit-profile-btn");
const cancelBtn = document.getElementById("cancel-edit-btn");
const blogList = document.getElementById("blog-list");

let currentUserEmail = null;
let userDocId = null;

// Hiển thị/ẩn form chỉnh sửa
editBtn.addEventListener("click", () => {
    editForm.style.display = "block";
});

cancelBtn.addEventListener("click", () => {
    editForm.style.display = "none";
});

// Lấy thông tin user hiện tại
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "login.html";
        return;
    }
    
    currentUserEmail = user.email;
    const userDoc = await getUser(currentUserEmail);
    
    if (userDoc) {
        userDocId = userDoc.id; // Lưu lại id để dùng cho update
        updateUI(userDoc); // Cập nhật UI với thông tin user
    }
    
    loadUserBlogs();
});

// Hàm cập nhật UI từ data user
function updateUI(userData) {
    console.log("User data:", userData);
    avatarImg.src = userData.avatar || "https://www.svgrepo.com/show/384674/account-avatar-profile-user-11.svg";
    displayName.textContent = userData.username || userData.name || "Chưa đặt tên";
    displayUsername.textContent = currentUserEmail;
    displayIntro.textContent = userData.intro || "Chưa có giới thiệu...";
    
    // Cập nhật form
    avatarUrlInput.value = userData.avatar || "";
    nameInput.value = userData.username || userData.name || "";
    introInput.value = userData.intro || "";
}

// Xử lý form chỉnh sửa
editForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const updateData = {
        avatar: avatarUrlInput.value.trim(),
        username: nameInput.value.trim(),
        intro: introInput.value.trim()
    };
    
    try {
        const userRef = doc(firestore, "users", userDocId);
        await updateDoc(userRef, updateData);
        
        // Cập nhật UI
        updateUI({
            ...updateData,
            email: currentUserEmail
        });
        
        // Ẩn form
        editForm.style.display = "none";
        
        // Cập nhật localStorage để sync với updateUserElement.js
        let currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
        if (Array.isArray(currentUser)) {
            currentUser[0] = { ...currentUser[0], ...updateData };
        } else {
            currentUser = { ...currentUser, ...updateData };
        }
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        
        alert("Đã cập nhật thông tin thành công!");
        
    } catch (error) {
        console.error("Lỗi khi cập nhật:", error);
        alert("Có lỗi xảy ra khi cập nhật thông tin!");
    }
});

// Lấy bài viết của user
async function loadUserBlogs() {
    blogList.innerHTML = '<div class="text-center mt-4">Đang tải...</div>';
    
    try {
        const blogsRef = collection(firestore, "blogs");
        const q = query(blogsRef, where("postedBy", "==", currentUserEmail));
        const snap = await getDocs(q);
        
        if (snap.empty) {
            blogList.innerHTML = '<div class="text-center mt-4">Bạn chưa có bài viết nào.</div>';
            return;
        }
        
        blogList.innerHTML = "";
        snap.forEach(doc => {
            const blog = doc.data();
            const card = document.createElement("div");
            card.className = "profile-post-card";
            
            // Check if blog.createdAt exists and is a valid timestamp
            const createdAt = blog.createdAt?.toDate?.() || new Date();
            
            card.innerHTML = `
                <img class="profile-post-thumb" src="${blog.thumbnail || 'https://placehold.co/600x400?text=Game+Mood'}" alt="${blog.title}">
                <div class="profile-post-content">
                    <h3 class="profile-post-title">${blog.title || "Không có tiêu đề"}</h3>
                    <p class="profile-post-intro">${blog.intro?.slice(0, 150) || blog.content?.slice(0, 150) || ""}...</p>
                    <div class="profile-post-meta">
                        <i class="fas fa-calendar-alt"></i> ${createdAt.toLocaleDateString("vi-VN")}
                    </div>
                </div>
            `;
            
            card.addEventListener("click", () => {
                window.location.href = `view-blog.html?id=${doc.id}`;
            });
            
            blogList.appendChild(card);
        });
        
    } catch (error) {
        console.error("Lỗi khi tải bài viết:", error);
        blogList.innerHTML = '<div class="text-center mt-4">Có lỗi xảy ra khi tải bài viết.</div>';
    }
}
