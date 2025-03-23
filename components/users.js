// Constructor function
function Users(username, email, role="USER", avatar="https://lh3.googleusercontent.com/a/ACg8ocL7AWd2cGPoUVd66t5RqhuSjf3ZbRcdnR3N0LZlO8SiWgfrY0_U=s347-c-no") {
    this.username = username;
    this.email = email;
    this.role = role;
    this.avatar = avatar;
    // Tạo phương thức (menthod) cho từng đối tượng
    

    // Trả về đối tượng Users sau khi được quy định thuộc tính và phương thức
    return {
        username: this.username,
        email: this.email,
        role: this.role,
        avatar: this.avatar,
    }
}

// Tạo một đối tượng Users
const user1 = new Users("test", "test@gmail.com");
console.log(user1);