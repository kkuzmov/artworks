window.onload = function () {
  const title =
    document.querySelector("h1 > span") || document.querySelector("h1");
  setTimeout(function () {
    title.style.opacity = 1;
  }, 2000);
};
