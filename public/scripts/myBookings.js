document.addEventListener("DOMContentLoaded", () => {
  let selectedForm = null;

  const modal = document.getElementById("cancelModal");
  const confirmBtn = document.getElementById("confirmCancel");
  const closeModalBtn = document.getElementById("closeModal");
  const closeX = document.querySelector(".close");

  document.querySelectorAll(".cancel-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      selectedForm = e.target.closest("form");
      modal.style.display = "flex";
    });
  });

  closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
    selectedForm = null;
  });

  closeX.addEventListener("click", () => {
    modal.style.display = "none";
    selectedForm = null;
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
      selectedForm = null;
    }
  });

  confirmBtn.addEventListener("click", () => {
    if (selectedForm) {
      selectedForm.submit();
    }
  });
});
