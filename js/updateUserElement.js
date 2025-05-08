import { getUser } from "../components/users.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { 
    getAuth, 
    signOut, 
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyA8huygjO3NPAq3v42nGpbw9WiroQ3hWDs",
    authDomain: "jsi-31.firebaseapp.com",
    databaseURL: "https://jsi-31-default-rtdb.firebaseio.com",
    projectId: "jsi-31",
    storageBucket: "jsi-31.firebasestorage.app",
    messagingSenderId: "320863785460",
    appId: "1:320863785460:web:3150be47b8b9d70607a9a1",
    measurementId: "G-2VNGMVYMME"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);

const userNameSection = document.querySelector(".userNameSection");
const login_register = document.querySelector(".login_register");
const currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;
console.log(currentUser);

async function createUserMenu(currentUser) {
    userNameSection?.innerHTML = '';
    userNameSection?.classList.remove('d-none');
    login_register?.classList.add('d-none');

    // Lấy thông tin user từ Firestore để lấy avatar mới nhất
    let email = Array.isArray(currentUser) ? currentUser[0]?.email : currentUser.email;
    let userInfo = await getUser(email);
    let avatarUrl = userInfo?.avatar || (Array.isArray(currentUser) ? currentUser[0]?.avatar : currentUser.avatar) || 'https://www.svgrepo.com/show/384674/account-avatar-profile-user-11.svg';

    // Tạo avatar
    const avatar = document.createElement('img');
    avatar.className = 'user-avatar';
    avatar.style.width = '40px';
    avatar.style.height = '40px';
    avatar.style.borderRadius = '50%';
    avatar.style.objectFit = 'cover';
    avatar.style.cursor = 'pointer';
    avatar.style.border = '2px solid var(--primary)';
    avatar.style.boxShadow = 'none';
    avatar.style.backgroundColor = 'var(--background)';
    avatar.style.transition = 'box-shadow 0.2s, border-color 0.2s, background 0.2s';
    avatar.alt = 'avatar';
    avatar.src = avatarUrl;

    avatar.addEventListener('mouseenter', () => {
        avatar.style.boxShadow = '0 2px 8px 0 var(--primary)';
        avatar.style.borderColor = 'var(--accent)';
    });
    avatar.addEventListener('mouseleave', () => {
        avatar.style.boxShadow = 'none';
        avatar.style.borderColor = 'var(--primary)';
    });

    // Tạo menu dropdown
    const menu = document.createElement('div');
    menu.className = 'user-menu-dropdown';
    menu.style.position = 'absolute';
    menu.style.top = '48px';
    menu.style.right = '0';
    menu.style.backgroundColor = 'var(--background)';
    menu.style.border = '1.5px solid var(--secondary)';
    menu.style.borderRadius = '12px';
    menu.style.boxShadow = '0 8px 32px rgba(80,120,200,0.18)';
    menu.style.display = 'none';
    menu.style.minWidth = '200px';
    menu.style.zIndex = '1000';
    menu.style.overflow = 'hidden';
    menu.style.padding = '8px 0';

    // Quản lý tài khoản
    const manageAccount = document.createElement('a');
    manageAccount.href = '#';
    manageAccount.textContent = 'Quản lý tài khoản';
    manageAccount.style.display = 'block';
    manageAccount.style.padding = '12px 24px';
    manageAccount.style.color = 'var(--text)';
    manageAccount.style.textDecoration = 'none';
    manageAccount.style.fontWeight = '500';
    manageAccount.style.fontSize = '16px';
    manageAccount.style.transition = 'background 0.15s';
    manageAccount.addEventListener('mouseenter', () => {
        manageAccount.style.backgroundColor = 'rgba(223, 206, 150, 0.1)';
    });
    manageAccount.addEventListener('mouseleave', () => {
        manageAccount.style.backgroundColor = 'transparent';
    });
    manageAccount.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = './html/profile.html';
    });
    menu.appendChild(manageAccount);

    // Nếu là admin thì thêm mục Quản trị viên
    if ((Array.isArray(currentUser) && currentUser[0]?.role === 'ADMIN') || currentUser.role === 'ADMIN') {
        const adminLink = document.createElement('a');
        adminLink.href = window.location.pathname.endsWith('/index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/') ? './html/admin.html' : './admin.html';
        adminLink.textContent = 'Quản trị viên';
        adminLink.style.display = 'block';
        adminLink.style.padding = '12px 24px';
        adminLink.style.color = 'var(--text)';
        adminLink.style.textDecoration = 'none';
        adminLink.style.fontWeight = '500';
        adminLink.style.fontSize = '16px';
        adminLink.style.transition = 'background 0.15s';
        adminLink.addEventListener('mouseenter', () => {
            adminLink.style.backgroundColor = 'rgba(223, 206, 150, 0.1)';
        });
        adminLink.addEventListener('mouseleave', () => {
            adminLink.style.backgroundColor = 'transparent';
        });
        adminLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = window.location.pathname.endsWith('/index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/') ? './html/admin.html' : './admin.html';
        });
        menu.appendChild(adminLink);
    }

    // Đăng xuất
    const logout = document.createElement('a');
    logout.href = '#';
    logout.className = 'logout';
    logout.textContent = 'Đăng xuất';
    logout.style.display = 'block';
    logout.style.padding = '12px 24px';
    logout.style.color = 'var(--danger, #e74c3c)';
    logout.style.textDecoration = 'none';
    logout.style.fontWeight = '500';
    logout.style.fontSize = '16px';
    logout.style.transition = 'background 0.15s';
    logout.addEventListener('mouseenter', () => {
        logout.style.backgroundColor = 'rgba(231, 76, 60, 0.05)';
    });
    logout.addEventListener('mouseleave', () => {
        logout.style.backgroundColor = 'transparent';
    });
    logout.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('currentUser');
        signOut(auth);
        window.location.reload();
    });
    menu.appendChild(logout);

    // Thêm avatar và menu vào userNameSection
    userNameSection.style.position = 'relative';
    userNameSection?.appendChild(avatar);
    userNameSection?.appendChild(menu);

    // Sự kiện click avatar để hiện/ẩn menu
    avatar.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    });
    // Ẩn menu khi click ra ngoài
    document.addEventListener('click', (e) => {
        if (!userNameSection?.contains(e.target)) {
            menu.style.display = 'none';
        }
    });
}

if (currentUser) {
    createUserMenu(currentUser);
} else {
    userNameSection?.textContent = '';
    userNameSection?.classList.add('d-none');
    login_register?.classList.remove('d-none');
}

// Xóa border, màu và hiệu ứng hover của .userNameSection để không bị viền vàng hoặc hiệu ứng từ CSS cũ
userNameSection?.style.border = 'none';
userNameSection?.style.color = '';
userNameSection?.style.background = 'transparent';
userNameSection?.style.padding = '0';
userNameSection?.style.transition = 'none';
userNameSection?.onmouseenter = null;
userNameSection?.onmouseleave = null;