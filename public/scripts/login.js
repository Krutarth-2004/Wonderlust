document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("togglePasswordBtn");
  const passwordInput = document.getElementById("password");
  const icon = document.getElementById("toggleIcon");

  toggleBtn.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
    icon.classList.toggle("fa-eye");
    icon.classList.toggle("fa-eye-slash");
  });
});
