document.addEventListener('DOMContentLoaded', () => {
    displaySearchHistory();
    setupRerunButtons();
});

function displaySearchHistory() {
    const historyList = document.querySelector('.history-list');
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');

    if (history.length === 0) {
        historyList.innerHTML = `
            <div class="no-history text-center" data-aos="fade-up">
                <i class="fas fa-history"></i>
                <p>Chưa có lịch sử tìm kiếm nào.</p>
            </div>
        `;
        return;
    }

    historyList.innerHTML = history.map((item) => `
        <div class="history-item" data-aos="fade-up" data-aos-delay="100">
            <div class="history-item-content">
                <i class="fas fa-search history-icon"></i>
                <div class="history-details">
                    <p class="history-query">${item.title}</p>
                    <span class="history-timestamp">Vào ${item.createdAt}</span>
                </div>
            </div>
            <button class="btn rerun-btn" data-query="${item.name}">
                Mở
            </button>
        </div>
    `).join('');
}

function setupRerunButtons() {
    document.querySelectorAll('.rerun-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
            const button = e.target;
            // console.log(button);
            const historyItem = button.closest('.history-item');
            // console.log(historyItem);
            const index = Array.from(historyItem.parentNode.children).indexOf(historyItem);
            // console.log(history[index]);
            localStorage.setItem("showHistory", JSON.stringify(history[index]));
            window.location.href = "./show_history.html";
        });
    });
}
