// Initialize AOS (Animate On Scroll)
AOS.init({
  duration: 800,
  once: true,
  offset: 100,
});

// Dark Mode Toggle
const themeToggle = document.getElementById("theme-toggle");
const htmlElement = document.documentElement;

// Kiểm tra xem người dùng đã chọn chế độ nào trước đó
const savedTheme = localStorage.getItem("theme") || "light";
htmlElement.setAttribute("data-theme", savedTheme);

themeToggle.addEventListener("click", () => {
  const currentTheme = htmlElement.getAttribute("data-theme");
  let newTheme;
  if (currentTheme === "light") newTheme = "dark";
  else newTheme = "light";

  htmlElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
});

const nowCurrentUser = JSON.parse(localStorage.getItem("currentUser"));

// Scroll to Top Button
const scrollTopButton = document.getElementById("scroll-to-top");

// Show/hide scroll-to-top button
window.addEventListener("scroll", () => {
  if (window.pageYOffset > 300) {
    scrollTopButton.classList.add("visible");
  } else {
    scrollTopButton.classList.remove("visible");
  }
});

// Smooth scroll to top
scrollTopButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// Navbar Background on Scroll
const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
  if (window.pageYOffset > 50) {
    navbar.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
  } else {
    navbar.style.boxShadow = "none";
  }
});

// Search Form Submit
const searchForm = document.querySelector(".search-form");
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // Add your search logic here
  const searchValue = e.target.querySelector('.search-input').value;
  localStorage.setItem("searchValue", searchValue);
  window.location.href = "./html/process.html";
});

// Add smooth hover effect for category cards
const categoryCards = document.querySelectorAll(".category-card");

categoryCards.forEach((card) => {
  card.addEventListener("mouseenter", () => {
    card.style.transform = "translateY(-10px)";
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "translateY(0)";
  });
});

categoryCards.forEach((card) => {
  card.addEventListener("mouseenter", () => {
    card.style.transform = "translateY(-10px)";
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "translateY(0)";
  });

  // Add click handler for category cards
  card.addEventListener("click", () => {
    const categoryTitle = card.querySelector("h3").textContent;
    let searchQuery = "";

    switch (categoryTitle) {
      case "FPS Games":
        searchQuery =
          "Giới thiệu về các tựa game FPS phổ biến như Valorant, CS2, Call of Duty";
        break;
      case "MOBA Games":
        searchQuery =
          "Giới thiệu về các tựa game MOBA như League of Legends, Dota 2, Mobile Legends";
        break;
      case "Action RPG":
        searchQuery =
          "Giới thiệu về các tựa game nhập vai hành động như Elden Ring, Dark Souls, God of War";
        break;
      case "Racing & Sports":
        searchQuery =
          "Giới thiệu về các tựa game thể thao và đua xe như Forza Horizon, FIFA 24, NBA 2K24";
        break;
    }

    if (searchQuery) {
      if (nowCurrentUser) {
        localStorage.setItem("searchValue", searchQuery);
        window.location.href = "./html/process.html";
      } else {
        alert("Vui lòng đăng nhập để sử dụng tính năng này!");
        window.location.href = "./html/login.html";
      }
    }
  });
});