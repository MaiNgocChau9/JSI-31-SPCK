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
import Users, { getUser, addUser} from "../components/users.js";

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
export const provider = new GoogleAuthProvider();
export const firestore = await getFirestore(firebaseApp);

const loginForm = document.querySelector('#loginForm');
const signupForm = document.querySelector('#registerForm');
const googleLoginBtn = document.querySelector('#google-login-btn');
const googleSignupBtn = document.querySelector('#google-signup-btn');
const logout = document.querySelector(".logout");
const userEmailDisplay = document.querySelector('#user-email');

//! Xử lý đăng nhập Email/Password
if (loginForm) {
    loginForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        if (!email || !password) {
            alert('Vui lòng nhập đầy đủ thông tin!');
            return;
        }
        
        signInWithEmailAndPassword(auth, email, password)
            .then(async() => {
                // Lưu dữ liệu người dùng vào Firestore
                const user = await getUser(email);
                console.log(user);
                alert('Đăng nhập thành công!');
                window.location.href = '../index.html';
            })
            .catch((error) => alert(error.message));
    });
}

//! Xử lý đăng ký Email/Password
if (signupForm) {
    signupForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (!email || !password || !confirmPassword || !username) {
            alert('Vui lòng nhập đầy đủ thông tin!');
            return;
        }
        
        if (password !== confirmPassword) {
            alert('Mật khẩu không khớp!');
            return;
        }
        
        createUserWithEmailAndPassword(auth, email, password)
            .then(async () => {
                // Lưu dữ liệu người dùng vào Firestore
                const newUser = new Users(username, email);
                await addUser(newUser);
                alert('Đăng ký thành công!');
                
                window.location.href = '../index.html';
            })
            .catch((error) => alert(error.message));
    });
}

//! Xử lý đăng nhập bằng Google
googleLoginBtn?.addEventListener('click', () => {
    signInWithPopup(auth, provider)
        .then(async() => {
            // Lưu dữ liệu người dùng vào Firestore
            const user = await getUser(auth.currentUser.email);
            console.log(user);

            window.location.href = '../index.html';
        })
        .catch((error) => alert("Lỗi đăng nhập Google: " + error.message));
});

//! Xử lý đăng kí bằng Google
googleSignupBtn?.addEventListener('click', () => {
    
    signInWithPopup(auth, provider)
        .then(async () => {
            // Lưu dữ liệu người dùng vào Firestore
            const user = auth.currentUser;
            // console.log(user);
            if(await getUser(user.email)) {
                alert("Người dùng đã tồn tại");
                throw new Error("Người dùng đã tồn tại");
            }
            const newUser = new Users(user.displayName, user.email, "USER", user.photoURL);
            await addUser(newUser);

            window.location.href = '../index.html';
        })
        .catch((error) => alert("Lỗi đăng nhập Google: " + error.message));
});

//! Xử lý đăng xuất
if (logout) {
    logout?.addEventListener('click', () => {
        if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
            signOut(auth)
                .then(() => {
                    localStorage.removeItem("currentUser");
                    window.location.href = './index.html';
                })
                .catch((error) => alert('Lỗi đăng xuất: ' + error.message));
        }
    });
}

//! Kiểm tra trạng thái đăng nhập
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const userData = await getUser(user.email);
        if (userEmailDisplay) {
            userEmailDisplay.textContent = userData?.name || user.email;
        }
        console.log("Current user:", userData);
        localStorage.setItem('currentUser', JSON.stringify([{
            name: userData?.username || user.displayName,
            email: userData?.email || user.email,
            photoURL: userData?.avatar || user.photoURL,
            role: userData?.role || "USER",
        }]));
    } else {
        if (userEmailDisplay) {
            userEmailDisplay.textContent = "Không xác định";
        }
        console.log("No user signed in");
    }
});