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