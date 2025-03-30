import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged, 
    GoogleAuthProvider, 
    signInWithPopup 
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore-lite.js";

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
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const firestore = await getFirestore(firebaseApp);

const loginForm = document.querySelector('#loginForm');
const signupForm = document.querySelector('#registerForm');
const googleLoginBtn = document.querySelector('#google-login-btn');
const logoutBtn = document.querySelector('#logout-btn');
const userEmailDisplay = document.querySelector('#user-email');

//! Xử lý đăng nhập Email/Password
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = getElement('email').value;
        const password = getElement('password').value;
        
        if (!email || !password) {
            alert('Vui lòng nhập đầy đủ thông tin!');
            return;
        }
        
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                window.location.href = './index.html';
            })
            .catch((error) => alert(error.message));
    });
}

//! Xử lý đăng ký Email/Password
if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = getElement('email').value;
        const password = getElement('password').value;
        const confirmPassword = getElement('confirmPassword').value;
        
        if (!email || !password || !confirmPassword) {
            alert('Vui lòng nhập đầy đủ thông tin!');
            return;
        }
        
        if (password !== confirmPassword) {
            alert('Mật khẩu không khớp!');
            return;
        }
        
        createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                alert('Đăng ký thành công!');
                window.location.href = './index.html';
            })
            .catch((error) => alert(error.message));
    });
}

//! Xử lý đăng nhập bằng Google
googleLoginBtn.addEventListener('click', () => {
    signInWithPopup(auth, provider)
        .then(() => {
            window.location.href = '../index.html';
        })
        .catch((error) => alert("Lỗi đăng nhập Google: " + error.message));
});

//! Xử lý đăng xuất
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        signOut(auth)
            .then(() => {
                window.location.href = 'index.html';
            })
            .catch((error) => alert('Lỗi đăng xuất: ' + error.message));
    });
}

//! Kiểm tra trạng thái đăng nhập
onAuthStateChanged(auth, (user) => {
    if (user) {
        if (userEmailDisplay) {
            userEmailDisplay.textContent = user.displayName || user.email;
        }
    } else {
        if (userEmailDisplay) {
            userEmailDisplay.textContent = "Không xác định";
        }
    }
});