// ================== CONSTANTS ==================
const API_BASE_USERS = "http://localhost:8080/api/users";
const API_BASE_VEHICLES = "http://localhost:8080/api/vehicles";

// ================== TOKEN HELPERS ==================
function getToken() {
    return localStorage.getItem("token");
}

function clearToken() {
    localStorage.removeItem("token");
}

// ================== NAVIGATION FUNCTIONS ==================
function scheduleInspection() {
    window.location.href = '/Frontend/pages/test-ins.html';
}

function viewListings() {
    window.location.href = '/Frontend/pages/my-listings.html';
}

function viewProfile() {
    // You can implement profile modal here or redirect to profile page
    alert("Profile functionality not implemented in this page");
}

function logout() {
    if (confirm("Are you sure you want to logout?")) {
        clearToken();
        window.location.href = "/Frontend/index.html";
    }
}

// ================== MENU FUNCTIONS ==================
function toggleProfileMenu() {
    const menu = document.getElementById('profileMenu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

function toggleMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('active');
}

// Close profile menu when clicking outside
document.addEventListener('click', function(event) {
    const profileDropdown = document.querySelector('.profile-dropdown');
    const profileMenu = document.getElementById('profileMenu');
    
    if (!profileDropdown.contains(event.target)) {
        profileMenu.style.display = 'none';
    }
});

// ================== LOAD USER PROFILE FOR HEADER ==================
async function loadUserProfile() {
    const token = getToken();
    if (!token) return;

    try {
        const res = await fetch(`${API_BASE_USERS}/me`, {
            method: "GET",
            headers: { "Authorization": "Bearer " + token }
        });
        if (!res.ok) throw new Error("Failed to fetch user info");
        const user = await res.json();

        // Update header display
        const headerName = document.querySelector(".profile-trigger div div:first-child");
        const headerEmail = document.querySelector(".profile-trigger div div:last-child");
        if (headerName) headerName.textContent = `${user.firstName} ${user.lastName}`;
        if (headerEmail) headerEmail.textContent = user.email;

    } catch (err) {
        console.error("Failed to load user profile:", err);
    }
}

// ================== UTILITY FUNCTIONS ==================
function formatPrice(price) {
    if (!price) return "Price not available";
    return new Intl.NumberFormat('en-LK', { 
        style: 'currency', 
        currency: 'LKR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
}

function formatDate(dateString) {
    if (!dateString) return "Date not available";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function getInitials(name) {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
}

// ================== IMAGE SLIDER FUNCTIONS ==================
let currentSlide = 0;
let vehicleImages = [];
let autoSlideInterval;

function initSlider(images) {
    vehicleImages = images;
    const slider = document.querySelector('.slider');
    const dotsContainer = document.querySelector('.slider-dots');
    
    // Clear existing slides and dots
    slider.innerHTML = '';
    dotsContainer.innerHTML = '';
    
    // Create slides and dots
    images.forEach((image, index) => {
        // Create slide
        const slide = document.createElement('div');
        slide.className = 'slide';
        slide.innerHTML = `<img src="${image}" alt="Vehicle image ${index + 1}">`;
        slider.appendChild(slide);
        
        // Create dot
        const dot = document.createElement('div');
        dot.className = `dot ${index === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    // Start auto sliding if more than one image
    if (images.length > 1) {
        startAutoSlide();
    }
}

function goToSlide(index) {
    const slider = document.querySelector('.slider');
    const dots = document.querySelectorAll('.dot');
    
    currentSlide = index;
    slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Update active dot
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
    });
    
    // Reset auto slide timer
    if (vehicleImages.length > 1) {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }
}

function nextSlide() {
    if (vehicleImages.length <= 1) return;
    const next = (currentSlide + 1) % vehicleImages.length;
    goToSlide(next);
}

function prevSlide() {
    if (vehicleImages.length <= 1) return;
    const prev = (currentSlide - 1 + vehicleImages.length) % vehicleImages.length;
    goToSlide(prev);
}

function startAutoSlide() {
    if (vehicleImages.length > 1) {
        autoSlideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }
}

// Pause auto slide when hovering over slider
function setupSliderHover() {
    const sliderContainer = document.querySelector('.slider-container');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', () => {
            clearInterval(autoSlideInterval);
        });
        
        sliderContainer.addEventListener('mouseleave', () => {
            if (vehicleImages.length > 1) {
                startAutoSlide();
            }
        });
    }
}

// ================== LOAD SELLER PROFILE ==================
async function loadSellerProfile(sellerId) {
    const token = getToken();
    if (!token) return null;
    
    try {
        const res = await fetch(`${API_BASE_USERS}/${sellerId}`, {
            method: "GET",
            headers: { "Authorization": "Bearer " + token }
        });
        
        if (!res.ok) throw new Error("Failed to fetch seller info");
        return await res.json();
    } catch (err) {
        console.error("Failed to load seller profile:", err);
        return null;
    }
}

// ================== LOAD VEHICLE DETAILS ==================
async function loadVehicleDetails() {
    const container = document.getElementById("vehicleDetails");
    const urlParams = new URLSearchParams(window.location.search);
    const vehicleId = urlParams.get("id");

    if (!vehicleId) {
        container.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Invalid Vehicle ID</h3>
                <p>No vehicle ID was provided in the URL.</p>
                <a href="index.html" class="back-link">
                    <i class="fas fa-arrow-left"></i> Back to Dashboard
                </a>
            </div>
        `;
        return;
    }

    const token = getToken();
    if (!token) {
        container.innerHTML = `
            <div class="error-message">
                <i class="fas fa-lock"></i>
                <h3>Authentication Required</h3>
                <p>Please login to view vehicle details.</p>
                <a href="/Frontend/index.html" class="back-link">
                    <i class="fas fa-arrow-left"></i> Go to Login
                </a>
            </div>
        `;
        return;
    }

    try {
        const res = await fetch(`${API_BASE_VEHICLES}/approved/${vehicleId}`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            }
        });

        if (!res.ok) throw new Error("Failed to fetch vehicle details");

        const vehicle = await res.json();
        
        // Load seller profile
        const seller = await loadSellerProfile(vehicle.userId);
        
        // Store images for slider
        vehicleImages = vehicle.photos && vehicle.photos.length > 0 ? vehicle.photos : [];

        container.innerHTML = `
            <div class="content-wrapper">
                <div class="vehicle-content">
                    <div class="vehicle-header">
                        <div>
                            <h1 class="vehicle-title">${vehicle.year} ${vehicle.make} ${vehicle.model}</h1>
                            <div class="vehicle-subtitle">
                                <i class="fas fa-map-marker-alt"></i> ${vehicle.city}, ${vehicle.district}, ${vehicle.province}
                            </div>
                        </div>
                        <div class="price">
                            ${formatPrice(vehicle.price)}
                            ${vehicle.negotiable ? '<span class="price-negotiable">Negotiable</span>' : ''}
                        </div>
                    </div>

                    <div class="vehicle-gallery">
                        <div class="slider-container">
                            ${vehicleImages.length > 0 
                                ? `<div class="slider"></div>
                                   <div class="slider-nav">
                                        <button class="slider-btn" onclick="prevSlide()">
                                            <i class="fas fa-chevron-left"></i>
                                        </button>
                                        <button class="slider-btn" onclick="nextSlide()">
                                            <i class="fas fa-chevron-right"></i>
                                        </button>
                                   </div>
                                   <div class="slider-dots"></div>`
                                : `<div class="no-image-placeholder">
                                    <i class="fas fa-image"></i>
                                    <p>No image available</p>
                                   </div>`
                            }
                        </div>
                        
                        ${vehicleImages.length > 1 ? `
                            <div class="thumbnail-gallery">
                                ${vehicleImages.map((photo, index) => 
                                    `<img src="${photo}" alt="Thumbnail ${index + 1}" class="thumbnail ${index === 0 ? 'active' : ''}" onclick="goToSlide(${index})">`
                                ).join('')}
                            </div>
                        ` : ''}
                    </div>

                    <div class="vehicle-details">
                        <div class="details-section">
                            <h3 class="section-title">
                                <i class="fas fa-info-circle"></i> Vehicle Information
                            </h3>
                            <div class="detail-item">
                                <span class="detail-label">Condition</span>
                                <span class="detail-value">${vehicle.condition || 'N/A'}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Body Type</span>
                                <span class="detail-value">${vehicle.bodyType || 'N/A'}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Color</span>
                                <span class="detail-value">${vehicle.color || 'N/A'}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Mileage</span>
                                <span class="detail-value">${vehicle.mileage ? vehicle.mileage.toLocaleString() + ' km' : 'N/A'}</span>
                            </div>
                        </div>

                        <div class="details-section">
                            <h3 class="section-title">
                                <i class="fas fa-cogs"></i> Engine & Performance
                            </h3>
                            <div class="detail-item">
                                <span class="detail-label">Engine</span>
                                <span class="detail-value">${vehicle.engine || 'N/A'}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Transmission</span>
                                <span class="detail-value">${vehicle.transmission || 'N/A'}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Fuel Type</span>
                                <span class="detail-value">${vehicle.fuelType || 'N/A'}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Listed On</span>
                                <span class="detail-value">${formatDate(vehicle.createdAt)}</span>
                            </div>
                        </div>

                        ${vehicle.features && vehicle.features.length > 0 ? `
                            <div class="features-section">
                                <h3 class="section-title">
                                    <i class="fas fa-star"></i> Features & Accessories
                                </h3>
                                <div class="features-grid">
                                    ${vehicle.features.map(feature => `
                                        <div class="feature-item">
                                            <i class="fas fa-check"></i>
                                            <span>${feature}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}
                    </div>

                    ${vehicle.description ? `
                        <div class="description-section">
                            <h3 class="section-title">
                                <i class="fas fa-file-alt"></i> Description
                            </h3>
                            <p>${vehicle.description}</p>
                        </div>
                    ` : ''}
                </div>

                <div class="seller-info">
                    <div class="seller-card">
                        <h3 class="section-title">
                            <i class="fas fa-user"></i> Seller Information
                        </h3>
                        ${seller ? `
                            <div class="seller-profile">
                                <div class="seller-avatar">
                                    ${seller.profilePicture 
                                        ? `<img src="${seller.profilePicture}" alt="${seller.firstName} ${seller.lastName}">`
                                        : `<div class="avatar-placeholder">${getInitials(seller.firstName + ' ' + seller.lastName)}</div>`
                                    }
                                </div>
                                <div class="seller-details">
                                    <h4>${seller.firstName} ${seller.lastName}</h4>
                                    <p><i class="fas fa-envelope"></i> ${seller.email}</p>
                                    ${seller.phone ? `<p><i class="fas fa-phone"></i> ${seller.phone}</p>` : ''}
                                    <p class="member-since">Member since ${formatDate(seller.createdAt)}</p>
                                </div>
                            </div>
                            <div class="seller-actions">
                                <button class="btn btn-primary" onclick="contactSeller('${seller.email}', '${seller.firstName} ${seller.lastName}')">
                                    <i class="fas fa-envelope"></i> Contact Seller
                                </button>
                                <button class="btn btn-secondary" onclick="showSellerProfile('${seller.id}')">
                                    <i class="fas fa-user"></i> View Profile
                                </button>
                            </div>
                        ` : `
                            <p>Seller information not available</p>
                        `}
                    </div>

                    <div class="inspection-card">
                        <h3 class="section-title">
                            <i class="fas fa-clipboard-check"></i> Vehicle Inspection
                        </h3>
                        ${vehicle.inspectionStatus === 'PASSED' ? `
                            <div class="inspection-passed">
                                <i class="fas fa-check-circle"></i>
                                <h4>Inspection Passed</h4>
                                <p>This vehicle has passed our comprehensive inspection process.</p>
                                <button class="btn btn-outline" onclick="viewInspectionReport('${vehicle.id}')">
                                    View Inspection Report
                                </button>
                            </div>
                        ` : vehicle.inspectionStatus === 'PENDING' ? `
                            <div class="inspection-pending">
                                <i class="fas fa-clock"></i>
                                <h4>Inspection Pending</h4>
                                <p>This vehicle is awaiting inspection by our certified technicians.</p>
                            </div>
                        ` : `
                            <div class="inspection-not-available">
                                <i class="fas fa-info-circle"></i>
                                <h4>Inspection Not Available</h4>
                                <p>This vehicle has not been scheduled for inspection yet.</p>
                                <button class="btn btn-primary" onclick="scheduleInspectionForVehicle('${vehicle.id}')">
                                    Schedule Inspection
                                </button>
                            </div>
                        `}
                    </div>
                </div>
            </div>
        `;

        // Initialize the slider if there are images
        if (vehicleImages.length > 0) {
            initSlider(vehicleImages);
            setupSliderHover();
        }

    } catch (err) {
        console.error("Failed to load vehicle details:", err);
        container.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <h3>Failed to Load Vehicle Details</h3>
                <p>${err.message || 'An unexpected error occurred'}</p>
                <a href="index.html" class="back-link">
                    <i class="fas fa-arrow-left"></i> Back to Dashboard
                </a>
            </div>
        `;
    }
}

// ================== SELLER INTERACTION FUNCTIONS ==================
function contactSeller(email, name) {
    alert(`Contact functionality for ${name} (${email}) would be implemented here.`);
    // In a real implementation, this would open a contact form or email client
}

function showSellerProfile(sellerId) {
    alert(`View seller profile functionality for ID: ${sellerId} would be implemented here.`);
    // In a real implementation, this would navigate to the seller's profile page
}

// ================== INSPECTION FUNCTIONS ==================
function viewInspectionReport(vehicleId) {
    alert(`View inspection report functionality for vehicle ID: ${vehicleId} would be implemented here.`);
    // In a real implementation, this would open a modal or navigate to the inspection report
}

function scheduleInspectionForVehicle(vehicleId) {
    alert(`Schedule inspection functionality for vehicle ID: ${vehicleId} would be implemented here.`);
    // In a real implementation, this would navigate to the inspection scheduling page
}

// ================== INITIALIZATION ==================
document.addEventListener('DOMContentLoaded', function() {
    loadUserProfile();
    loadVehicleDetails();
});