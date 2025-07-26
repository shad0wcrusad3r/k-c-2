const cartData = {
    pizza1: { name: "Margherita Pizza", price: 299, quantity: 2 },
    salad1: { name: "Caesar Salad", price: 189, quantity: 1 },
    pasta1: { name: "Pasta Carbonara", price: 349, quantity: 1 },
  };

  function updateQuantity(itemId, change) {
    const item = cartData[itemId];
    if (!item) return;
    
    const newQuantity = item.quantity + change;
    if (newQuantity < 1) {
      if (confirm("Remove this item from cart?")) {
        delete cartData[itemId];
        document.querySelector(`#qty-${itemId}`).closest(".bg-white").remove();
        updatePricing();
      }
      return;
    }
    
    item.quantity = newQuantity;
    document.getElementById(`qty-${itemId}`).textContent = newQuantity;
    updatePricing();
  }

  function calculateRoundOff(total) {
    const roundedAmount = Math.ceil(total);
    return {
      difference: (roundedAmount - total).toFixed(2),
      displayTotal: roundedAmount.toFixed(2)
    };
  }

  function updatePricing() {
    let subtotal = 0;
    Object.values(cartData).forEach((item) => {
      subtotal += item.price * item.quantity;
    });
    
    const deliveryFee = 49;
    const taxRate = 0.1043;
    const tax = subtotal * taxRate;
    const total = subtotal + deliveryFee + tax;
    const { difference: roundOffDiff, displayTotal } = calculateRoundOff(total);

    // Update all price displays
    document.getElementById("subtotal").textContent = `₹ ${subtotal.toFixed(2)}`;
    document.getElementById("tax").textContent = `₹ ${tax.toFixed(2)}`;
    document.getElementById("total").textContent = `₹ ${displayTotal}`;
    document.getElementById("codAmount").textContent = `₹ ${displayTotal}`;
    
    // Update round-off displays using specific IDs
    document.getElementById("orderSummaryRoundOff").textContent = `(+${roundOffDiff} round-off)`;
    document.getElementById("codRoundOff").textContent = `(+${roundOffDiff} round-off)`;
  }

  // Initialize pricing on load
  document.addEventListener('DOMContentLoaded', updatePricing);
  
  function handlePaymentMethodChange(method) {
    document.getElementById("upiOptions").style.display =
      method === "upi" ? "grid" : "none";
  }

  function handleUPIPayment(app) {
    try {
      const totalAmount = parseFloat(document.getElementById("total").textContent.replace('₹ ', ''));
      const upiLinks = {
        gpay: `upi://pay?pa=merchant@gpay&pn=Store&am=${totalAmount}&cu=INR`,
        phonepe: `phonepe://pay?pa=merchant@phonepe&pn=Store&am=${totalAmount}&cu=INR`,
        paytm: `paytm://pay?pa=merchant@paytm&pn=Store&am=${totalAmount}&cu=INR`,
      };
      
      if (upiLinks[app]) {
        window.location.href = upiLinks[app];
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment processing failed. Please try again.");
    }
  }

  function confirmOrder() {
    const loadingOverlay = document.getElementById("loadingOverlay");
    const successModal = document.getElementById("successModal");
    loadingOverlay.classList.remove("hidden");
    setTimeout(() => {
      loadingOverlay.classList.add("hidden");
      successModal.classList.remove("hidden");
    }, 2000);
  }

  function continueShopping() {
    document.getElementById("successModal").classList.add("hidden");
    window.location.href = "home.html";
  }

  function goBack() {
    window.history.back();
  }

  // Address Management
  let addressData = {
    type: "Home",
    fullName: "John Smith",
    street: "123 Oak Street, Downtown District",
    city: "New York",
    pincode: "10001",
  };

  function toggleAddressType() {
    const dropdown = document.getElementById("addressTypeDropdown");
    const button = document.querySelector("#selectedType").parentElement;
    if (!dropdown.classList.contains("hidden")) {
      dropdown.classList.add("hidden");
      return;
    }
    
    const rect = button.getBoundingClientRect();
    dropdown.style.position = "absolute";
    dropdown.style.top = `${rect.bottom}px`;
    dropdown.style.left = `${rect.left}px`;
    dropdown.style.width = `${rect.width}px`;
    
    dropdown.classList.remove("hidden");
    document.addEventListener("click", closeDropdownOnClickOutside);
  }

  function closeDropdownOnClickOutside(event) {
    const dropdown = document.getElementById("addressTypeDropdown");
    const button = document.querySelector("#selectedType").parentElement;
    
    if (!dropdown.contains(event.target) && !button.contains(event.target)) {
      dropdown.classList.add("hidden");
      document.removeEventListener("click", closeDropdownOnClickOutside);
    }
  }

  function selectAddressType(type) {
    document.getElementById("selectedType").textContent = type;
    document.getElementById("addressTypeDropdown").classList.add("hidden");
    addressData.type = type;
  }

  function toggleAddressEdit() {
    const formEl = document.getElementById("addressEditForm");
    const isEditing = formEl.classList.contains("hidden");
    
    if (isEditing) {
      document.getElementById("fullName").value = addressData.fullName;
      document.getElementById("street").value = addressData.street;
      document.getElementById("city").value = addressData.city;
      document.getElementById("pincode").value = addressData.pincode;
      formEl.classList.remove("hidden");
    } else {
      formEl.classList.add("hidden");
    }
  }

  function saveAddress() {
    const fullName = document.getElementById("fullName").value.trim();
    const street = document.getElementById("street").value.trim();
    const city = document.getElementById("city").value.trim();
    const pincode = document.getElementById("pincode").value.trim();

    if (!fullName || !street || !city || !pincode) {
      const errorModal = document.createElement("div");
      errorModal.className =
        "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";
      errorModal.innerHTML = `
        <div class="bg-white rounded-lg p-6 mx-4 max-w-sm w-full">
          <p class="text-red-600 font-medium mb-4">Please fill in all fields</p>
          <button class="w-full bg-primary text-white py-2 rounded-button font-medium" onclick="this.parentElement.parentElement.remove()">
            OK
          </button>
        </div>
      `;
      document.body.appendChild(errorModal);
      return;
    }

    if (!/^\d{6}$/.test(pincode)) {
      alert("Please enter a valid 6-digit pincode");
      return;
    }

    addressData = {
      type: addressData.type,
      fullName,
      street,
      city,
      pincode,
    };
    
    document.getElementById("savedAddress").innerHTML =
      `${street}<br>${city}, ${pincode}`;
    document.getElementById("addressEditForm").classList.add("hidden");
    
    localStorage.setItem("deliveryAddress", JSON.stringify(addressData));
  }

  // Initialize on page load
  document.addEventListener("DOMContentLoaded", () => {
    updatePricing(); // Ensure pricing is calculated initially
    
    const savedAddress = localStorage.getItem("deliveryAddress");
    if (savedAddress) {
      try {
        addressData = JSON.parse(savedAddress);
        document.getElementById("selectedType").textContent = addressData.type;
        document.getElementById("savedAddress").innerHTML =
          `${addressData.street}<br>${addressData.city}, ${addressData.pincode}`;
      } catch (e) {
        console.error("Error loading address:", e);
      }
    }
  });