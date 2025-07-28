      document.addEventListener("DOMContentLoaded", () => {
      const phoneField = document.getElementById("phoneField");

      phoneField.addEventListener("input", () => {
        // keep only digits
        let digits = phoneField.value.replace(/\D/g, "");
        // limit to 10 digits
        if (digits.length > 10) digits = digits.slice(0, 10);
        phoneField.value = digits;
      });
      });

      
      document.addEventListener("DOMContentLoaded", function () {
        // Navigation
        const backButton = document.getElementById("backButton");
        backButton.addEventListener("click", function () {
          window.history.back();
        });

        // Profile Picture Handling
        const uploadButton = document.getElementById("uploadButton");
        const fileInput = document.getElementById("fileInput");
        const profilePic = document.getElementById("profilePic");
        
        uploadButton.addEventListener("click", function () {
          fileInput.click();
        });

        fileInput.addEventListener("change", function (e) {
          const file = e.target.files[0];
          if (file) {
            if (file.size > 2000000) { // 2MB limit
              showToast("Image size must be less than 2MB", true);
              return;
            }

            const reader = new FileReader();
            reader.onload = function (e) {
              profilePic.src = e.target.result;
              localStorage.setItem("profilePicture", e.target.result);
              showToast("Profile picture updated");
            };
            reader.readAsDataURL(file);
          }
        });

        // Load saved picture if exists
        const savedPicture = localStorage.getItem("profilePicture");
        if (savedPicture) {
          profilePic.src = savedPicture;
        }

        // Form Validation
        const nameField = document.getElementById("nameField");
        const phoneField = document.getElementById("phoneField");
        const saveButton = document.getElementById("saveButton");
        const nameError = document.getElementById("nameError");
        const phoneError = document.getElementById("phoneError");

        function formatPhoneNumber(value) {
          const cleaned = value.replace(/\D/g, "");
          const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
          if (match) {
            return !match[2]
              ? match[1]
              : `${match[1]}-${match[2]}${match[3] ? `-${match[3]}` : ""}`;
          }
          return value;
        }

        function validateName(name) {
          if (!name.trim()) return "Name is required";
          if (name.trim().length < 2) return "Name must be at least 2 characters";
          return "";
        }

        function validatePhone(phone) {
          const cleaned = phone.replace(/\D/g, "");
          if (!cleaned) return "Phone number is required";
          if (cleaned.length !== 10) return "Phone number must be 10 digits";
          return "";
        }

        function showError(element, message) {
          const errorDiv = element.nextElementSibling.nextElementSibling;
          errorDiv.textContent = message;
          errorDiv.classList.add("show");
          element.classList.add("error");
          element.classList.remove("success");
        }

        function showSuccess(element) {
          const errorDiv = element.nextElementSibling.nextElementSibling;
          errorDiv.classList.remove("show");
          element.classList.remove("error");
          element.classList.add("success");
        }

        function checkFormValidity() {
          const nameValid = validateName(nameField.value) === "";
          const phoneValid = validatePhone(phoneField.value) === "";
          saveButton.disabled = !(nameValid && phoneValid);
        }

        nameField.addEventListener("input", function () {
          const error = validateName(this.value);
          if (error) {
            showError(this, error);
          } else {
            showSuccess(this);
          }
          checkFormValidity();
        });

        phoneField.addEventListener("input", function () {
          this.value = formatPhoneNumber(this.value);
          const error = validatePhone(this.value);
          if (error) {
            showError(this, error);
          } else {
            showSuccess(this);
          }
          checkFormValidity();
        });

        // Load saved data if exists
        const savedName = localStorage.getItem("profileName");
        const savedPhone = localStorage.getItem("profilePhone");

        if (savedName) {
          nameField.value = savedName;
          showSuccess(nameField);
        }
        if (savedPhone) {
          phoneField.value = savedPhone;
          showSuccess(phoneField);
        }

        checkFormValidity();

        // Form Submission
        const profileForm = document.getElementById("profileForm");
        const saveText = document.getElementById("saveText");
        const loadingSpinner = document.getElementById("loadingSpinner");
        let previousData = {};

        profileForm.addEventListener("submit", function (e) {
          e.preventDefault();

          previousData = {
            name: localStorage.getItem("profileName") || "",
            phone: localStorage.getItem("profilePhone") || "",
            picture: localStorage.getItem("profilePicture") || ""
          };

          saveText.classList.add("hidden");
          loadingSpinner.classList.remove("hidden");
          saveButton.disabled = true;

          setTimeout(() => {
            localStorage.setItem("profileName", nameField.value);
            localStorage.setItem("profilePhone", phoneField.value);

            saveText.classList.remove("hidden");
            loadingSpinner.classList.add("hidden");
            saveButton.disabled = false;

            showToast("Profile saved successfully!");
          }, 1000);
        });

        // Clear Profile
        const clearButton = document.getElementById("clearButton");
        const confirmModal = document.getElementById("confirmModal");
        const cancelClear = document.getElementById("cancelClear");
        const confirmClear = document.getElementById("confirmClear");

        clearButton.addEventListener("click", function () {
          confirmModal.classList.add("show");
        });

        cancelClear.addEventListener("click", function () {
          confirmModal.classList.remove("show");
        });

        confirmClear.addEventListener("click", function () {
          localStorage.removeItem("profileName");
          localStorage.removeItem("profilePhone");
          localStorage.removeItem("profilePicture");

          nameField.value = "";
          phoneField.value = "";
          profilePic.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Ccircle cx='60' cy='60' r='60' fill='%23333'/%3E%3Ccircle cx='60' cy='45' r='20' fill='%23666'/%3E%3Cpath d='M20 100c0-22 18-40 40-40s40 18 40 40' fill='%23666'/%3E%3C/svg%3E";

          nameField.classList.remove("success", "error");
          phoneField.classList.remove("success", "error");
          
          nameError.classList.remove("show");
          phoneError.classList.remove("show");

          saveButton.disabled = true;
          confirmModal.classList.remove("show");

          showToast("Profile cleared successfully!");
        });

        // Toast System
        const toast = document.getElementById("toast");
        const toastMessage = document.getElementById("toastMessage");
        const closeToast = document.getElementById("closeToast");
        let toastTimeout;

        function showToast(message, isError = false) {
          if (isError) {
            toast.classList.add("danger");
          } else {
            toast.classList.remove("danger");
          }
          
          toastMessage.textContent = message;
          toast.classList.add("show");

          if (toastTimeout) {
            clearTimeout(toastTimeout);
          }

          toastTimeout = setTimeout(() => {
            toast.classList.remove("show");
          }, 5000);
        }

        closeToast.addEventListener("click", function () {
          toast.classList.remove("show");
          if (toastTimeout) {
            clearTimeout(toastTimeout);
          }
        });

        // Keyboard Handling
        const inputs = document.querySelectorAll("input");

        inputs.forEach((input) => {
          input.addEventListener("focus", function () {
            setTimeout(() => {
              this.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
            }, 300);
          });
        });

        window.addEventListener("resize", function () {
          const currentHeight = window.innerHeight;
          if (currentHeight < 500) {
            document.body.style.paddingBottom = "300px";
          } else {
            document.body.style.paddingBottom = "";
          }
        });
      });
    
  