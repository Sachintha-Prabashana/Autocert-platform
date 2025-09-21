
        function filterUsers() {
            const searchTerm = document.getElementById('userSearch').value.toLowerCase();
            const roleFilter = document.getElementById('roleFilter').value;

            filteredUsers = usersData.filter(user => {
                const matchesSearch = user.name.toLowerCase().includes(searchTerm) ||
                                    user.email.toLowerCase().includes(searchTerm) ||
                                    user.phone.includes(searchTerm);
                
                const matchesRole = roleFilter === 'all' || user.role === roleFilter;

                return matchesSearch && matchesRole;
            });

            loadUsers(filteredUsers);
        }

        // Open Add Admin Modal
        function openAddAdminModal() {
            document.getElementById('addAdminModal').style.display = 'block';
            document.body.style.overflow = 'hidden';
        }

        // Close Add Admin Modal
        function closeAddAdminModal() {
            document.getElementById('addAdminModal').style.display = 'none';
            document.body.style.overflow = 'auto';
            document.getElementById('addAdminForm').reset();
        }

        // Save new admin
        function saveAdmin() {
            const firstName = document.getElementById('adminFirstName').value.trim();
            const lastName = document.getElementById('adminLastName').value.trim();
            const email = document.getElementById('adminEmail').value.trim();
            const phone = document.getElementById('adminPhone').value.trim();
            const status = document.getElementById('adminStatus').value;

            // Validation
            if (!firstName || !lastName || !email || !phone || !status) {
                alert('Please fill in all fields');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address');
                return;
            }

            // Check if email already exists
            if (usersData.some(user => user.email === email)) {
                alert('Email already exists');
                return;
            }

            // Create AdminCreateDTO object to match your backend DTO
            const adminCreateDTO = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                phone: phone
            };

            // Create new admin for local display (includes generated fields)
            const newAdmin = {
                id: usersData.length > 0 ? Math.max(...usersData.map(u => u.id)) + 1 : 1,
                name: `${firstName} ${lastName}`, // Combined for display
                email: email,
                phone: phone,
                role: 'admin',
                status: status
            };

            // In a real application, you would send adminCreateDTO to your backend:
            // fetch('/api/admin', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(adminCreateDTO)
            // });

            console.log('AdminCreateDTO to send to backend:', adminCreateDTO);

            // Add to local database for demo
            usersData.push(newAdmin);
            
            // Refresh table
            filterUsers();
            
            // Close modal
            closeAddAdminModal();
            
            // Show success message
            alert('Admin added successfully! Password will be generated automatically.');
        }

        // Edit user function
        function editUser(userId) {
            const user = usersData.find(u => u.id === userId);
            if (user) {
                alert(`Edit user: ${user.name}\n(This would open an edit modal in a real application)`);
            }
        }

        // Delete user function
        function deleteUser(userId) {
            if (confirm('Are you sure you want to delete this user?')) {
                usersData = usersData.filter(u => u.id !== userId);
                filterUsers();
                alert('User deleted successfully!');
            }
        }

        // Close modal when clicking outside
        window.onclick = function(event) {
            const modal = document.getElementById('addAdminModal');
            if (event.target === modal) {
                closeAddAdminModal();
            }
        }

        // Load initial data
        document.addEventListener('DOMContentLoaded', function() {
            loadUsers();
        });


const API_BASE_USERS = "http://localhost:8080/api/users";


async function loadUsers() {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Please login first!");
        return;
    }

    try {
        const res = await fetch(API_BASE_USERS, {
            method: "GET",
            headers: { "Authorization": "Bearer " + token }
        });

        if (!res.ok) throw new Error("Failed to fetch users");

        const users = await res.json();
        const tbody = document.getElementById("usersTableBody");
        tbody.innerHTML = "";

        users.forEach(user => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${user.fullName || '-'}</td>
                <td>${user.email || '-'}</td>
                <td>${user.phone || '-'}</td>
                <td><span class="role-badge role-${user.role.toLowerCase()}">${user.role}</span></td>
                <td><span class="status-badge">${user.status || 'ACTIVE'}</span></td>
                <td>
                    <button class="btn-action btn-edit" onclick="editUser(${user.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-action btn-delete" onclick="deleteUser(${user.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error(err);
        alert("Could not load users");
    }
}

// Example edit handler
function editUser(userId) {
    alert("Edit user with ID: " + userId);
    // You can open modal here
}

// Example delete handler
async function deleteUser(userId) {
    if (!confirm("Are you sure you want to delete this user?")) return;

    const token = localStorage.getItem("token");

    try {
        const res = await fetch(`${API_BASE_USERS}/${userId}`, {
            method: "DELETE",
            headers: { "Authorization": "Bearer " + token }
        });

        if (!res.ok) throw new Error("Delete failed");

        alert("User deleted successfully!");
        loadUsers(); // Refresh table
    } catch (err) {
        console.error(err);
        alert("Failed to delete user");
    }
}







// ==================  ==================

// Profile options functionality
function showProfileOptions() {
    // Create profile options menu
    const profileMenu = document.getElementById('profileMenu');
    if (profileMenu.querySelector('.profile-options')) return;
    
    const optionsHtml = `
        <div class="profile-options">
            <div class="profile-option" onclick="openUpdateProfile()">
                <div class="profile-option-icon">
                    <i class="fas fa-user-edit"></i>
                </div>
                <div class="profile-option-info">
                    <div class="profile-option-title">Update Profile</div>
                    <div class="profile-option-desc">Change your personal information</div>
                </div>
                <i class="fas fa-chevron-right" style="color: #94a3b8;"></i>
            </div>
            
            <div class="profile-option" onclick="openChangePassword()">
                <div class="profile-option-icon">
                    <i class="fas fa-key"></i>
                </div>
                <div class="profile-option-info">
                    <div class="profile-option-title">Change Password</div>
                    <div class="profile-option-desc">Update your login password</div>
                </div>
                <i class="fas fa-chevron-right" style="color: #94a3b8;"></i>
            </div>
        </div>
    `;
    
    // Add options to profile menu
    const hr = document.createElement('hr');
    profileMenu.appendChild(hr);
    profileMenu.insertAdjacentHTML('beforeend', optionsHtml);
}

function openUpdateProfile() {
    closeModal('profileMenu');
    openModal('updateProfileModal');
}

function openChangePassword() {
    closeModal('profileMenu');
    openModal('changePasswordModal');
}

function openModal(modalId) {
    document.getElementById(modalId).classList.add('show');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

function checkPasswordStrength(password) {
    const strengthBar = document.getElementById('passwordStrengthBar');
    const strengthText = document.getElementById('passwordStrengthText');
    
    // Reset classes
    strengthBar.className = 'strength-fill';
    strengthText.className = 'strength-text';
    
    if (password.length === 0) {
        strengthBar.style.width = '0%';
        strengthText.textContent = 'Password strength';
        return;
    }
    
    // Simple password strength calculation
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    
    strengthBar.style.width = strength + '%';
    
    if (strength < 50) {
        strengthBar.classList.add('strength-weak');
        strengthText.classList.add('strength-weak-text');
        strengthText.textContent = 'Weak password';
    } else if (strength < 75) {
        strengthBar.classList.add('strength-medium');
        strengthText.classList.add('strength-medium-text');
        strengthText.textContent = 'Medium strength';
    } else {
        strengthBar.classList.add('strength-strong');
        strengthText.classList.add('strength-strong-text');
        strengthText.textContent = 'Strong password';
    }
}

function saveProfile() {
    // Add profile saving logic here
    const firstName = document.getElementById('profileFirstName').value;
    const lastName = document.getElementById('profileLastName').value;
    
    // Show success message
    showNotification('Profile updated successfully!', 'success');
    closeModal('updateProfileModal');
}

function updatePassword() {
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (newPassword !== confirmPassword) {
        document.getElementById('confirmPasswordError').style.display = 'flex';
        document.getElementById('confirmPassword').classList.add('error');
        return;
    }
    
    // Add password update logic here
    showNotification('Password updated successfully!', 'success');
    closeModal('changePasswordModal');
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        ${message}
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize profile options when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Add event listener to profile trigger
    const profileTrigger = document.querySelector('.profile-trigger');
    if (profileTrigger) {
        profileTrigger.addEventListener('click', showProfileOptions);
    }
});

