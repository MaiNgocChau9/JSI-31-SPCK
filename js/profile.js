import { auth } from "./firebase.js";
import { getUser, updateUserInfo } from "../components/users.js";
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
    
    // loadUserBlogs(); // TODO: Thay thế phần lấy bài viết nếu không dùng firestore nữa
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
        console.log("Cập nhật thông tin:", currentUserEmail, updateData);
        await updateUserInfo(currentUserEmail, updateData);
        
        // Cập nhật UI
        updateUI({
            ...updateData,
            email: currentUserEmail
        });
        
        // Ẩn form
        editForm.style.display = "none";
        
        alert("Đã cập nhật thông tin thành công!");
        
    } catch (error) {
        console.error("Lỗi khi cập nhật:", error);
        alert("Có lỗi xảy ra khi cập nhật thông tin!");
    }
});

// Lấy bài viết của user
// TODO: Thay thế phần lấy bài viết nếu không dùng firestore nữa
