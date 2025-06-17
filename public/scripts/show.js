const checkInInput = document.getElementById("checkIn");
const checkOutInput = document.getElementById("checkOut");
const guestsInput = document.getElementById("guests");
const checkInTimeInput = document.getElementById("checkInTime");
const checkOutTimeInput = document.getElementById("checkOutTime");
const nightsCount = document.getElementById("nightsCount");
const nightsContainer = document.getElementById("nightsContainer");
const totalCostContainer = document.getElementById("totalCostContainer");
const totalCostSpan = document.getElementById("totalCost");
const availabilityContainer = document.getElementById("availabilityContainer");
const availabilityMessage = document.getElementById("availabilityMessage");
const bookNowButton = document.getElementById("bookNowButton");
const bookingSummaryModal = document.getElementById("bookingSummaryModal");
const confirmBookingButton = document.getElementById("confirmBookingButton");
const cancelBookingButton = document.getElementById("cancelBookingButton");

const summaryTitle = document.getElementById("summaryTitle");
const summaryAddress = document.getElementById("summaryAddress");
const summaryCategory = document.getElementById("summaryCategory");
const summaryOwner = document.getElementById("summaryOwner");
const summaryCheckIn = document.getElementById("summaryCheckIn");
const summaryCheckInTime = document.getElementById("summaryCheckInTime");
const summaryCheckOut = document.getElementById("summaryCheckOut");
const summaryCheckOutTime = document.getElementById("summaryCheckOutTime");
const summaryNights = document.getElementById("summaryNights");
const summaryGuests = document.getElementById("summaryGuests");
const summaryTotalCost = document.getElementById("summaryTotalCost");

const pricePerNight = window.listingData.price;
const maxOccupancy = window.listingData.maxOccupancy;

function calculateAndShowDetails() {
  const checkInDate = new Date(checkInInput.value);
  const checkOutDate = new Date(checkOutInput.value);
  const guests = parseInt(guestsInput.value, 10) || 0;

  nightsContainer.style.display = "none";
  totalCostContainer.style.display = "none";
  availabilityContainer.style.display = "none";
  bookNowButton.disabled = false;

  if (
    checkInInput.value &&
    checkOutInput.value &&
    !isNaN(checkInDate.getTime()) &&
    !isNaN(checkOutDate.getTime()) &&
    checkOutDate > checkInDate &&
    guests > 0
  ) {
    const nights = Math.ceil(
      (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
    );
    nightsCount.textContent = nights;
    nightsContainer.style.display = "block";

    const total = nights * pricePerNight;
    const gst = total * 0.18;
    const totalWithGST = total + gst;
    totalCostSpan.textContent = `₹ ${totalWithGST.toLocaleString(
      "en-IN"
    )} (incl. 18% GST)`;
    totalCostContainer.style.display = "block";

    if (guests > maxOccupancy) {
      availabilityMessage.textContent = `The total number of guests (${guests}) exceeds the maximum occupancy of ${maxOccupancy}.`;
      availabilityMessage.style.color = "#fe424d";
      availabilityContainer.style.display = "block";
      bookNowButton.disabled = true;
    } else {
      checkAvailability(checkInDate, checkOutDate, guests);
    }
  }
}

async function checkAvailability(checkIn, checkOut, guests) {
  availabilityContainer.style.display = "block";
  availabilityMessage.textContent = "Checking availability...";
  availabilityMessage.style.color = "#333";

  try {
    const response = await fetch(
      `/listings/${
        window.listingData._id
      }/availability?checkIn=${checkIn.toISOString()}&checkOut=${checkOut.toISOString()}&guests=${guests}`
    );
    const data = await response.json();

    if (data.available) {
      availabilityMessage.textContent = "Available!";
      availabilityMessage.style.color = "#28a745";
    } else {
      availabilityMessage.textContent = data.message || "Not Available!";
      availabilityMessage.style.color = "#fe424d";
    }

    handleOccupancyMessage();
  } catch (error) {
    availabilityMessage.textContent = "Error checking availability!";
    availabilityMessage.style.color = "#ffc107";
  }
}

function handleOccupancyMessage() {
  const messageText =
    availabilityMessage.textContent || availabilityMessage.innerText;
  if (messageText.includes("exceeds the maximum occupancy")) {
    bookNowButton.disabled = true;
  } else {
    bookNowButton.disabled = false;
  }
}

const observer = new MutationObserver(handleOccupancyMessage);
if (availabilityMessage) {
  observer.observe(availabilityMessage, { childList: true, subtree: true });
}

guestsInput.addEventListener("input", calculateAndShowDetails);
checkInInput.addEventListener("change", calculateAndShowDetails);
checkOutInput.addEventListener("change", calculateAndShowDetails);

bookNowButton.addEventListener("click", (e) => {
  e.preventDefault();

  const checkInDate = new Date(checkInInput.value);
  const checkOutDate = new Date(checkOutInput.value);
  const guests = parseInt(guestsInput.value, 10) || 0;
  const checkInTime = checkInTimeInput.value || "Not specified";
  const checkOutTime = checkOutTimeInput.value || "Not specified";

  if (
    checkInInput.value &&
    checkOutInput.value &&
    !isNaN(checkInDate.getTime()) &&
    !isNaN(checkOutDate.getTime()) &&
    checkOutDate > checkInDate &&
    guests > 0
  ) {
    const nights = Math.ceil(
      (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
    );
    const total = nights * pricePerNight;
    const gst = total * 0.18;
    const totalWithGST = total + gst;

    summaryTitle.textContent = window.listingData.title;
    summaryAddress.textContent = window.listingData.address;
    summaryCategory.textContent = window.listingData.category;
    summaryOwner.textContent = window.listingData.ownerUsername;

    summaryCheckIn.textContent = checkInDate.toDateString();
    summaryCheckInTime.textContent = checkInTime;
    summaryCheckOut.textContent = checkOutDate.toDateString();
    summaryCheckOutTime.textContent = checkOutTime;
    summaryNights.textContent = nights;
    summaryGuests.textContent = guests;
    summaryTotalCost.textContent = `₹ ${totalWithGST.toLocaleString(
      "en-IN"
    )} (incl. 18% GST)`;

    bookingSummaryModal.style.display = "block";
  } else {
    alert(
      "Please fill in valid check-in, check-out dates and number of guests."
    );
  }
});

confirmBookingButton.addEventListener("click", () => {
  bookingSummaryModal.style.display = "none";
  document.getElementById("bookingForm").submit();
});

cancelBookingButton.addEventListener("click", () => {
  bookingSummaryModal.style.display = "none";
});

window.onclick = function (event) {
  if (event.target == bookingSummaryModal) {
    bookingSummaryModal.style.display = "none";
  }
};

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    bookingSummaryModal.style.display = "none";
  }
});

// ===== Populate Time Dropdowns =====
document.addEventListener("DOMContentLoaded", () => {
  function generateTimeOptions(selectElement, defaultTime) {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      const hour12 = hour % 12 === 0 ? 12 : hour % 12;
      const ampm = hour < 12 ? "AM" : "PM";
      const timeString = `${hour12} ${ampm}`;
      times.push(timeString);
    }

    times.forEach((time) => {
      const option = document.createElement("option");
      option.value = time;
      option.textContent = time;
      if (time === defaultTime) {
        option.selected = true;
      }
      selectElement.appendChild(option);
    });
  }

  generateTimeOptions(checkInTimeInput, "10 AM");
  generateTimeOptions(checkOutTimeInput, "9 AM");
});
