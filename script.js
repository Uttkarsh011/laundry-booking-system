(function () {
    if (typeof emailjs !== 'undefined') {
        emailjs.init("YOUR_PUBLIC_KEY");
    }
})();

const services = [
    { id: 1, name: "Dry Cleaning", price: 200.00, icon: "👕" },
    { id: 2, name: "Wash & Fold", price: 100.00, icon: "🧺" },
    { id: 3, name: "Ironing", price: 30.00, icon: "🥌" },
    { id: 4, name: "Stain Removal", price: 500.00, icon: "✨" },
    { id: 5, name: "Leather & Suede Cleaning", price: 999.00, icon: "🧥" },
    { id: 6, name: "Wedding Dress Cleaning", price: 2800.00, icon: "👗" }
];

let cart = [];

const serviceListContainer = document.getElementById("service-list");
const cartTableBody = document.getElementById("cart-table-body");
const totalAmountElement = document.getElementById("total-amount");
const bookingForm = document.getElementById("booking-form");
const bookingStatusMsg = document.getElementById("booking-status-msg");
const scrollToBookingBtn = document.getElementById("scroll-to-booking");
const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const navLinks = document.getElementById("nav-links");
const newsletterForm = document.getElementById("newsletter-form");
const newsletterStatusMsg = document.getElementById("newsletter-status-msg");

// Smooth scroll to booking section
if (scrollToBookingBtn) {
    scrollToBookingBtn.addEventListener("click", () => {
        document.getElementById("booking-section").scrollIntoView({ behavior: "smooth" });
    });
}

// Mobile Navbar Drawer Toggle
if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });

    document.querySelectorAll(".nav-links a").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
        });
    });
}

// Render Service Items in Catalog
function renderServices() {
    serviceListContainer.innerHTML = "";
    services.forEach(service => {
        const isAdded = cart.some(item => item.id === service.id);
        const itemDiv = document.createElement("div");
        itemDiv.className = "service-item";

        itemDiv.innerHTML = `
            <div class="service-meta">
                <span class="service-icon">${service.icon}</span>
                <span class="service-title">${service.name}</span>
                <span class="service-price">₹${service.price.toFixed(2)}</span>
            </div>
            <button class="action-btn ${isAdded ? 'remove-btn' : 'add-btn'}" onclick="toggleCart(${service.id})">
                ${isAdded ? 'Remove Item <i class="fa-solid fa-circle-minus"></i>' : 'Add Item <i class="fa-solid fa-circle-plus"></i>'}
            </button>
        `;
        serviceListContainer.appendChild(itemDiv);
    });
}

// Add / Remove item logic
function toggleCart(serviceId) {
    const existingIndex = cart.findIndex(item => item.id === serviceId);
    if (existingIndex > -1) {
        cart.splice(existingIndex, 1);
    } else {
        const selected = services.find(item => item.id === serviceId);
        cart.push(selected);
    }
    renderServices();
    renderCart();
}

// Render Cart Table & Total Price Calculation
function renderCart() {
    cartTableBody.innerHTML = "";
    if (cart.length === 0) {
        cartTableBody.innerHTML = `<tr><td colspan="4" class="text-center">No added items</td></tr>`;
        totalAmountElement.textContent = "₹0.00";
        return;
    }

    let total = 0;
    cart.forEach((item, index) => {
        total += item.price;
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.name}</td>
            <td>₹${item.price.toFixed(2)}</td>
            <td class="text-center">
                <button class="cart-remove-btn" onclick="toggleCart(${item.id})" title="Remove item from cart">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </td>
        `;
        cartTableBody.appendChild(tr);
    });

    totalAmountElement.textContent = `₹${total.toFixed(2)}`;
}

// Handle Appointment Booking Submission
if (bookingForm) {
    bookingForm.addEventListener("submit", function (e) {
        e.preventDefault();

        if (cart.length === 0) {
            bookingStatusMsg.style.color = "#ef4444";
            bookingStatusMsg.textContent = "Please add at least one service to your cart before booking!";
            return;
        }

        const name = document.getElementById("fullName").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();

        // Validate 10-digit phone number
        const cleanPhone = phone.replace(/\D/g, '');
        if (cleanPhone.length < 10) {
            bookingStatusMsg.style.color = "#ef4444";
            bookingStatusMsg.textContent = "Please enter a valid 10-digit phone number!";
            return;
        }

        const orderDetails = cart.map(item => `${item.name} (₹${item.price})`).join(", ");
        const totalAmount = totalAmountElement.textContent;

        const templateParams = {
            to_name: name,
            to_email: email,
            phone_number: phone,
            order_details: orderDetails,
            total_amount: totalAmount
        };

        const showSuccess = function () {
            bookingStatusMsg.style.color = "#16a34a";
            bookingStatusMsg.textContent = "Thank you for booking our service! We will contact you soon.";
            resetOrder();
            setTimeout(() => {
                bookingStatusMsg.textContent = "";
            }, 6000);
        };

        if (typeof emailjs !== 'undefined') {
            emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", templateParams)
                .then(showSuccess)
                .catch(function (error) {
                    console.log("EmailJS note:", error);
                    showSuccess();
                });
        } else {
            showSuccess();
        }
    });
}

// Reset Form & Cart Order
function resetOrder() {
    cart = [];
    bookingForm.reset();
    renderServices();
    renderCart();
}

// Newsletter Subscription Handler
if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const nameInput = document.getElementById("newsletter-name");
        const name = nameInput ? nameInput.value.trim() : "";

        if (newsletterStatusMsg) {
            newsletterStatusMsg.style.color = "#ffffff";
            newsletterStatusMsg.textContent = `Thank you for subscribing, ${name || 'friend'}! 🎉`;
            newsletterForm.reset();

            setTimeout(() => {
                newsletterStatusMsg.textContent = "";
            }, 5000);
        }
    });
}

// Initialize rendering on DOM load
renderServices();
renderCart();