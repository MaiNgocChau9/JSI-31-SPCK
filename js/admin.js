import { getDocs, collection, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore-lite.js";
import { firestore } from "./firebase.js";

// Kiểm tra người dùng có phải admin không, nếu không thì chuyển về trang chủ
const currentUser = JSON.parse(localStorage.getItem("currentUser"))[0];
if (!currentUser || currentUser.role !== "ADMIN") {
  window.location.href = "../index.html";
}

// Theme handling
const themeToggle = document.getElementById("theme-toggle");
const body = document.body;

// Load saved theme from localStorage
const savedTheme = localStorage.getItem("theme") || "light";
body.setAttribute("data-theme", savedTheme);
updateThemeIcon(savedTheme);

// Theme toggle functionality
themeToggle.addEventListener("click", () => {
  const currentTheme = body.getAttribute("data-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";

  body.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
  const lightIcon = document.querySelector(".theme-icon-light");
  const darkIcon = document.querySelector(".theme-icon-dark");

  if (theme === "dark") {
    lightIcon.style.display = "none";
    darkIcon.style.display = "block";
  } else {
    lightIcon.style.display = "block";
    darkIcon.style.display = "none";
  }
}

// User role management
const roleModal = new bootstrap.Modal(document.getElementById("roleModal"));
let selectedUserId = null;
let usersData = [];

// Load and display users from Firestore
async function fetchUsersFromFirestore() {
  const usersCol = collection(firestore, "users");
  const snapshot = await getDocs(usersCol);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

async function displayUsers() {
  usersData = await fetchUsersFromFirestore();
  const tableBody = document.querySelector(".accounts-table tbody");
  const searchInput = document.querySelector(".search-input");

  let filteredUsers = [...usersData];
  const searchTerm = searchInput.value.toLowerCase();
  if (searchTerm) {
    filteredUsers = filteredUsers.filter(
      (user) =>
        (user.username || "").toLowerCase().includes(searchTerm) ||
        (user.email || "").toLowerCase().includes(searchTerm)
    );
  }
  filteredUsers = filteredUsers.filter(user => user.email !== "admin@admin.com");
  tableBody.innerHTML = "";
  filteredUsers.forEach((user) => {
    const row = `
      <tr>
        <td><div class="user-info"><span>${user.username || user.name || "Ẩn danh"}</span></div></td>
        <td>${user.email}</td>
        <td><span class="role-badge role-${(user.role || "user").toLowerCase()}">${user.role || "USER"}</span></td>
        <td>
          <div class="action-btns d-flex flex-wrap justify-content-center gap-2">
            <button class="role-toggle-btn" data-id="${user.id}" title="Chuyển đổi vai trò"><i class="fas fa-exchange-alt"></i>Chuyển vai trò</button>
            <button class="delete-user-btn role-toggle-btn" data-id="${user.id}" title="Xóa người dùng"><i class="fas fa-trash-alt"></i> Xóa</button>
          </div>
        </td>
      </tr>
    `;
    tableBody.insertAdjacentHTML("beforeend", row);
  });
  attachRoleToggleListeners();
}

// Handle role options in modal
const roleOptions = document.querySelectorAll(".role-option");
roleOptions.forEach((option) => {
  option.addEventListener("click", function () {
    roleOptions.forEach((opt) => opt.classList.remove("selected"));
    this.classList.add("selected");
  });
});

// Handle role toggle
function attachRoleToggleListeners() {
  const roleButtons = document.querySelectorAll(".role-toggle-btn");
  roleButtons.forEach((button) => {
    // Chỉ gán sự kiện cho nút chuyển vai trò, không phải nút xóa
    if (!button.classList.contains("delete-user-btn")) {
      button.addEventListener("click", function () {
        selectedUserId = this.dataset.id;
        const user = usersData.find((u) => u.id === selectedUserId);
        roleOptions.forEach((option) => {
          if (option.dataset.role === user.role) {
            option.classList.add("selected");
          } else {
            option.classList.remove("selected");
          }
        });
        roleModal.show();
      });
    }
  });

  // Xử lý xóa người dùng
  const deleteButtons = document.querySelectorAll(".delete-user-btn");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", async function (e) {
      e.stopPropagation();
      const userId = this.dataset.id;
      const user = usersData.find((u) => u.id === userId);
      if (!user) return;
      const confirmEmail = prompt("Nhập lại email của người dùng để xác nhận xóa:");
      if (confirmEmail && confirmEmail.trim().toLowerCase() === (user.email || '').toLowerCase()) {
        await deleteUserFromFirestore(userId);
        await displayUsers();
      } else if (confirmEmail !== null) {
        alert("Email xác nhận không đúng. Không xóa người dùng.");
      }
    });
  });
}

// Handle save role changes
const saveRoleButton = document.getElementById("saveRoleButton");
saveRoleButton.addEventListener("click", async function () {
  const selectedRole = document.querySelector(".role-option.selected");
  if (selectedRole && selectedUserId) {
    const newRole = selectedRole.dataset.role;
    const user = usersData.find((u) => u.id === selectedUserId);
    if (user) {
      // Update Firestore
      await updateDoc(doc(firestore, "users", user.id), { role: newRole });
      // Refresh display and close modal
      await displayUsers();
      roleModal.hide();
    }
  }
});

const userNameSection = document.querySelector(".userNameSection");
const login_register = document.querySelector(".login_register");

if (currentUser && window.innerWidth < 991) {
  userNameSection.textContent = "Đăng xuất";
  userNameSection.classList.remove("d-none");
  login_register.classList.add("d-none");
} else if (currentUser) {
  userNameSection.textContent = `✦ ${currentUser.name} ✦`;
  userNameSection.classList.remove("d-none");
  login_register.classList.add("d-none");
} else {
  userNameSection.textContent = "";
  userNameSection.classList.add("d-none");
  login_register.classList.remove("d-none");
}

userNameSection.addEventListener("click", () => {
  if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
    localStorage.removeItem("currentUser");
    window.location.href = "../index.html";
  }
});

userNameSection.addEventListener("mouseover", () => {
  userNameSection.textContent = "Đăng xuất";
});

userNameSection.addEventListener("mouseout", () => {
  if (currentUser && window.innerWidth > 992) {
    userNameSection.textContent = `✦ ${currentUser.name} ✦`;
  } else if (currentUser) {
    userNameSection.textContent = "Đăng xuất";
  }
});

// Search and filter functionality
document.querySelector(".search-input").addEventListener("input", function() {
  if (!this.value.trim()) {
    displayUsers(); // Nếu rỗng thì load lại tất cả user
  } else {
    displayUsers(); // Vẫn gọi để filter theo input
  }
});

// Initial load
window.addEventListener("DOMContentLoaded", displayUsers);

// Xóa user khỏi Firestore
async function deleteUserFromFirestore(userId) {
  await deleteDoc(doc(firestore, "users", userId));
}
