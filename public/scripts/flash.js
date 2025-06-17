document.addEventListener("DOMContentLoaded", () => {
  const flash = sessionStorage.getItem("flashMessage");
  if (flash && window.Toastify) {
    const { type, text } = JSON.parse(flash);

    Toastify({
      text: text,
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      className: "toastify-center shadow rounded text-white",
      backgroundColor:
        type === "success"
          ? "linear-gradient(to right, #198754, #28a745)"
          : "linear-gradient(to right, #dc3545, #c82333)",
      stopOnFocus: true,
    }).showToast();

    sessionStorage.removeItem("flashMessage");
  }
});
