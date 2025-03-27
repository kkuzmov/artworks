document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("mobile-menu");
  const navList = document.querySelector(".nav-list");
  const gallery = document.getElementById("gallery");
  const searchInput = document.getElementById("search-input");
  const searchButton = document.getElementById("search-button");
  const modal = document.getElementById("art-modal");
  const modalContent = document.getElementById("modal-content");
  const modalClose = document.getElementById("modal-close");

  let page = 1;
  let isLoading = false;
  let category = null;
  let searchQuery = "";

  if (menuToggle) {
    menuToggle.addEventListener("click", function () {
      navList.classList.toggle("active");
    });
  }

  const pageName = window.location.pathname.split("/").pop();
  if (pageName.includes("paintings")) category = "Painting";
  else if (pageName.includes("sculptures")) category = "Sculpture";
  else if (pageName.includes("textiles")) category = "Textile";

  const loader = document.createElement("div");
  loader.classList.add("loader");
  document.body.appendChild(loader);

  function showLoader() {
    loader.style.display = "block";
  }
  function hideLoader() {
    loader.style.display = "none";
  }

  function fetchArtworks(reset = false) {
    if ((!category && !searchQuery) || isLoading) return;
    isLoading = true;
    showLoader();

    if (reset) {
      gallery.innerHTML = "";
      page = 1;
    }

    let apiUrl = `https://api.artic.edu/api/v1/artworks/search?fields=id,title,image_id,artist_title,date_display,artwork_type_title&limit=10&page=${page}`;
    if (searchQuery) apiUrl += `&q=${searchQuery}`;
    else apiUrl += `&q=${category}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (!gallery) return;

        data.data.forEach((artwork) => {
          const artItem = document.createElement("div");
          artItem.setAttribute("tabindex", "0");
          artItem.classList.add("art-item");

          const imageUrl = artwork.image_id
            ? `https://www.artic.edu/iiif/2/${artwork.image_id}/full/300,/0/default.jpg`
            : "../client/assets/images/placeholder.jpg";

          artItem.innerHTML = `
                    <div class="art-item__image-container">
                    <img src="${imageUrl}" alt="${
            artwork.title
          }" class="art-image"></div>
                    <h2>${artwork.title}</h2>
                    <p><strong>Artist:</strong> ${
                      artwork.artist_title || "Unknown"
                    }</p>
                    <p><strong>Year:</strong> ${
                      artwork.date_display || "N/A"
                    }</p>
                    <img src="../client/assets/images/zoom.png" width="35px" alt="Open additional info" height="35px" class="zoom-icon" data-id="${
                      artwork.id
                    }">
                `;

          // Handle image errors dynamically
          const imgElement = artItem.querySelector(".art-image");
          imgElement.onerror = function () {
            this.onerror = null; // Prevent infinite loop
            this.src = "../client/assets/images/placeholder.png"; // Fallback to placeholder
          };

          gallery.appendChild(artItem);

          // Open modal on Enter key
          artItem.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
              const zoomIcon = artItem.querySelector(".zoom-icon");
              zoomIcon.click(); // Trigger click event
            }
          });
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

  // Open modal on zoom click
  gallery.addEventListener("click", function (event) {
    if (event.target.classList.contains("zoom-icon")) {
      const artworkId = event.target.getAttribute("data-id");
      fetchArtworkDetails(artworkId);
    }
  });

  // Fetch artwork details for modal
  function fetchArtworkDetails(id) {
    showLoader();
    fetch(
      `https://api.artic.edu/api/v1/artworks/${id}?fields=id,title,image_id,artist_title,date_display,medium_display,dimensions,description`
    )
      .then((response) => response.json())
      .then((data) => {
        const artwork = data.data;
        modalContent.innerHTML = `
                  <h2 class="modal__title">${artwork.title}</h2>
                  <span id="modal-close" class="modal__close">&times;</span>
                  <div class="modal__image">
                  <img src="https://www.artic.edu/iiif/2/${
                    artwork.image_id
                  }/full/600,/0/default.jpg" alt="${artwork.title}"></div>
                  <p><strong>Artist:</strong> ${
                    artwork.artist_title || "Unknown"
                  }</p>
                  <p><strong>Year:</strong> ${artwork.date_display || "N/A"}</p>
                  <p><strong>Medium:</strong> ${
                    artwork.medium_display || "Unknown"
                  }</p>
                  <p><strong>Dimensions:</strong> ${
                    artwork.dimensions || "N/A"
                  }</p>
                  <p><strong>Description:</strong> ${
                    artwork.description || "No description available."
                  }</p>
              `;
        modal.style.display = "block";
        hideLoader();
      })
      .catch((error) => {
        console.error("Error fetching artwork details:", error);
        hideLoader();
      });
  }

  // Close modal
  modal.addEventListener("click", function (event) {
    if (event.target.id === "modal-close" || event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", handleEscapeKey);

  function closeModal() {
    modal.style.display = "none";
  }
  function handleEscapeKey(event) {
    if (event.key === "Escape") {
      closeModal();
    }
  } // Infinite scroll
  window.addEventListener("scroll", function () {
    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 100
    ) {
      fetchArtworks();
    }
  });

  // Search functionality
  if (searchButton && searchInput) {
    searchButton.addEventListener("click", function () {
      searchQuery = searchInput.value.trim();
      fetchArtworks(true);
    });

    searchInput.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        searchQuery = searchInput.value.trim();
        fetchArtworks(true);
      }
    });
  }

  fetchArtworks();
});
