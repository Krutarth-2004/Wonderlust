async function initializeMap() {
  try {
    let lat, lng;

    // Check if valid coordinates are provided from backend
    if (
      Array.isArray(listingCoordinates) &&
      listingCoordinates.length === 2 &&
      typeof listingCoordinates[0] === "number" &&
      typeof listingCoordinates[1] === "number"
    ) {
      [lng, lat] = listingCoordinates;
    } else {
      // Fallback: Geocode address using OpenStreetMap's Nominatim
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          listingLocation
        )}&limit=1`,
        {
          headers: {
            "User-Agent": "ListingApp (krutarthkadia@gmail.com)",
          },
        }
      );

      const data = await response.json();
      if (!data || data.length === 0) {
        alert("Could not find location coordinates for this address.");
        return;
      }

      lat = parseFloat(data[0].lat);
      lng = parseFloat(data[0].lon);
    }

    // Initialize map
    const map = L.map("map").setView([lat, lng], 15);

    // Add OpenStreetMap tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Add marker with popup
    L.marker([lat, lng])
      .addTo(map)
      .bindPopup(`<b>${listingtitle}</b>`)
      .openPopup();

    // Optional: Add scale control
    L.control.scale().addTo(map);
  } catch (error) {
    console.error("Error loading map:", error);
    alert("Failed to load map.");
  }
}

// Wait for DOM to load before initializing map
document.addEventListener("DOMContentLoaded", initializeMap);
