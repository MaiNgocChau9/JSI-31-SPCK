import { getAllBlogs } from "../components/blogs.js";
import { getUser } from "../components/users.js";

function getBlogIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

async function renderBlog() {
  const blogId = getBlogIdFromUrl();
  console.log("Blog ID from URL:", blogId);
  if (!blogId) {
    document.querySelector(".blog-post-content").innerHTML = '<div class="text-danger">Không tìm thấy bài viết!</div>';
    return;
  }
  const blogs = await getAllBlogs();
  console.log("All blogs:", blogs);
  const blog = blogs.find(b => b.id === blogId);
  console.log("Found blog:", blog);
  if (!blog) {
    document.querySelector(".blog-post-content").innerHTML = '<div class="text-danger">Bài viết không tồn tại!</div>';
    return;
  }
  // Lấy thông tin user
  let userInfo = { name: 'Ẩn danh', avatar: 'https://ui-avatars.com/api/?name=User' };
  if (blog.postedBy) {
    const user = await getUser(blog.postedBy);
    console.log("User info:", user);
    if (user) {
      userInfo = {
        name: user.username || user.name || blog.postedBy,
        avatar: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username || user.name || 'User')}`
      };
    }
  }
  // Render nội dung
  document.querySelector(".post-title").textContent = blog.title;
  document.querySelector(".post-meta").innerHTML = `
    <img src="${userInfo.avatar}" alt="avatar" class="rounded-circle me-2" style="width:32px;height:32px;object-fit:cover;"> ${userInfo.name}
    <span class="mx-2">|</span>
    <i class="fas fa-calendar-alt" style="font-size:1.15em;"></i> ${blog.postedAt ? (new Date(blog.postedAt.seconds ? blog.postedAt.seconds*1000 : blog.postedAt)).toLocaleDateString('vi-VN') : ''}
  `;
  document.querySelector(".post-body").innerHTML = blog.content;
}

window.addEventListener("DOMContentLoaded", renderBlog);
