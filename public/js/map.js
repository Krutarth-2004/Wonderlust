// Access `listingCoordinates` from global scope
const [lng, lat] = listingCoordinates; // GeoJSON format is [longitude, latitude]

// Initialize map centered on listing coordinates
const map = L.map("map").setView([lat, lng], 13);

// Add OpenStreetMap tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors",
  maxZoom: 19,
}).addTo(map);

// Add a marker
const marker = L.marker([lat, lng]).addTo(map);
marker
  .bindPopup(
    `<b>${listingtitle}</b><br>Exact location will be provided upon booking`
  )
  .openPopup();

// // Update popup when marker is dragged
// marker.on("dragend", function (e) {
//   const { lat, lng } = e.target.getLatLng();
//   marker.setPopupContent(`New location: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
//   marker.openPopup();
// });

// // Click to reposition the marker
// map.on("click", function (e) {
//   const { lat, lng } = e.latlng;
//   marker.setLatLng([lat, lng]);
//   marker.setPopupContent(`You clicked: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
//   marker.openPopup();
// });

// Add scale control
L.control.scale().addTo(map);
