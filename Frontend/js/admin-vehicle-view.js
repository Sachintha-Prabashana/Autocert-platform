async function loadPendingVehicles() {
    try {
        const token = localStorage.getItem("token"); // get token from localStorage
        if (!token) {
            alert("Not authenticated. Please login as Admin.");
            return;
        }

        const response = await fetch("http://localhost:8080/api/admin/vehicles/pending", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // ✅ send token
            }
        });

        if (!response.ok) {
            throw new Error("Failed to load pending vehicles");
        }

        const vehicles = await response.json();

        const grid = document.getElementById("vehicleGrid");
        grid.innerHTML = ""; // clear old cards

        vehicles.forEach(v => {
            const card = `
                <div class="vehicle-card">
                    <div class="vehicle-image">
                        ${v.images && v.images.length > 0 
                            ? `<img src="${v.images[0]}" alt="${v.make} ${v.model}" style="width:100%; height:150px; object-fit:cover; border-radius:8px;">`
                            : `<i class="fas fa-car"></i>`}
                    </div>
                    <div class="vehicle-info">
                        <h3 class="vehicle-title">${v.make} ${v.model} ${v.year}</h3>
                        <p class="vehicle-seller">By ${v.postedBy}</p>
                        <div class="vehicle-footer">
                            <span class="vehicle-price">LKR${v.price.toLocaleString()}</span>
                            <span class="vehicle-date">${new Date(v.postedDate).toISOString().split('T')[0]}</span>
                        </div>
                        <div class="vehicle-actions">
                            <button class="btn-approve" onclick="approveVehicle(${v.id})">
                                <i class="fas fa-check"></i> Approve
                            </button>
                            <button class="btn-reject" onclick="rejectVehicle(${v.id})">
                                <i class="fas fa-times"></i> Reject
                            </button>
                        </div>
                    </div>
                </div>
            `;
            grid.innerHTML += card;
        });
    } catch (err) {
        console.error("Error loading vehicles:", err);
    }
}

// Approve vehicle
async function approveVehicle(id) {
    if (!confirm("Approve this vehicle?")) return;

    try {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Not authenticated. Please login as Admin.");
            return;
        }

        await fetch(`http://localhost:8080/api/admin/vehicles/${id}/approve`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        loadPendingVehicles(); // reload after approval
    } catch (err) {
        console.error("Error approving vehicle:", err);
    }
}

// Reject vehicle
async function rejectVehicle(id) {
    if (!confirm("Reject this vehicle?")) return;

    try {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Not authenticated. Please login as Admin.");
            return;
        }

        await fetch(`http://localhost:8080/api/admin/vehicles/${id}/reject`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        loadPendingVehicles(); // reload after rejection
    } catch (err) {
        console.error("Error rejecting vehicle:", err);
    }
}

// Load on page load
document.addEventListener("DOMContentLoaded", loadPendingVehicles);
