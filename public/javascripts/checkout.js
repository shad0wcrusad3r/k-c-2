let locationVerified = false;

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
  
  function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}


  function updatePricing() {
  let subtotal = 0;
  
  document.querySelectorAll("#cartItems > div").forEach(el => {
    const priceText = el.querySelector(".text-lg").textContent.replace("₹", "").trim();
    const qtyText = el.querySelector(".w-8.text-center").textContent.trim();
    const price = parseFloat(priceText);
    const qty = parseInt(qtyText);
    subtotal += price * qty;
  });

  //let deliveryFee = 50;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const userLat = position.coords.latitude;
      const userLon = position.coords.longitude;

      const storeLat = 15.441994671540293;
      const storeLon = 74.99771993403606;

      const distance = haversine(userLat, userLon, storeLat, storeLon);
      const deliveryFee = distance <= 2.5 ? 50 : 100;

      locationVerified = true;
      document.getElementById("confirmBtn").disabled = false; // enable confirm
      applyPricing(subtotal, deliveryFee, distance);
    }, () => {
      // Denied: lock checkout
      locationVerified = false;
      document.getElementById("confirmBtn").disabled = true;
      document.getElementById("deliveryResult").innerText =
        "⚠️ Location access required to proceed with checkout.";
    });
  } else {
    locationVerified = false;
    document.getElementById("confirmBtn").disabled = true;
    document.getElementById("deliveryResult").innerText =
      "⚠️ Your device does not support location services.";
  }
}

function applyPricing(subtotal, deliveryFee, distance) {
  const total = subtotal + deliveryFee;
  console.log(deliveryFee)
  const { difference: roundOffDiff, displayTotal } = calculateRoundOff(total);

  document.getElementById("subtotal").textContent = `₹ ${subtotal.toFixed(2)}`;
  document.getElementById("total").textContent = `₹ ${total.toFixed(2)}`;
  document.getElementById("codAmount").textContent = `₹ ${displayTotal}`;
  // document.getElementById("codRoundOff").textContent = `(+${roundOffDiff} round-off)`;

    document.getElementById("deliveryFee").textContent = `₹ ${deliveryFee.toFixed(2)}`;

    // Optional: show distance
  if (distance !== null) {
    document.getElementById("deliveryNote").textContent =
      `You are ${distance.toFixed(2)} km away`;
  }
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
        upi: `upi://pay?pa=8553970096@ybl&pn=KulkarniFoods&am=${totalAmount}&cu=INR`,
      };
      
      if (upiLinks[app]) {
        window.location.href = upiLinks[app];
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment processing failed. Please try again.");
    }
  }

  
  async function confirmOrder() {
const cartItems = document.querySelectorAll("#cartItems > div");
if (cartItems.length === 0) {
  alert("Your cart is empty.");
  return;
}
if (!locationVerified) {
    alert("Please enable location access to continue with your order.");
    updatePricing(); // try again
    return;
  }

  const orderDate = document.getElementById("orderDate").value.trim();

  if (!orderDate) {
    alert("Please enter the Order Date before confirming.");
    return;
  }

  const loadingOverlay = document.getElementById("loadingOverlay");
  const backBtn = document.getElementById("backBtn");
  const confirmBtn = document.getElementById("confirmBtn");

  loadingOverlay.classList.remove("hidden");
  backBtn.disabled = true;
  confirmBtn.disabled = true;

  const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value;
  const cookingRequest = document.getElementById("cookingRequest").value.trim();


  if (!paymentMethod) {
    alert("Please select a payment method.");
    loadingOverlay.classList.add("hidden");
    backBtn.disabled = false;
    confirmBtn.disabled = false;
    return;
  }

  const date = new Date(orderDate);
  const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;

let body = { paymentMethod, cookingRequest, orderDate: formattedDate };
console.log("Payment method sent:", paymentMethod);
console.log("Cooking Request:", cookingRequest, "Date:", formattedDate);
console.log("Payment method sent:", paymentMethod);


  try {
    const res = await fetch("/checkout/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const data = await res.json();

    if (data.success) {
      waitForClientResponse(data.orderId); 
    } else {
       loadingOverlay.classList.add("hidden");
      alert(data.error || "Failed to confirm order.");
    }
  } catch (err) {
    loadingOverlay.classList.add("hidden");
    alert("Error: " + err.message);
  }
}

async function waitForClientResponse(orderId) {
  const res = await fetch(`/checkout/status/${orderId}?_=${Date.now()}`);
  const loadingOverlay = document.getElementById("loadingOverlay");
  const backBtn = document.getElementById("backBtn");

  const interval = setInterval(async () => {
    try {
      const res = await fetch(`/checkout/status/${orderId}?_=${Date.now()}`, {
      credentials: "include"
    });

      const data = await res.json();

      if (data.clientResponse !== 'Pending') {
        clearInterval(interval);
        loadingOverlay.classList.add("hidden");
        backBtn.disabled = false;

        if (data.clientResponse === 'Accepted') {
          const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value;
          if (paymentMethod === 'upi') {
            document.getElementById("upiPayBtn").style.display = "block";
            document.getElementById("continueOrderingBtn").disabled = true;
          }
          document.getElementById("successModal").classList.remove("hidden");

          // Disable back and refresh
          history.pushState(null, null, location.href);
          window.onpopstate = function () {
            history.go(1);
          };
          window.onbeforeunload = () => true;

        } else {
          showRejectModal();
        }
      }
    } catch (err) {
      console.error("Error polling:", err);
      backBtn.disabled = false;
    }
  }, 3000); // check every 3s
}


function showRejectModal() {
  document.getElementById("rejectModal").classList.remove("hidden");
  const confirmBtn = document.getElementById("confirmBtn");
  confirmBtn.disabled = false;
}  

function closeRejectModal() {
  document.getElementById("rejectModal").classList.add("hidden");
  window.location.href = "/home";
}

function continueShopping() {
    document.getElementById("successModal").classList.add("hidden");
    window.location.href = "/home";
  }

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    const continueBtn = document.getElementById("continueOrderingBtn");
    if (continueBtn && continueBtn.disabled) {
      continueBtn.disabled = false;
    }
  }
});

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