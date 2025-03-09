document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("mobile-menu");
  const navList = document.querySelector(".nav-list");

  if (menuToggle) {
    menuToggle.addEventListener("click", function () {
      navList.classList.toggle("active");
    });
  }

  function fetchArtworks(category) {
    let apiUrl = "https://api.artic.edu/api/v1/artworks?page=1&limit=40";

    if (category) {
      apiUrl += `&query[term][classification_titles][]=${category}`;
    }

    fetch(apiUrl)
      .then((response) => response.json())
      .then((res) => {
        const gallery = document.getElementById("gallery");
        if (!gallery) return;
        gallery.innerHTML = "";

        res.data.forEach((artwork) => {
          console.log(artwork);
          const artItem = document.createElement("div");
          artItem.classList.add("art-item");
          artItem.innerHTML = `
                      <img src="https://www.artic.edu/iiif/2/${
                        artwork.image_id
                      }/full/300,/0/default.jpg" alt="${artwork.title}">
                      <h2>${artwork.title}</h2>
                      <p><strong>Artist:</strong> ${
                        artwork.artist_title || "Unknown"
                      }</p>
                      <p><strong>Year:</strong> ${
                        artwork.date_display || "N/A"
                      }</p>
                      <p><strong>Type:</strong> ${
                        artwork.artwork_type_title || "N/A"
                      }</p>
                  `;
          gallery.appendChild(artItem);
        });
      })
      .catch((error) => console.error("Error fetching artworks:", error));
  }

  // Detect category from URL
  const page = window.location.pathname.split("/").pop();
  let category = null;

  if (page.includes("paintings")) {
    category = "Painting";
  } else if (page.includes("sculptures")) {
    category = "Sculpture";
  } else if (page.includes("drawings")) {
    category = "Drawing";
  }

  fetchArtworks(category);
});
