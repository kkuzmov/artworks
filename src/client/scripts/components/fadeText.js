document.addEventListener("DOMContentLoaded", function () {
  fadeIn();

  function fadeIn() {
    const title =
      document.querySelector("h1 > span") || document.querySelector("h1");
    const subtitle = document.querySelector("h2");

    setTimeout(function () {
      title.style.opacity = 1;
    }, 2000);

    if (subtitle) {
      setTimeout(function () {
        subtitle.style.opacity = 1;
        subtitle.style.height = "auto";
      }, 2500);
    }
  }
});
