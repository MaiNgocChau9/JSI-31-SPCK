import { getHistoriesByUser } from "../components/history.js";

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
        <div class="history-details">
          <p class="history-query">${item.title}</p>
          <span class="history-timestamp">Vào ${formatTimestamp(item.createdAt)}</span>
        </div>
      </div>
      <button class="btn rerun-btn" data-title="${item.title}">Mở</button>
    </div>
  `).join('');
}

document.addEventListener("DOMContentLoaded", () => {
  displaySearchHistory();
  // Bắt sự kiện click qua delegation
  const historyList = document.querySelector('.history-list');
  historyList.addEventListener('click', async e => {
    if (!e.target.classList.contains('rerun-btn')) return;
    const title = e.target.dataset.title;
    const email = getCurrentEmail();
    const history = await getHistoriesByUser(email);
    const item = history.find(h => h.title === title);
    if (item) {
      localStorage.setItem("showHistory", JSON.stringify(item));
      window.location.href = "./show_history.html";
    }
  });
});