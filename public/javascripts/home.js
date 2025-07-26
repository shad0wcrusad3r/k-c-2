document.addEventListener("DOMContentLoaded", function () {
        const hamburger = document.getElementById("hamburger");
        const slideMenu = document.getElementById("slide-menu");
        const menuOverlay = document.getElementById("menu-overlay");

        function openMenu() {
        slideMenu.classList.add("open");
        menuOverlay.classList.remove("hidden");
        document.body.style.overflow = "hidden";
        }

        function closeMenu() {
        slideMenu.classList.remove("open");
        menuOverlay.classList.add("hidden");
        document.body.style.overflow = "";
        }

        hamburger.addEventListener("click", openMenu);
        menuOverlay.addEventListener("click", closeMenu);

        // Handle category items
        document.querySelectorAll(".category-item").forEach((item) => {
        item.addEventListener("click", function() {
            const category = this.dataset.category;
            document.getElementById("current-category").textContent =
            category.charAt(0).toUpperCase() + category.slice(1);
            loadDishes(category);
            closeMenu();
        });
        });

        // Handle navigation links separately
        document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            const target = this.dataset.nav;
            closeMenu();
            
            // Small delay to allow menu to close before navigation
            setTimeout(() => {
            if (target === "profile") {
                window.location.href = "profile.html";
            } else if (target === "checkout") {
                window.location.href = "checkout.html";
            }
            }, 100);
        });
        });
    });

    document.addEventListener("DOMContentLoaded", function () {
        const categorySelector = document.getElementById("category-selector");
        const categoryDrawer = document.getElementById("category-drawer");
        const categoryOverlay = document.getElementById("category-overlay");
        function openCategoryDrawer() {
          categoryDrawer.classList.add("open");
          categoryOverlay.classList.remove("hidden");
        }
        function closeCategoryDrawer() {
          categoryDrawer.classList.remove("open");
          categoryOverlay.classList.add("hidden");
        }
        categorySelector.addEventListener("click", openCategoryDrawer);
        categoryOverlay.addEventListener("click", closeCategoryDrawer);
        document.querySelectorAll(".category-option").forEach((option) => {
          option.addEventListener("click", function () {
            const category = this.dataset.category;
            document.getElementById("current-category").textContent =
              category.charAt(0).toUpperCase() + category.slice(1);
            loadDishes(category);
            closeCategoryDrawer();
          });
        });
      });

     const dishData = {
        tiffin: [
          {
            id: 1,
            name: "South Indian Tiffin",
            description: "Idli, sambar, coconut chutney with pickle",
            price: 120,
            image:
              "imglink",
          },
          {
            id: 2,
            name: "North Indian Tiffin",
            description: "Roti, dal, sabzi, rice with papad",
            price: 150,
            image:
              "imglink",
          },
          {
            id: 3,
            name: "Gujarati Thali",
            description: "Complete Gujarati meal with sweets",
            price: 180,
            image:
              "imglink",
          },
        ],
        meals: [
          {
            id: 4,
            name: "Chicken Biryani",
            description: "Aromatic basmati rice with tender chicken",
            price: 280,
            image:
              "imglink",
          },
          {
            id: 5,
            name: "Paneer Butter Masala",
            description: "Creamy paneer curry with naan and rice",
            price: 220,
            image:
              "imglink",
          },
          {
            id: 6,
            name: "Fish Curry Meal",
            description: "Spicy fish curry with rice and vegetables",
            price: 250,
            image:
              "imglink",
          },
        ],
        snacks: [
          {
            id: 7,
            name: "Samosa Chat",
            description: "Crispy samosas with chutneys and yogurt",
            price: 80,
            image:
              "imglink",
          },
          {
            id: 8,
            name: "Pav Bhaji",
            description: "Spicy vegetable curry with buttered pav",
            price: 100,
            image:
              "imglink",
          },
          {
            id: 9,
            name: "Dosa Combo",
            description: "Crispy dosa with sambar and chutneys",
            price: 90,
            image:
              "imglink",
          },
        ],
      };
      function loadDishes(category) {
        const dishGrid = document.getElementById("dish-grid");
        const dishes = dishData[category] || [];
        dishGrid.innerHTML = dishes
          .map(
            (dish) => `
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <img src="${dish.image}" alt="${dish.name}" class="w-full h-48 object-cover object-top">
      <div class="p-4">
      <h3 class="font-semibold text-gray-800 mb-1">${dish.name}</h3>
      <p class="text-sm text-gray-600 mb-3">${dish.description}</p>
      <div class="flex items-center justify-between mb-3">
      <span class="text-lg font-bold text-primary">₹${dish.price}</span>
      </div>
      <div class="flex items-center justify-between">
      <div class="flex items-center space-x-3">
      <button class="quantity-btn minus w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center" data-dish-id="${dish.id}" disabled>
      <i class="ri-subtract-line text-sm"></i>
      </button>
      <span class="quantity-display font-semibold text-gray-800 min-w-[2rem] text-center" data-dish-id="${dish.id}">0</span>
      <button class="quantity-btn plus w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center" data-dish-id="${dish.id}">
      <i class="ri-add-line text-sm"></i>
      </button>
      </div>
      <button class="add-to-cart-btn bg-gray-300 text-gray-500 px-4 py-2 rounded-button font-medium whitespace-nowrap !rounded-button" data-dish-id="${dish.id}" disabled>
      Add to Cart
      </button>
      </div>
      </div>
      </div>
      `,
          )
          .join("");
        updateQuantityDisplays();
        attachQuantityListeners();
      }
      function updateQuantityDisplays() {
        document.querySelectorAll(".quantity-display").forEach((display) => {
          const dishId = display.dataset.dishId;
          const quantity = (display.textContent = getQuantity(dishId));
          const minusBtn = document.querySelector(
            `.quantity-btn.minus[data-dish-id="${dishId}"]`,
          );
          const plusBtn = document.querySelector(
            `.quantity-btn.plus[data-dish-id="${dishId}"]`,
          );
          const addBtn = document.querySelector(
            `.add-to-cart-btn[data-dish-id="${dishId}"]`,
          );
          minusBtn.disabled = quantity <= 0;
          plusBtn.disabled = quantity >= 20;
          if (quantity > 0) {
            addBtn.disabled = false;
            addBtn.classList.remove("bg-gray-300", "text-gray-500");
            addBtn.classList.add("bg-primary", "text-white");
          } else {
            addBtn.disabled = true;
            addBtn.classList.remove("bg-primary", "text-white");
            addBtn.classList.add("bg-gray-300", "text-gray-500");
          }
        });
      }
      function attachQuantityListeners() {
        let tempQuantities = {};
        document.querySelectorAll(".quantity-btn").forEach((btn) => {
          btn.addEventListener("click", function () {
            if (this.disabled) return;
            const dishId = this.dataset.dishId;
            const isPlus = this.classList.contains("plus");
            const display = document.querySelector(
              `.quantity-display[data-dish-id="${dishId}"]`,
            );
            const currentQuantity = parseInt(display.textContent) || 0;
            const storedQuantity = getQuantity(dishId);
            this.innerHTML = '<div class="loading-spinner"></div>';
            this.disabled = true;
            setTimeout(() => {
              const newQuantity = isPlus
                ? Math.min(currentQuantity + 1, 20)
                : Math.max(currentQuantity - 1, 0);
              display.textContent = newQuantity;
              tempQuantities[dishId] = newQuantity;
              if (newQuantity <= storedQuantity) {
                setQuantity(dishId, newQuantity);
                updateCartCount();
                if (!isPlus) {
                  showSnackbar(`Removed 1 item from cart`);
                }
              }
              const minusBtn = document.querySelector(
                `.quantity-btn.minus[data-dish-id="${dishId}"]`,
              );
              const plusBtn = document.querySelector(
                `.quantity-btn.plus[data-dish-id="${dishId}"]`,
              );
              const addBtn = document.querySelector(
                `.add-to-cart-btn[data-dish-id="${dishId}"]`,
              );
              minusBtn.disabled = newQuantity <= 0;
              plusBtn.disabled = newQuantity >= 20;
              if (newQuantity > 0) {
                addBtn.disabled = false;
                addBtn.classList.remove("bg-gray-300", "text-gray-500");
                addBtn.classList.add("bg-primary", "text-white");
              } else {
                addBtn.disabled = true;
                addBtn.classList.remove("bg-primary", "text-white");
                addBtn.classList.add("bg-gray-300", "text-gray-500");
              }
              this.innerHTML = isPlus
                ? '<i class="ri-add-line text-sm"></i>'
                : '<i class="ri-subtract-line text-sm"></i>';
              this.disabled = false;
              if (navigator.vibrate) {
                navigator.vibrate(50);
              }
            }, 200);
          });
        });
        document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
          btn.addEventListener("click", function () {
            if (this.disabled) return;
            const dishId = this.dataset.dishId;
            const quantity = tempQuantities[dishId] || 0;
            const currentQuantity = getQuantity(dishId) || 0;
            if (quantity > 0) {
              if (quantity < currentQuantity) {
                const diff = currentQuantity - quantity;
                setQuantity(dishId, quantity);
                showSnackbar(`Removed ${diff} item(s) from cart`);
              } else {
                const diff = quantity - currentQuantity;
                setQuantity(dishId, quantity);
                showSnackbar(`Added ${diff} item(s) to cart`);
              }
              updateCartCount();
              document.getElementById("cart-button").classList.add("cart-bounce");
              setTimeout(() => {
                document
                  .getElementById("cart-button")
                  .classList.remove("cart-bounce");
              }, 300);
            }
          });
        });
      }
      function getQuantity(dishId) {
        try {
          return parseInt(localStorage.getItem(`dish_${dishId}`) || "0");
        } catch (e) {
          return 0;
        }
      }
      function setQuantity(dishId, quantity) {
        try {
          localStorage.setItem(`dish_${dishId}`, quantity.toString());
        } catch (e) {
          console.warn("LocalStorage not available");
        }
      }
      function updateCartCount() {
        const cartCount = document.getElementById("cart-count");
        let totalItems = 0;
        try {
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith("dish_")) {
              totalItems += parseInt(localStorage.getItem(key) || "0");
            }
          }
        } catch (e) {
          totalItems = 0;
        }
        if (totalItems > 0) {
          cartCount.textContent = totalItems;
          cartCount.classList.remove("hidden");
        } else {
          cartCount.classList.add("hidden");
        }
      }
      function showSnackbar(message) {
        const snackbar = document.getElementById("snackbar");
        const snackbarText = document.getElementById("snackbar-text");
        snackbarText.textContent = message;
        snackbar.style.opacity = "1";
        snackbar.style.transform = "translateY(0)";
        setTimeout(() => {
          snackbar.style.opacity = "0";
          snackbar.style.transform = "translateY(100%)";
        }, 1500);
      }
      // Change this at the bottom of the dish-management script
    document.addEventListener("DOMContentLoaded", function () {
    loadDishes("tiffin");
    updateCartCount();
    document.getElementById("cart-button").addEventListener("click", function () {
    window.location.href = "checkout.html";
  });
}); 