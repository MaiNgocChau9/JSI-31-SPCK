import { getAllBlogs } from "../components/blogs.js";
import { getUser } from "../components/users.js";

window.addEventListener("DOMContentLoaded", async () => {
    const row = document.querySelector(".row.g-4");
    if (!row) return;
    row.innerHTML = "<div class='text-center'>Đang tải bài viết...</div>";

    let allBlogs = [];
    try {
        allBlogs = await getAllBlogs();
        // Tạo cache người dùng dùng chung
        const userCache = {};
        async function getUserInfo(email) {
            if (!email)
                return { name: "Ẩn danh", avatar: "https://ui-avatars.com/api/?name=User" };
            if (userCache[email]) return userCache[email];
            const user = await getUser(email);
            const name = user?.username || user?.name || email;
            const avatar =
                user?.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`;
            userCache[email] = { name, avatar };
            return { name, avatar };
        }

        // Hàm tạo giao diện từ danh sách bài viết
        async function createBlogCards(blogs) {
            const cards = await Promise.all(
                blogs.map(async (blog, idx) => {
                    const { name, avatar } = await getUserInfo(blog.postedBy);
                    return `
          <div class="col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="${100 + idx * 100}">
            <div class="blog-card">
              <div class="blog-thumbnail">
                <img src="${blog.thumbnail || ''}" alt="Thumbnail">
              </div>
              <div class="blog-card-body">
                <h3 class="blog-title">${blog.title}</h3>
                <p class="blog-meta d-flex align-items-center">
                  <img src="${avatar}" alt="avatar" class="rounded-circle me-2" style="width:32px;height:32px;object-fit:cover;"> ${name} <span class="mx-2">|</span> <i class="fas fa-calendar-alt" style="font-size:1.15em;"></i> ${
                        blog.postedAt
                            ? (new Date(
                                  blog.postedAt.seconds ? blog.postedAt.seconds * 1000 : blog.postedAt
                              )).toLocaleDateString("vi-VN")
                            : ""
                    }
                </p>
                <p class="description">${blog.description || ''}</p>
                <a href="./view-blog.html?id=${blog.id}" class="btn read-more-btn">Đọc thêm <i class="fas fa-arrow-right"></i></a>
              </div>
            </div>
          </div>
          `;
                })
            );
            return cards.join("");
        }

        // Hiển thị danh sách bài viết ban đầu
        row.innerHTML = await createBlogCards(allBlogs);
        if (window.AOS) {
            AOS.init({
                duration: 800,
                once: true,
                offset: 100,
            });
        }

        // Xử lý tìm kiếm
        const searchForm = document.getElementById("blog-search-form");
        const searchInput = document.getElementById("blog-search-input");
        if (searchForm && searchInput) {
            searchForm.addEventListener("submit", async function (e) {
                e.preventDefault();
                const keyword = searchInput.value.trim().toLowerCase();
                if (!keyword) {
                    row.innerHTML = await createBlogCards(allBlogs);
                    if (window.AOS) AOS.refresh();
                    return;
                }
                const filtered = allBlogs.filter(
                    (blog) =>
                        (blog.title || "").toLowerCase().includes(keyword) ||
                        (blog.description || "").toLowerCase().includes(keyword)
                );
                if (filtered.length === 0) {
                    row.innerHTML = `<div class='blogs-no-result'>Không tìm thấy bài viết phù hợp.</div>`;
                } else {
                    row.innerHTML = await createBlogCards(filtered);
                }
                if (window.AOS) AOS.refresh();
            });
            // Nếu xóa hết input thì load lại danh sách bài viết ban đầu
            searchInput.addEventListener("input", async function () {
                if (!this.value.trim()) {
                    row.innerHTML = await createBlogCards(allBlogs);
                    if (window.AOS) AOS.refresh();
                }
            });
        }
    } catch (e) {
        row.innerHTML = `<div class='text-danger'>Lỗi tải bài viết: ${e.message}</div>`;
    }
});