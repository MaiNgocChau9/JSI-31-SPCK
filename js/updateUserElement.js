const userNameSection = document.querySelector(".userNameSection");
const login_register = document.querySelector(".login_register");
const currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;
console.log(currentUser);

if (currentUser && window.innerWidth < 991){
    userNameSection.textContent = "Đăng xuất";
    userNameSection.classList.remove("d-none");
    login_register.classList.add("d-none");
}

else if (currentUser) {
    userNameSection.textContent = `✦ ${currentUser[0].name} ✦`;
    userNameSection.classList.remove("d-none");
    login_register.classList.add("d-none");
}

else {
    userNameSection.textContent = "";
    userNameSection.classList.add("d-none");
    login_register.classList.remove("d-none");
}

userNameSection.addEventListener('mouseover', () => {
    userNameSection.textContent = 'Đăng xuất';
});

userNameSection.addEventListener('mouseout', () => {
    if (currentUser && window.innerWidth > 992) {
        userNameSection.textContent = `✦ ${currentUser[0].name} ✦`;
    } else if(currentUser) {
        userNameSection.textContent = "Đăng xuất";
    }
});

// Thêm nút Quản trị viên nếu là admin
if (currentUser && ((Array.isArray(currentUser) && currentUser[0]?.role === "ADMIN") || currentUser.role === "ADMIN")) {
    // Kiểm tra đã có chưa, tránh thêm trùng
    if (!document.querySelector('.admin-nav-link')) {
        const adminBtn = document.createElement('a');
        adminBtn.className = 'nav-link admin-nav-link';
        adminBtn.textContent = 'Quản trị viên';
        // Xác định đường dẫn phù hợp
        const isIndex = window.location.pathname.endsWith('/index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/');
        adminBtn.href = isIndex ? './html/admin.html' : './admin.html';
        // Thêm vào navbar trước userNameSection
        const nav = document.querySelector('.navbar-nav');
        const userLi = document.querySelector('.userNameSection')?.closest('li');
        if (nav && userLi) {
            const li = document.createElement('li');
            li.className = 'nav-item';
            li.appendChild(adminBtn);
            nav.insertBefore(li, userLi);
        } else if (nav) {
            // Nếu không tìm thấy userNameSection thì thêm vào cuối
            const li = document.createElement('li');
            li.className = 'nav-item';
            li.appendChild(adminBtn);
            nav.appendChild(li);
        }
    }
}