import { getHistoriesByUser, deleteHistory, editHistoryTitle } from "../components/history.js";

function getCurrentEmail() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  return (user?.email || user?.[0]?.email) ?? "unknown";
}

function formatTimestamp(createdAt) {
  if (!createdAt) return "";
  if (typeof createdAt.toDate === 'function') {
    return createdAt.toDate().toLocaleString("vi-VN");
  }
  return new Date(createdAt).toLocaleString("vi-VN");
}

async function displaySearchHistory() {
  const historyList = document.querySelector('.history-list');
  const email = getCurrentEmail();
  console.log("[HISTORY] Đang lấy lịch sử cho email:", email);
  const history = await getHistoriesByUser(email);
  console.log("[HISTORY] Kết quả trả về từ Firebase:", history);
  if (!history?.length) {
    historyList.innerHTML = `
      <div class="no-history text-center" data-aos="fade-up">
        <i class="fas fa-history"></i>
        <p>Chưa có lịch sử tìm kiếm nào.</p>
      </div>`;
    return;
  }
  historyList.innerHTML = history.map((item, index) => `
    <div class="history-item" data-aos="fade-up" data-aos-delay="${100 + index*50}">
      <div class="history-item-content">
        <i class="fas fa-search history-icon"></i>
        <div class="history-text-clickable" data-title="${item.title}">
          <p class="history-query">${item.title}</p>
          <span class="history-timestamp">Vào ${formatTimestamp(item.createdAt)}</span>
        </div>
      </div>
      <div class="history-actions">
        <button class="btn btn-sm btn-primary edit-history-btn" data-title="${item.title}"><i class="fas fa-edit"></i> Sửa</button>
        <button class="btn btn-sm btn-danger delete-history-btn" data-title="${item.title}"><i class="fas fa-trash-alt"></i> Xóa</button>
      </div>
    </div>
  `).join('');
}

document.addEventListener("DOMContentLoaded", () => {
  displaySearchHistory();
  // Bắt sự kiện click qua delegation
  const historyList = document.querySelector('.history-list');
  historyList.addEventListener('click', async e => {
    const target = e.target;
    const title = target.dataset.title || target.closest('.history-text-clickable')?.dataset.title || target.closest('.edit-history-btn')?.dataset.title || target.closest('.delete-history-btn')?.dataset.title;
    const email = getCurrentEmail();

    if (target.closest('.history-text-clickable')) {
      const history = await getHistoriesByUser(email);
      const item = history.find(h => h.title === title);
      if (item) {
        localStorage.setItem("showHistory", JSON.stringify(item));
        window.location.href = "./show_history.html";
      }
    } else if (target.closest('.edit-history-btn')) {
      const newTitle = prompt("Nhập tên mới cho lịch sử:", title);
      if (newTitle && newTitle !== title) {
        await editHistoryTitle(email, title, newTitle);
        displaySearchHistory(); // Refresh the list
      }
    } else if (target.closest('.delete-history-btn')) {
      if (confirm("Bạn có chắc chắn muốn xóa lịch sử này?")) {
        await deleteHistory(email, title);
        displaySearchHistory(); // Refresh the list
      }
    }
  });
});
