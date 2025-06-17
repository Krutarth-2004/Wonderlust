// ========= Tax Toggle Handler =========
const taxSwitch = document.getElementById("switchCheckDefault");
if (taxSwitch) {
  taxSwitch.addEventListener("change", () => {
    const basePrices = document.getElementsByClassName("base-price");
    const totalPrices = document.getElementsByClassName("total-price");

    if (taxSwitch.checked) {
      for (let i = 0; i < basePrices.length; i++)
        basePrices[i].style.display = "none";
      for (let i = 0; i < totalPrices.length; i++)
        totalPrices[i].style.display = "inline";
    } else {
      for (let i = 0; i < basePrices.length; i++)
        basePrices[i].style.display = "inline";
      for (let i = 0; i < totalPrices.length; i++)
        totalPrices[i].style.display = "none";
    }
  });
}

// ========= Filter Scroll Buttons =========
const filters = document.getElementById("filters");
const btnLeft = document.getElementById("scroll-left");
const btnRight = document.getElementById("scroll-right");

if (filters && btnLeft && btnRight) {
  btnLeft.addEventListener("click", () => {
    filters.scrollBy({ left: -150, behavior: "smooth" });
  });

  btnRight.addEventListener("click", () => {
    filters.scrollBy({ left: 150, behavior: "smooth" });
  });

  function updateButtons() {
    btnLeft.disabled = filters.scrollLeft <= 0;
    btnRight.disabled =
      filters.scrollLeft + filters.clientWidth >= filters.scrollWidth - 1;
  }

  filters.addEventListener("scroll", updateButtons);
  window.addEventListener("resize", updateButtons);

  updateButtons();
}

// ========= Filter Activation & Listing Renderer =========
const filterElements = document.querySelectorAll(".filter");
const allListingsData = window.allListingsData || [];

let activeFilter = localStorage.getItem("selectedFilter") || null;

function activateFilter(category) {
  filterElements.forEach((filter) => {
    if (filter.getAttribute("title") === category) {
      filter.classList.add("active-filter");
    } else {
      filter.classList.remove("active-filter");
    }
  });

  const container = document.querySelector(".row.row-cols-lg-3");
  container.innerHTML = "";

  allListingsData.forEach((listing, index) => {
    if (!category || listing.category === category) {
      const wrapper = document.createElement("a");
      wrapper.href = `/listings/${listing._id}`;
      wrapper.className = "listing-link";

      const card = document.createElement("div");
      card.className = "card col listing-card mt-3";
      card.setAttribute("data-index", index);

      card.innerHTML = `
        <img src="${
          listing.image.url
        }" class="card-img-top" style="height: 20rem" alt="listing_image" />
        <div class="card-img-overlay"></div>
        <div class="card-body">
          <p class="card-text">
            <b>${listing.title}</b><br />
            <span class="base-price">&#8377; ${Math.round(
              listing.price
            ).toLocaleString("en-IN")}/night</span>
            <span class="total-price" style="display: none">&#8377; ${Math.round(
              listing.price * 1.18
            ).toLocaleString("en-IN")}/night (incl. GST)</span>
          </p>
        </div>
      `;

      wrapper.appendChild(card);
      container.appendChild(wrapper);
    }
  });
}

if (filterElements.length) {
  if (activeFilter) activateFilter(activeFilter);

  filterElements.forEach((filter) => {
    filter.addEventListener("click", () => {
      const category = filter.getAttribute("title");
      if (activeFilter === category) {
        activeFilter = null;
        localStorage.removeItem("selectedFilter");
      } else {
        activeFilter = category;
        localStorage.setItem("selectedFilter", category);
      }
      activateFilter(activeFilter);
    });
  });
}

// ========= Search Bar Script =========
const searchInput = document.getElementById("searchInput");
const listingsContainer = document.querySelector(".row.row-cols-lg-3");

window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  if (params.get("refocus") === "true" && searchInput) {
    searchInput.focus();
    const url = new URL(window.location.href);
    url.searchParams.delete("refocus");
    window.history.replaceState({}, document.title, url.pathname);
  }
});

if (searchInput) {
  searchInput.addEventListener("input", async () => {
    const query = searchInput.value.trim();

    if (!query) {
      window.location.href = "/listings?refocus=true";
      return;
    }

    try {
      const res = await fetch(
        `/listings/search?query=${encodeURIComponent(query)}`
      );
      const data = await res.json();

      listingsContainer.innerHTML = "";

      if (data.listings.length === 0) {
        listingsContainer.innerHTML = `<p class="text-center">No listings found.</p>`;
        return;
      }

      data.listings.forEach((listing) => {
        const card = document.createElement("div");
        card.className = "card col listing-card mt-2 mb-3";
        card.innerHTML = `
          <div class="position-relative">
            <a href="/listings/${listing._id}" class="listing-link">
              <img src="${
                listing.image.url
              }" class="card-img-top" style="height: 20rem" alt="listing_image" />
              <div class="card-img-overlay"></div>
            </a>
          </div>
          <div class="card-body">
            <p class="card-text">
              <b>${listing.title}</b><br />
              <span class="base-price">&#8377; ${Math.round(
                listing.price
              ).toLocaleString("en-IN")}/night</span>
            </p>
          </div>
        `;
        listingsContainer.appendChild(card);
      });
    } catch (err) {
      console.error("Error fetching listings", err);
    }
  });
}
