// ================== CONSTANTS ==================
const API_BASE_USERS = "http://localhost:8080/api/users";
const API_BASE_VEHICLES = "http://localhost:8080/api/vehicles";

// ================== TOKEN HELPERS ==================
function getToken() {
    return localStorage.getItem("token");
}
function saveToken(token) {
    localStorage.setItem("token", token);
}
function clearToken() {
    localStorage.removeItem("token");
}

// ================== PROFILE ==================
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

        // Header display
        const headerName = document.querySelector(".profile-trigger div div:first-child");
        const headerEmail = document.querySelector(".profile-trigger div div:last-child");
        if (headerName) headerName.textContent = `${user.firstName} ${user.lastName}`;
        if (headerEmail) headerEmail.textContent = user.email;

        // Modal form
        const modalFields = ["firstName", "lastName", "email", "phoneNumber"];
        modalFields.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = user[id] || "";
        });

        // Profile image
        const profileImg = document.getElementById("profileImage");
        if (profileImg) profileImg.src = user.profileImageUrl || "https://via.placeholder.com/100x100/667eea/white?text=JS";
    } catch (err) {
        console.error(err);
        alert("Could not load user profile");
    }
}

// ================== PROFILE MODAL ==================
function viewProfile() {
    const modal = document.getElementById('updateProfileModal');
    if (modal) modal.style.display = 'block';
    toggleProfileMenu();
}
function closeProfileModal() {
    const modal = document.getElementById('updateProfileModal');
    if (modal) modal.style.display = 'none';
}
window.onclick = function(event) {
    const modal = document.getElementById('updateProfileModal');
    if (event.target == modal) closeProfileModal();
}

// ================== PROFILE IMAGE PREVIEW ==================
function previewImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const profileImg = document.getElementById('profileImage');
            if (profileImg) profileImg.src = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// ================== SAVE PROFILE ==================
async function saveProfile() {
    const token = getToken();
    if (!token) { alert("Please login first!"); return; }

    const formData = new FormData();
    formData.append("firstName", document.getElementById("firstName").value);
    formData.append("lastName", document.getElementById("lastName").value);
    formData.append("phone", document.getElementById("phoneNumber").value);

    const imageFile = document.getElementById("profilePicInput")?.files[0];
    if (imageFile) formData.append("image", imageFile);

    try {
        const res = await fetch(`${API_BASE_USERS}/update`, {
            method: "PUT",
            headers: { "Authorization": "Bearer " + token },
            body: formData
        });

        if (!res.ok) throw new Error("Profile update failed");
        const updatedUser = await res.json();

        alert("Profile updated successfully!");
        const headerName = document.querySelector(".profile-trigger div div:first-child");
        if (headerName) headerName.textContent = `${updatedUser.firstName} ${updatedUser.lastName}`;
        const profileImg = document.getElementById("profileImage");
        if (profileImg) profileImg.src = updatedUser.profileImageUrl || "https://via.placeholder.com/100x100/667eea/white?text=JS";

        closeProfileModal();
    } catch(err) {
        console.error(err);
        alert("Could not update profile");
    }
}

// ================== LOGOUT ==================
function logout() {
    if (confirm("Are you sure you want to logout?")) {
        clearToken();
        window.location.href = "/Frontend/index.html";
    }
}

// ================== NAVIGATION ==================
function scheduleInspection() {
    window.location.href = '/Frontend/pages/test-ins.html';
}

// ================== LOAD APPROVED VEHICLES ==================
async function loadApprovedVehicles() {
    const grid = document.getElementById("vehicleGrid");
    if (!grid) return;

    const token = getToken();
    if (!token) {
        grid.innerHTML = "<p style='color:red; text-align:center;'>Please login to view vehicles.</p>";
        return;
    }

    try {
        const res = await fetch(`${API_BASE_VEHICLES}/approved`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            }
        });
        if (!res.ok) throw new Error("Failed to fetch approved vehicles");
        const vehicles = await res.json();

        grid.innerHTML = "";
        vehicles.forEach(v => {
            const card = `
                <div class="vehicle-card">
                    <div class="vehicle-image">
                        ${v.photos && v.photos.length > 0 
                            ? `<img src="${v.photos[0]}" alt="${v.make} ${v.model}" style="width:100%; height:150px; object-fit:cover; border-radius:8px;">`
                            : `<i class="fas fa-car"></i>`}
                    </div>
                    <div class="vehicle-info">
                        <h3 class="vehicle-title">${v.make} ${v.model} ${v.year}</h3>
                        <p class="vehicle-seller">By ${v.contactName || 'N/A'}</p>
                        <div class="vehicle-footer">
                            <span class="vehicle-price">${formatPrice(v.price)}</span>
                            <span class="vehicle-date">${new Date(v.createdAt).toISOString().split('T')[0]}</span>
                        </div>
                        <a href="vehicle-details.html?id=${v.id}" class="btn-listing">View Details</a>
                    </div>
                </div>
            `;
            grid.innerHTML += card;
        });

    } catch (err) {
        console.error("Error loading approved vehicles:", err);
        grid.innerHTML = "<p style='color:red; text-align:center;'>Failed to load vehicles. Please try again later.</p>";
    }
}

// Utility function to format price
function formatPrice(price) {
    if (!price) return "-";
    return price.toLocaleString("en-US", { style: "currency", currency: "LKR" });
}

// ================== INIT ==================
document.addEventListener("DOMContentLoaded", () => {
    loadUserProfile();
    loadApprovedVehicles();
});
