document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("mobile-menu");
  const navList = document.querySelector(".nav-list");

  if (menuToggle) {
    menuToggle.addEventListener("click", function () {
      navList.classList.toggle("active");
    });
  }

  function fetchArtworks(typeTitle) {
    const apiUrl = `https://api.artic.edu/api/v1/artworks/search?q=${typeTitle}&fields=id,title,image_id,artist_title,date_display,artwork_type_title&limit=10`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const gallery = document.getElementById("gallery");
        if (!gallery) return;
        gallery.innerHTML = "";

        data.data.forEach((artwork) => {
          if (artwork.artwork_type_title === typeTitle) {
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
                      `;
            gallery.appendChild(artItem);
          }
        });
      })
      .catch((error) => console.error("Error fetching artworks:", error));
  }

  // Detect category based on page filename
  const page = window.location.pathname.split("/").pop();
  let category = null;

  if (page.includes("paintings")) {
    category = "Painting";
  } else if (page.includes("sculptures")) {
    category = "Sculpture";
  } else if (page.includes("ceramics")) {
    category = "Ceramics";
  }

  // Fetch artworks only if a category is detected
  if (category) {
    fetchArtworks(category);
  }
});
