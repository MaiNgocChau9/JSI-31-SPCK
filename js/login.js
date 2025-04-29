import { getUser } from "../components/users";

if (!localStorage.getItem("users")) {
  localStorage.setItem("users", JSON.stringify(users));
}

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  const foundUser = getUser(email);
  console.log("Found")
  console.log(foundUser)

  if (foundUser) {
    if (foundUser.password === password) {
      localStorage.setItem("currentUser", JSON.stringify(foundUser));
      alert("Đăng nhập thành công!");
      window.location.href = "../index.html";
    } else {
      alert("Sai thông tin đăng nhập, vui lòng kiểm tra lại!");
      return;
    }
  } else {
    alert("Người dùng không tồn tại trên hệ thống, vui lòng đăng ký!");
    return;
  }
});
