import { getAllBlogs, addComment } from "../components/blogs.js";
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
  // Render thumbnail
  const thumbnailImgElement = document.getElementById("post-thumbnail-img");
  if (blog.thumbnail && blog.thumbnail.trim() !== "") { // Changed to blog.thumbnail
    thumbnailImgElement.src = blog.thumbnail; // Changed to blog.thumbnail
    thumbnailImgElement.style.display = "block"; // Show the image
  } else {
    thumbnailImgElement.style.display = "none"; // Hide if no thumbnail
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

const submit_comment = document.querySelector("#submit-comment");
const comment_input = document.querySelector("#comment-content");
const comment_list = document.querySelector("#comments-list");

submit_comment.addEventListener("click", async function () {
  const blogId = getBlogIdFromUrl();
  const commentText = comment_input.value.trim();
  if (!commentText) {
    alert("Vui lòng nhập bình luận!");
    return;
  }
  const user = JSON.parse(localStorage.getItem("currentUser"))[0];
  if (!user) {
    alert("Vui lòng đăng nhập để bình luận!");
    return;
  }
  const comment = {
    content: commentText,
    postedAt: new Date().toISOString(),
    user: user.email,
  };
  await addComment(blogId, comment);
  comment_input.value = "";
  renderComments();
});

async function renderComments() {
  const blogId = getBlogIdFromUrl();
  const blogs = await getAllBlogs();
  const blog = blogs.find(b => b.id === blogId);
  if (!blog || !blog.comments) {
    comment_list.innerHTML = '<div class="text-danger">Không có bình luận nào!</div>';
    return;
  }
  comment_list.innerHTML = "";
  comment_list.className = "comment-list";
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))?.[0];
  for (let i = 0; i < blog.comments.length; i++) {
    const comment = blog.comments[i];
    const li = document.createElement("li");
    li.className = "comment-item";
    const user = await getUser(comment.user);
    let actionBtns = "";
    if (currentUser && currentUser.email === comment.user) {
      actionBtns = `
        <button class="btn btn-edit-comment" data-index="${i}" title="Sửa bình luận">
          <i class="fas fa-pen"></i>
        </button>
        <button class="btn btn-delete-comment" data-index="${i}" title="Xóa bình luận">
          <i class="fas fa-trash"></i>
        </button>
      `;
    }
    li.innerHTML = `
      <img src="${user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || comment.user)}`}" alt="avatar" class="comment-avatar">
      <div class="comment-content">
        <div>
          <span class="comment-author">${user?.name || comment.user}</span>
          <span class="comment-date">${new Date(comment.postedAt).toLocaleDateString('vi-VN')}</span>
        </div>
        <div class="comment-text" data-index="${i}">${comment.content}</div>
        <div class="comment-actions">${actionBtns}</div>
      </div>
    `;
    comment_list.appendChild(li);
  }

  // Gán sự kiện cho nút Sửa/Xóa
  comment_list.querySelectorAll('.btn-edit-comment').forEach(btn => {
    btn.addEventListener('click', async function() {
      const idx = parseInt(this.dataset.index);
      const commentTextDiv = comment_list.querySelector(`.comment-text[data-index='${idx}']`);
      const oldContent = commentTextDiv.textContent;
      const newContent = prompt('Chỉnh sửa bình luận:', oldContent);
      if (newContent !== null && newContent.trim() !== '' && newContent !== oldContent) {
        const { editComment } = await import('../components/blogs.js');
        await editComment(blogId, idx, newContent.trim());
        renderComments();
      }
    });
  });
  comment_list.querySelectorAll('.btn-delete-comment').forEach(btn => {
    btn.addEventListener('click', async function() {
      const idx = parseInt(this.dataset.index);
      if (confirm('Bạn có chắc chắn muốn xóa bình luận này?')) {
        const { deleteComment } = await import('../components/blogs.js');
        await deleteComment(blogId, idx);
        renderComments();
      }
    });
  });
}

renderComments();
