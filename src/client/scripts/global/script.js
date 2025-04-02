document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("mobile-menu");
  const navList = document.querySelector(".nav-list");

  if (menuToggle) {
    menuToggle.addEventListener("click", function () {
      navList.classList.toggle("active");
    });
  }

  let footer = document.querySelector("footer");
  let scrollTimeout;

  window.addEventListener("scroll", () => {
    // Hide the footer while scrolling
    footer.style.transform = "translateY(100%)";

    // Clear previous timeout and set a new one
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      footer.style.transform = "translateY(0)"; // Show the footer after scrolling stops
    }, 1000);
  });
});
