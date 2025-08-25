
    const API_BASE = "http://localhost:8080/api/users";

    // ================== HELPER ==================
    function getToken() {
        return localStorage.getItem("token");
    }

    function saveToken(token) {
        localStorage.setItem("token", token);
    }

    function clearToken() {
        localStorage.removeItem("token");
    }

    // ================== PROFILE DROPDOWN ==================
    function toggleProfileMenu() {
        const menu = document.getElementById('profileMenu');
        menu.style.display = menu.style.display === 'none' || menu.style.display === '' ? 'block' : 'none';
    }

    document.addEventListener('click', function(event) {
        const profileDropdown = document.querySelector('.profile-dropdown');
        const profileMenu = document.getElementById('profileMenu');
        if (!profileDropdown.contains(event.target)) {
            profileMenu.style.display = 'none';
        }
    });

    // ================== LOAD USER ==================
    async function loadUserProfile() {
        const token = getToken();
        if (!token) {
            alert("Please login first!");
            window.location.href = "/Frontend/pages/login.html";
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/me`, {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token
                }
            });

            if (!res.ok) throw new Error("Failed to fetch user info");
            const user = await res.json();

            // Header display
            document.querySelector(".profile-trigger div div:first-child").textContent = `${user.firstName} ${user.lastName}`;
            document.querySelector(".profile-trigger div div:last-child").textContent = user.email;

            // Modal form
            document.getElementById("firstName").value = user.firstName || "";
            document.getElementById("lastName").value = user.lastName || "";
            document.getElementById("email").value = user.email || "";
            document.getElementById("phoneNumber").value = user.phone || "";

            // Profile picture
            document.getElementById("profileImage").src = user.profileImageUrl || "https://via.placeholder.com/100x100/667eea/white?text=JS";

        } catch(err) {
            console.error(err);
            alert("Could not load user profile");
        }
    }

    // ================== PROFILE MODAL ==================
    function viewProfile() {
        document.getElementById('updateProfileModal').style.display = 'block';
        toggleProfileMenu();
    }

    function closeProfileModal() {
        document.getElementById('updateProfileModal').style.display = 'none';
    }

    window.onclick = function(event) {
        const modal = document.getElementById('updateProfileModal');
        if (event.target == modal) closeProfileModal();
    }

    // ================== IMAGE PREVIEW ==================
    function previewImage(input) {
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('profileImage').src = e.target.result;
            };
            reader.readAsDataURL(input.files[0]);
        }
    }

    // ================== SAVE PROFILE ==================
    async function saveProfile() {
        const token = getToken();
        if (!token) {
            alert("Please login first!");
            return;
        }

        const formData = new FormData();
        formData.append("firstName", document.getElementById("firstName").value);
        formData.append("lastName", document.getElementById("lastName").value);
        formData.append("phone", document.getElementById("phoneNumber").value);

        const imageFile = document.getElementById("profilePicInput").files[0];
        if (imageFile) formData.append("image", imageFile);

        try {
            const res = await fetch(`${API_BASE}/update`, {
                method: "PUT",
                headers: {
                    "Authorization": "Bearer " + token
                },
                body: formData
            });

            if (!res.ok) throw new Error("Profile update failed");
            const updatedUser = await res.json();

            alert("Profile updated successfully!");
            document.querySelector(".profile-trigger div div:first-child").textContent = `${updatedUser.firstName} ${updatedUser.lastName}`;
            document.getElementById("profileImage").src = updatedUser.profileImageUrl || "https://via.placeholder.com/100x100/667eea/white?text=JS";

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
        window.location.href = '/Frontend/pages/inspection.html';
    }

    // ================== INIT ==================
    window.addEventListener("DOMContentLoaded", loadUserProfile);