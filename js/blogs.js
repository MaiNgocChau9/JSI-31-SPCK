import { getAllBlogs } from "../components/blogs.js";
import { getUser } from "../components/users.js";

window.addEventListener("DOMContentLoaded", async () => {
  const row = document.querySelector(".row.g-4");
  if (!row) return;
  row.innerHTML = "<div class='text-center'>Đang tải bài viết...</div>";
  try {
    const blogs = await getAllBlogs();
    // Lấy tên người dùng cho từng bài viết
    const userCache = {};
    async function getUserName(email) {
      if (!email) return 'Ẩn danh';
      if (userCache[email]) return userCache[email];
      const user = await getUser(email);
      const name = user?.username || user?.name || email;
      userCache[email] = name;
      return name;
    }
    // Duyệt qua từng blog và lấy tên
    const blogCards = await Promise.all(blogs.map(async (blog, idx) => {
      const name = await getUserName(blog.postedBy);
      return `
      <div class="col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="${100 + idx*100}">
        <div class="blog-card">
          <div class="blog-thumbnail">
            <img src="${blog.thumbnail || ''}" alt="Thumbnail">
          </div>
          <div class="blog-card-body">
            <h3 class="blog-title">${blog.title}</h3>
            <p class="blog-meta">
              <i class="fas fa-user"></i> ${name} <span class="mx-2">|</span> <i class="fas fa-calendar-alt"></i> ${blog.postedAt ? (new Date(blog.postedAt.seconds ? blog.postedAt.seconds*1000 : blog.postedAt)).toLocaleDateString('vi-VN') : ''}
            </p>
            <p class="description">${blog.description || ''}</p>
            <a href="./view-blog.html?id=${blog.id}" class="btn read-more-btn">Đọc thêm <i class="fas fa-arrow-right"></i></a>
          </div>
        </div>
      </div>
      `;
    }));
    row.innerHTML = blogCards.join("");
    if (window.AOS) {
      AOS.init({
        duration: 800,
        once: true,
        offset: 100
      });
    }
  } catch (e) {
    row.innerHTML = `<div class='text-danger'>Lỗi tải bài viết: ${e.message}</div>`;
  }
});
