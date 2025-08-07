// Add this at the top of the file
let currentCategory = 'tiffin'; // Default category
let tempQuantities = {}; // Store quantities before adding to cart

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
      return true;
    }
  } catch (err) {
    console.error("Failed to update cart:", err);
  }
  return false;
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

function updateQuantityDisplays() {
  document.querySelectorAll(".quantity-display").forEach((display) => {
    const dishId = display.dataset.dishId;
    const quantity = parseInt(display.textContent) || 0;

    const minusBtn = document.querySelector(
      `.quantity-btn.minus[data-dish-id="${dishId}"]`
    );
    const plusBtn = document.querySelector(
      `.quantity-btn.plus[data-dish-id="${dishId}"]`
    );
    const addBtn = document.querySelector(
      `.add-to-cart-btn[data-dish-id="${dishId}"]`
    );

    if (minusBtn) {
      const isInCart = display.dataset.isInCart === "true";
      minusBtn.disabled = !isInCart || quantity <= 0;
    }
    if (plusBtn) plusBtn.disabled = quantity >= 20;
    
    if (addBtn) {
      if (quantity > 0) {
        addBtn.disabled = false;
        addBtn.classList.remove("bg-gray-300", "text-gray-500");
        addBtn.classList.add("bg-primary", "text-white");
      } else {
        addBtn.disabled = true;
        addBtn.classList.remove("bg-primary", "text-white");
        addBtn.classList.add("bg-gray-300", "text-gray-500");
      }
    }
  });
}

function attachQuantityListeners() {
  document.querySelectorAll(".quantity-btn").forEach((btn) => {
    btn.addEventListener("click", function() {
      const dishId = this.dataset.dishId;
      const isPlus = this.classList.contains("plus");
      const display = document.querySelector(
        `.quantity-display[data-dish-id="${dishId}"]`
      );
      
      let currentQuantity = tempQuantities[dishId].quantity || 0;
      let newQuantity = isPlus 
        ? Math.min(currentQuantity + 1, 20)
        : Math.max(currentQuantity - 1, 0);

      // Update display
      display.textContent = newQuantity;
      tempQuantities[dishId].quantity = newQuantity;

      const category = Object.keys(dishData).find(cat => 
        dishData[cat].some(dish => dish.id == dishId)
      );
      const dish = dishData[category].find(d => d.id == dishId);

      const isInCart = tempQuantities[dishId].isInCart;

      if (!isPlus && isInCart) {
        // If minus is clicked and the item is in the cart, update the cart directly
        updateCart(dishId, dish.name, dish.price, dish.image, newQuantity);
        showSnackbar(`Removed 1 ${dish.name} from cart`);
      }

      // Update button states
      updateQuantityDisplays();
    });
  });

  document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
    btn.addEventListener("click", async function() {
      if (this.disabled) return;
      const dishId = this.dataset.dishId;
      const quantity = tempQuantities[dishId].quantity || 0;
      const category = Object.keys(dishData).find(cat => 
        dishData[cat].some(dish => dish.id == dishId)
      );
      const dish = dishData[category].find(d => d.id == dishId);
      
      // Update cart
      const success = await updateCart(dishId, dish.name, dish.price, dish.image, quantity);

      if (success) {
        showSnackbar(`${quantity} ${dish.name}(s) added to cart`);
        tempQuantities[dishId].isInCart = true;
        updateQuantityDisplays();
      }
    });
  });
}

// Menu and category drawer functionality remains the same
document.addEventListener("DOMContentLoaded", async function() {
  // Initialize with default category
  loadDishes(currentCategory);

  // Load cart count
  try {
    const res = await fetch('/cart/count');
    const data = await res.json();
    updateCartCountDisplay(data.count);
  } catch (err) {
    console.error("Error loading cart count:", err);
    updateCartCountDisplay(0);
  }

  // Initialize tempQuantities for all dishes
  for (const category in dishData) {
    dishData[category].forEach(dish => {
      tempQuantities[dish.id] = {
        quantity: 0,
        isInCart: false
      };
    });
  }

  // Load cart items and update quantities
  try {
    const resCart = await fetch('/cart/items');
    const dataCart = await resCart.json();
    dataCart.items.forEach(item => {
      if (tempQuantities[item.dishId]) {
        tempQuantities[item.dishId].quantity = item.quantity;
        tempQuantities[item.dishId].isInCart = true;
      }
    });
    loadDishes(currentCategory);
  } catch (err) {
    console.error("Error loading cart items:", err);
  }

  // Cart button
  document.getElementById("cart-button").addEventListener("click", function() {
    window.location.href = "/checkout";
  });

  // Menu toggle
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

  // Category items
  document.querySelectorAll(".category-item").forEach((item) => {
    item.addEventListener("click", function() {
      currentCategory = this.dataset.category;
      document.getElementById("current-category").textContent =
        currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1);
      loadDishes(currentCategory);
      closeMenu();
    });
  });

  // Navigation links
  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", function(e) {

      const target = this.dataset.nav;

      //If the link has no data-nav, skip all JS handling
      if (!target) return;
      e.preventDefault();
      closeMenu();
      
      setTimeout(() => {
        if (target === "profile") {
          window.location.href = "/profile";
        } else if (target === "checkout") {
          window.location.href = "/checkout";
        }
      }, 100);
    });
  });

  // Category drawer
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
    option.addEventListener("click", function() {
      currentCategory = this.dataset.category;
      document.getElementById("current-category").textContent =
        currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1);
      loadDishes(currentCategory);
      closeCategoryDrawer();
    });
  });
});

// Dish data and loadDishes function remains the same
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
            price: 45,
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
            price: 45,
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
            price: 50,
            image:
              "https://t4.ftcdn.net/jpg/02/92/92/59/360_F_292925962_xka6iNTlEW5ANZkpE5el3HP8WeWi0O5o.jpg",
          },

          {
            id: 9,
            name: "Thatte Idli",
            description: "Soft, plate-sized steamed rice cakes served with chutney and sambar.",
            price: 45,
            image:
              "https://as2.ftcdn.net/jpg/02/95/02/23/1000_F_295022362_VaJRToqaT47SDSw78YXjW9WSq7SJLAvg.jpg",
          },
          
            {
            id: 10,
            name: "Shavige Upittu",
            description: "Light and fluffy vermicelli upma served with flavorful chutney.",
            price: 45,
            image:
              "https://img.freepik.com/premium-photo/semiya-upma-vermicelli-uppuma-uppittu-is-popular-breakfast-menu-from-south-india-served-bowl-selective-focus_466689-52556.jpg",
          },

            {
            id: 11,
            name: "Plain Shira",
            description: "Sweet semolina dessert flavored with ghee, cardamom, and garnished with nuts.",
            price: 35,
            image:
              "https://as2.ftcdn.net/v2/jpg/05/36/52/03/1000_F_536520382_ewDjdnmRgngxKNCmaNoF4z2hFRVL41hp.jpg",
          },

          {
            id: 12,
            name: "Pineapple Shira",
            description: "Rich and fragrant semolina dessert infused with pineapple chunks and ghee-roasted nuts.",
            price: 40,
            image:
              "https://img.freepik.com/premium-photo/pineapple-sheera-halwa-also-known-as-ananas-keshri-shira-popular-south-indian-dessert-recipe-selective-focus_466689-42174.jpg",
          },

        ],
        meals: [
          {
            id: 13,
            name: "Full meals",
            description: "Complete meal with roti(or chapati), spiced bhaji, rice, sambar, chutney, and curd",
            price: 120,
            image:
              "https://img.freepik.com/premium-photo/indian-thali-food-plate-served-with-vegetables-rice-roti_960396-351006.jpg",
          },
           
          {
            id: 14,
            name: "Baleyele oota",
            description: "Traditional South Indian meal served on a banana leaf with chutney, kosambari, payasam, rice with saaru, holige, chitranna, bhaji/ambode, palya, and refreshing majjige.",
            price: 300,
            image:
              "https://media.istockphoto.com/id/1131334347/photo/banana-leaf-rice.jpg?s=612x612&w=0&k=20&c=hg_f4RU_ZgTQ-Z3Y0FkNk041CN5l2z2-kQOivxRZdqc=",
          },

          {
            id: 15,
            name: "Jolad Rotti Oota",
            description: "North Karnataka-style meal with jolad rotti, yengai palya, kalu palya, jhunka vadi, spicy chutney, rice, and sambar",
            price: 150,
            image:
              "https://i.ytimg.com/vi/AeF7P2DmF7w/maxresdefault.jpg",
          },

           {
            id: 16,
            name: "North Indian meals",
            description: "A wholesome platter with soft phulkas, paneer sabzi, jeera rice, and flavorful dal.",
            price: 200,
            image:
              "https://res.cloudinary.com/hz3gmuqw6/image/upload/c_fill,q_auto,w_750/f_auto/North-Indian-food-phpUPkVj5",
          },

          {
            id: 17,
            name: "Bisibelebath and Curd rice",
            description: "A hearty, spicy rice-lentil dish served with crunchy khara boondi and soothing curd rice.",
            price:90,
            image:
              "https://www.spiceupthecurry.com/wp-content/uploads/2018/02/bisi-bele-bath-recipe-1-480x270.jpg",
          },

           {
            id: 18,
            name: "Fried rice",
            description: "Flavorful stir-fried rice tossed with vegetables and aromatic spices.",
            price:60,
            image:
              "https://t4.ftcdn.net/jpg/07/17/44/89/360_F_717448989_HWlaGedVcxvHf4gQA7SJT28jqD9L21my.jpg",
          },

          {
            id: 19,
            name: "Pongal",
            description: "Creamy South Indian rice and moong dal dish seasoned with ghee, pepper, and cashews.",
            price:60,
            image:
              "https://t3.ftcdn.net/jpg/11/77/67/32/360_F_1177673270_xeT7eJwTwpdTUKhU7TFlChQRciKMtQT7.jpg",
          },

          {
            id: 20,
            name: "Jeera rice with daal",
            description: " Fragrant cumin-flavored rice served with warm and spiced dal.",
            price:70,
            image:
              "https://media.istockphoto.com/id/1265653380/photo/indian-traditional-food-mung-dal-tadka-curry-with-jeera-rice.jpg?s=612x612&w=0&k=20&c=3NcU9wm6DbgoLns8bRD7fCGOFRqr5dO_gRQdJM3YirY=",
          },


        ],
        snacks: [
          
          {
            id: 21,
            name: "Pav Bhaji",
            description: "Buttery buns served with spicy mashed vegetable curry",
            price: 80,
            image:
              "https://t3.ftcdn.net/jpg/05/26/67/36/360_F_526673624_MWQkxo3etLNTQbyfJpeBhoRlF4jTOS8H.jpg",
          },

          {
            id: 22,
            name: "Onion Pakoda",
            description: "Crispy fritters made from sliced onions and gram flour served with chutney",
            price: 40,
            image:
              "https://t3.ftcdn.net/jpg/01/13/79/54/360_F_113795471_ukz1BnlzctUcMOapQY5cdI7WFtEd0zfl.jpg",
          },

          {
            id: 23,
            name: "Bonda Soup",
            description: "Soft lentil fritters served in a lightly spiced moong dal soup",
            price: 50,
            image:
              "https://i0.wp.com/blog.food-filment.com/wp-content/uploads/2015/12/img_5911-2.jpg?fit=1200%2C800&ssl=1",
          },

          {
            id: 24,
            name: "Mirchi",
            description: "Deep-fried green chilies stuffed with spiced filling, coated in gram flour batter",
            price: 50,
            image:
              "https://etvbharatimages.akamaized.net/etvbharat/prod-images/05-05-2025/1200-675-24095711-thumbnail-16x9-bajji.jpg",
          },

          {
            id: 25,
            name: "Girmit",
            description: "Spicy puffed rice mix tossed with onions, tomatoes, and tamarind",
            price: 45,
            image:
              "https://vegrecipesofkarnataka.com/assets/img/girmit/girmit-recipe14.jpg",
          },

          {
            id: 26,
            name: "Sabudana Vada",
            description: "Crispy sago and potato patties, mildly spiced and deep-fried",
            price: 40,
            image:
              "https://t4.ftcdn.net/jpg/12/94/53/55/360_F_1294535567_BwTnRxufHYcD9afbGVou5q0YGSWw3B7o.jpg",
          },

          {
            id: 27,
            name: "Samosa",
            description: "Crispy pastry filled with spiced potato and peas",
            price: 65,
            image:
              "https://t4.ftcdn.net/jpg/15/15/56/93/360_F_1515569353_OLObh6cpKVZ6hNmuZdvlU298U2XpBCaE.jpg",
          },
          {
            id: 28,
            name: "Misal pav",
            description: "Spicy sprouted curry topped with farsan, onions, and lemon, served with soft pav.",
            price: 75,
            image:
              "https://t4.ftcdn.net/jpg/08/45/66/41/360_F_845664148_xd3D705vLEYhTXZpNU9YlQ2V1HrQ7PBu.jpg",
          },

            {
            id: 29,
            name: "aalu bonda with chutney",
            description: "Deep-fried snack with a spicy mashed potato filling encased in a crispy gram flour batter served with chutney.",
            price:40,
            image:
              "https://as1.ftcdn.net/jpg/01/15/66/10/1000_F_115661056_yWvwLXrdjhhcW8n2JCIdR4jBOzIMTYkI.jpg",
          },

        ],
};

function loadDishes(category) {
const dishGrid = document.getElementById("dish-grid");
  const dishes = dishData[category] || [];
  
  dishGrid.innerHTML = dishes.map(dish => `
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
            <button class="quantity-btn minus w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center" data-dish-id="${dish.id}">
              <i class="ri-subtract-line text-sm"></i>
            </button>
            <span class="quantity-display font-semibold text-gray-800 min-w-[2rem] text-center" data-dish-id="${dish.id}">0</span>
            <button class="quantity-btn plus w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center" data-dish-id="${dish.id}">
              <i class="ri-add-line text-sm"></i>
            </button>
          </div>
          <button class="add-to-cart-btn bg-gray-300 text-gray-500 px-4 py-2 rounded-button font-medium whitespace-nowrap" data-dish-id="${dish.id}" disabled>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  `).join("");

  // Initialize temp quantities
  dishes.forEach(dish => {
    if (!tempQuantities[dish.id]) {
      tempQuantities[dish.id] = {
        quantity: 0,
        isInCart: false
      };
    }
    const display = document.querySelector(`.quantity-display[data-dish-id="${dish.id}"]`);
    if (display) {
      display.textContent = tempQuantities[dish.id].quantity;
      display.dataset.isInCart = tempQuantities[dish.id].isInCart;
    }
  });

  attachQuantityListeners();
  updateQuantityDisplays();
}