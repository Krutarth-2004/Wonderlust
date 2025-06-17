(() => {
  "use strict";

  window.addEventListener("load", () => {
    // Select all forms that require validation
    const forms = document.querySelectorAll(".needs-validation");

    forms.forEach((form) => {
      form.addEventListener("submit", (event) => {
        // If form is invalid, prevent submission
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        // Add Bootstrap's validation style
        form.classList.add("was-validated");
      });
    });
  });
})();
