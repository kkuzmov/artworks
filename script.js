document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("mobile-menu");
  const navList = document.querySelector(".nav-list");
  const gallery = document.getElementById("gallery");

  let page = 1;
  let isLoading = false;
  let category = null;

  if (menuToggle) {
    menuToggle.addEventListener("click", function () {
      navList.classList.toggle("active");
    });
  }

  // Detect category based on the page filename
  const pageName = window.location.pathname.split("/").pop();

  if (pageName.includes("paintings")) {
    category = "Painting";
  } else if (pageName.includes("sculptures")) {
    category = "Sculpture";
  } else if (pageName.includes("textiles")) {
    category = "Textile";
  }

  // Create loader element
  const loader = document.createElement("div");
  loader.classList.add("loader");
  document.body.appendChild(loader);

  function showLoader() {
    loader.style.display = "block";
  }

  function hideLoader() {
    loader.style.display = "none";
  }

  function fetchArtworks() {
    if (!category || isLoading) return;

    isLoading = true;
    showLoader();

    const apiUrl = `https://api.artic.edu/api/v1/artworks/search?q=${category}&fields=id,title,image_id,artist_title,date_display,artwork_type_title&limit=10&page=${page}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (!gallery) return;

        data.data.forEach((artwork) => {
          if (artwork.artwork_type_title === category) {
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

        hideLoader();
        isLoading = false;
        page++;
      })
      .catch((error) => {
        console.error("Error fetching artworks:", error);
        hideLoader();
        isLoading = false;
      });
  }

  // Initial fetch
  fetchArtworks();

  // Infinite scroll event listener
  window.addEventListener("scroll", function () {
    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 100
    ) {
      fetchArtworks();
    }
  });
});
