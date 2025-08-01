 async function fetchCartCount() {
  try {
    const res = await fetch('/cart/count');
    const data = await res.json();
    return data.count || 0;
  } catch (err) {
    console.error("Error fetching cart count:", err);
    return 0;
  }
}

      async function updateCart(dishId, name, price, image, quantity) {
  try {
    const res = await fetch('/cart/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dishId, name, price, image, quantity })
    });
    const data = await res.json();
    if (data.success) {
      updateCartCountDisplay(data.cartCount);
    }
  } catch (err) {
    console.error("Failed to update cart:", err);
  }
}

function updateCartCountDisplay(count) {
  const cartCount = document.getElementById("cart-count");
  if (count > 0) {
    cartCount.textContent = count;
    cartCount.classList.remove("hidden");
  } else {
    cartCount.classList.add("hidden");
  }
}


document.addEventListener("DOMContentLoaded", async function () {

        const resCart = await fetch('/cart/items');
        const dataCart = await resCart.json();
        dataCart.items.forEach(item => {
          const display = document.querySelector(`.quantity-display[data-dish-id="${item.dishId}"]`);
          if (display) display.textContent = item.quantity;
        });
        updateQuantityDisplays();

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
                window.location.href = "/profile";
            } else if (target === "checkout") {
                window.location.href = "/checkout";
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
            name: "Idli",
            description: "Steamed rice and lentil cakes, soft and fluffy, served with chutney and sambar",
            price: 50,
            image:
              "https://t3.ftcdn.net/jpg/01/61/13/66/360_F_161136674_NgVFcPtWfwLPY03NpJUrSiH9oDvma9Rn.jpg",
          },
          {
            id: 2,
            name: "Dosa",
            description: "Crispy fermented rice and lentil crepe, served with only chutney",
            price: 50,
            image:
              "https://t3.ftcdn.net/jpg/01/86/33/72/360_F_186337209_9rbcMLu3wGCDNaEoK1jO0aNzb0pv7Xs7.jpg",
          },
          {
            id: 3,
            name: "Vada",
            description: "Deep-fried savory lentil doughnuts, crispy outside and soft inside, served with chutney and sambar",
            price: 40,
            image:
              "https://t3.ftcdn.net/jpg/11/19/61/64/360_F_1119616479_alwaVyTmbhajvzhy09lr4zXJjucb16YT.jpg",
          },

          {
            id: 4,
            name: "Upma",
            description: "Savory semolina porridge cooked with vegetables, mustard seeds, and curry leaves",
            price: 40,
            image:
              "https://t3.ftcdn.net/jpg/04/09/19/10/360_F_409191045_hKZVAPBdUXGuuKhbmi2DbbEktKIY33yb.jpg",
          },
          {
            id: 5,
            name: "Poha",
            description: "Flattened rice sautéed with onions, mustard seeds, turmeric, and peanuts for a light, flavorful dish",
            price: 40,
            image:
              "https://t3.ftcdn.net/jpg/04/44/43/92/360_F_444439260_xQwTSr3cCyE144NbSIxrL15G4YwxgCnH.jpg",
          },
          {
            id: 6,
            name: "Paddu",
            description: "Crispy-on-the-outside, soft-on-the-inside rice and lentil dumplings cooked in a special mould, served with chutney",
            price: 50,
            image:
              "https://t3.ftcdn.net/jpg/13/03/54/26/360_F_1303542652_xNBbGskhH0CX5V1QPeLLwL5qmKxJyaWm.jpg",
          },

          {
            id: 7,
            name: "Dhokla",
            description: "Steamed gram flour cake, soft and spongy, with mustard tempering",
            price: 50,
            image:
              "https://t4.ftcdn.net/jpg/10/41/99/53/360_F_1041995329_Y948A29Hru2TXn8JgkWMwJmIVauyQ9jq.jpg",
          },
          {
            id: 8,
            name: "Pulav",
            description: "Fragrant rice cooked with spices and mixed vegetables",
            price: 60,
            image:
              "https://t4.ftcdn.net/jpg/02/92/92/59/360_F_292925962_xka6iNTlEW5ANZkpE5el3HP8WeWi0O5o.jpg",
          },

             {
            id: 9,
            name: "Thatte Idli",
            description: "Thatte Idli – Soft, plate-sized steamed rice cakes served with chutney and sambar.",
            price: 45,
            image:
              "https://as2.ftcdn.net/jpg/02/95/02/23/1000_F_295022362_VaJRToqaT47SDSw78YXjW9WSq7SJLAvg.jpg",
          },
            {
            id: 10,
            name: "Shavige Upittu",
            description: "Sevige Upma – Light and fluffy vermicelli upma served with flavorful chutney.",
            price: 45,
            image:
              "https://img.freepik.com/premium-photo/semiya-upma-vermicelli-uppuma-uppittu-is-popular-breakfast-menu-from-south-india-served-bowl-selective-focus_466689-52556.jpg",
          },
         ],
        meals: [
          {
            id: 11,
            name: "Full meals",
            description: "Complete meal with roti(or chapati), spiced bhaji, rice, sambar, chutney, and curd",
            price: 120,
            image:
              "https://img.freepik.com/premium-photo/indian-thali-food-plate-served-with-vegetables-rice-roti_960396-351006.jpg",
          },
          {
            id: 12,
            name: "Baleyele oota",
            description: "Baleyele Oota – Traditional South Indian meal served on a banana leaf with chutney, kosambari, payasam, rice with saaru, holige, chitranna, bhaji/ambode, palya, and refreshing majjige.",
            price: 300,
            image:
              "https://media.istockphoto.com/id/1131334347/photo/banana-leaf-rice.jpg?s=612x612&w=0&k=20&c=hg_f4RU_ZgTQ-Z3Y0FkNk041CN5l2z2-kQOivxRZdqc=",
          },
           {
            id: 13,
            name: "Jolada rotti oota",
            description: "Jolad Rotti Oota – North Karnataka-style meal with jolad rotti, yengai palya, kalu palya, jhunka vadi, spicy chutney, rice, and sambar",
            price: 150,
            image:
              "https://i.ytimg.com/vi/AeF7P2DmF7w/maxresdefault.jpg",
          },
          {
            id: 14,
            name: "North Indian meals",
            description: "North Indian Meals – A wholesome platter with soft phulkas, paneer sabzi, jeera rice, and flavorful dal.",
            price: 200,
            image:
              "https://res.cloudinary.com/hz3gmuqw6/image/upload/c_fill,q_auto,w_750/f_auto/North-Indian-food-phpUPkVj5",
          },
           {
            id: 15,
            name: "Bisibelebath and Curd rice",
            description: "Bisi Bele Bath – A hearty, spicy rice-lentil dish served with crunchy khara boondi and soothing curd rice.",
            price:90,
            image:
              "https://www.spiceupthecurry.com/wp-content/uploads/2018/02/bisi-bele-bath-recipe-1-480x270.jpg",
          },
          {
            id: 16,
            name: "Fried rice",
            description: "Fried Rice – Flavorful stir-fried rice tossed with vegetables and aromatic spices.",
            price:60,
            image:
              "https://t4.ftcdn.net/jpg/07/17/44/89/360_F_717448989_HWlaGedVcxvHf4gQA7SJT28jqD9L21my.jpg",
          },
          

        ],
        snacks: [
          
          {
            id: 17,
            name: "Pav Bhaji",
            description: "Buttery buns served with spicy mashed vegetable curry",
            price: 80,
            image:
              "https://t3.ftcdn.net/jpg/05/26/67/36/360_F_526673624_MWQkxo3etLNTQbyfJpeBhoRlF4jTOS8H.jpg",
          },

          {
            id: 18,
            name: "Onion Pakoda",
            description: "Crispy fritters made from sliced onions and gram flour served with chutney",
            price: 40,
            image:
              "https://t3.ftcdn.net/jpg/01/13/79/54/360_F_113795471_ukz1BnlzctUcMOapQY5cdI7WFtEd0zfl.jpg",
          },

          {
            id: 19,
            name: "Bonda Soup",
            description: "Soft lentil fritters served in a lightly spiced moong dal soup",
            price: 50,
            image:
              "https://i0.wp.com/blog.food-filment.com/wp-content/uploads/2015/12/img_5911-2.jpg?fit=1200%2C800&ssl=1",
          },

          {
            id: 20,
            name: "Mirchi",
            description: "Deep-fried green chilies stuffed with spiced filling, coated in gram flour batter",
            price: 40,
            image:
              "https://etvbharatimages.akamaized.net/etvbharat/prod-images/05-05-2025/1200-675-24095711-thumbnail-16x9-bajji.jpg",
          },

          {
            id: 21,
            name: "Girmit",
            description: "Spicy puffed rice mix tossed with onions, tomatoes, and tamarind",
            price: 50,
            image:
              "https://vegrecipesofkarnataka.com/assets/img/girmit/girmit-recipe14.jpg",
          },

          {
            id: 22,
            name: "Sabudana Vada",
            description: "Crispy sago and potato patties, mildly spiced and deep-fried",
            price: 40,
            image:
              "https://t4.ftcdn.net/jpg/12/94/53/55/360_F_1294535567_BwTnRxufHYcD9afbGVou5q0YGSWw3B7o.jpg",
          },

          {
            id: 23,
            name: "Samosa",
            description: "Crispy pastry filled with spiced potato and peas",
            price: 65,
            image:
              "https://t4.ftcdn.net/jpg/15/15/56/93/360_F_1515569353_OLObh6cpKVZ6hNmuZdvlU298U2XpBCaE.jpg",
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
          const quantity = parseInt(display.textContent) || 0;

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
      // function attachQuantityListeners() {
      //   let tempQuantities = {};
      //   document.querySelectorAll(".quantity-btn").forEach((btn) => {
      //     btn.addEventListener("click", function () {
      //       if (this.disabled) return;
      //       const dishId = this.dataset.dishId;
      //       const isPlus = this.classList.contains("plus");
      //       const display = document.querySelector(
      //         `.quantity-display[data-dish-id="${dishId}"]`,
      //       );
      //       const currentQuantity = parseInt(display.textContent) || 0;
      //       //const storedQuantity = getQuantity(dishId);
      //       const dish = dishData[currentCategory].find(d => d.id == dishId);
      //       const newQuantity = isPlus
      //           ? Math.min(currentQuantity + 1, 20)
      //           : Math.max(currentQuantity - 1, 0);

      //         display.textContent = newQuantity;
      //         tempQuantities[dishId] = newQuantity;

      //         // Update backend cart
      //         updateCart(dish.id, dish.name, dish.price, dish.image, newQuantity);

      //         if (newQuantity > currentQuantity && isPlus) {
      //           showSnackbar(`Added 1 ${dish.name} to cart`);
      //         } else if (newQuantity < currentQuantity && !isPlus) {
      //           showSnackbar(`Removed 1 ${dish.name} from cart`);
      //         }

      //         // Update button states
      //         const minusBtn = document.querySelector(
      //           `.quantity-btn.minus[data-dish-id="${dishId}"]`
      //         );
      //         const plusBtn = document.querySelector(
      //           `.quantity-btn.plus[data-dish-id="${dishId}"]`
      //         );
      //         const addBtn = document.querySelector(
      //           `.add-to-cart-btn[data-dish-id="${dishId}"]`
      //         );

      //         minusBtn.disabled = newQuantity <= 0;
      //         plusBtn.disabled = newQuantity >= 20;

      //         if (newQuantity > 0) {
      //           addBtn.disabled = false;
      //           addBtn.classList.remove("bg-gray-300", "text-gray-500");
      //           addBtn.classList.add("bg-primary", "text-white");
      //         } else {
      //           addBtn.disabled = true;
      //           addBtn.classList.remove("bg-primary", "text-white");
      //           addBtn.classList.add("bg-gray-300", "text-gray-500");
      //         }

      //     });
      //   });

      function attachQuantityListeners() {
  const quantityButtons = document.querySelectorAll(".quantity-btn");

  quantityButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const dishId = this.dataset.dishId;
      const display = document.querySelector(
  `.quantity-display[data-dish-id="${dishId}"]`
);

      const isPlus = this.classList.contains("plus-btn");


      let currentQuantity = parseInt(display.textContent) || 0;
      let newQuantity = isPlus
        ? Math.min(currentQuantity + 1, 20)
        : Math.max(currentQuantity - 1, 0);

      // update DOM
      display.textContent = newQuantity;
    
      const addBtn = document.querySelector(
  `.add-to-cart-btn[data-dish-id="${dishId}"]`
);

if (newQuantity > 0) {
  addBtn.disabled = false; // enable button
  addBtn.classList.remove("bg-gray-300", "text-gray-500"); // remove disabled styles
  addBtn.classList.add("bg-primary", "text-white"); // make it look active
} else {
  addBtn.disabled = true; // disable button if no items
  addBtn.classList.remove("bg-primary", "text-white");
  addBtn.classList.add("bg-gray-300", "text-gray-500");
}



      // find dish info
      const dish = dishData[currentCategory].find(d => d.id == dishId);

      // call backend
      updateCart(dish.id, dish.name, dish.price, dish.image, newQuantity);

      // feedback message
      if (newQuantity > currentQuantity && isPlus) {
        showSnackbar(`Added 1 ${dish.name} to cart`);
      } else if (newQuantity < currentQuantity && !isPlus) {
        showSnackbar(`Removed 1 ${dish.name} from cart`);
      }

      // toggle button states
      const minusBtn = document.querySelector(
        `.quantity-btn.minus[data-dish-id="${dishId}"]`
      );
      const plusBtn = document.querySelector(
        `.quantity-btn.plus[data-dish-id="${dishId}"]`
      );
       addBtn = document.querySelector(
        `.add-to-cart-btn[data-dish-id="${dishId}"]`
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
    });
  });
}



        // document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
        //   btn.addEventListener("click", function () {
        //     if (this.disabled) return;
        //     const dishId = this.dataset.dishId;
        //     const dish = dishData[currentCategory].find(d => d.id == dishId);
        //     const quantity = tempQuantities[dishId] || 0;

        //     updateCart(dish.id, dish.name, dish.price, dish.image, quantity);

        //     if (quantity > 0) {
        //       showSnackbar(`${dish.name} quantity set to ${quantity}`);
        //     }
        //   });
        // });
      
document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    if (this.disabled) return;
    const dishId = this.dataset.dishId;
    const dish = dishData[currentCategory].find(d => d.id == dishId);
  const qtyDisplay = document.querySelector(
  `.quantity-display[data-dish-id="${dishId}"]`
);

    const quantity = parseInt(qtyDisplay.textContent) || 0;

    updateCart(dish.id, dish.name, dish.price, dish.image, quantity);

    if (quantity > 0) {
      showSnackbar(`${dish.name} quantity set to ${quantity}`);
    }
  });
});

     
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
    document.addEventListener("DOMContentLoaded", async function () {
  loadDishes("tiffin");

  try {
    const res = await fetch('/cart/count');
    const data = await res.json();
    updateCartCountDisplay(data.count);
  } catch {
    updateCartCountDisplay(0);
  }

  document.getElementById("cart-button").addEventListener("click", function () {
    window.location.href = "/checkout";
  });
});
