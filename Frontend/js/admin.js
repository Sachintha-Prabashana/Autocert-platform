// ================== NAVIGATION ==================
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    const pageTitle = document.getElementById('pageTitle');

    const titles = {
        'dashboard': 'Dashboard Overview',
        'inspectors': 'Inspector Management',
        'users': 'User Management',
        'inspections': 'Inspection Management',
        'centers': 'Inspection Centers',
        'vehicles': 'Vehicle Listings',
        'reports': 'Reports & Analytics'
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            contentSections.forEach(section => section.classList.remove('active'));
            const targetSection = link.getAttribute('data-section');
            const section = document.getElementById(targetSection);
            if (section) {
                section.classList.add('active');
                pageTitle.textContent = titles[targetSection] || 'Dashboard';
                
                // Load appropriate data based on section
                if (targetSection === 'centers') {
                    loadCenters();
                } else if (targetSection === 'inspectors') {
                    loadInspectors();
                } else if (targetSection === 'vehicles') {
                    loadPendingVehicles();
                } else if (targetSection === 'inspections') {
                    loadInspections();
                } else if (targetSection === 'users') {
                    loadUsers();
                }
            }
        });
    });
}

// Sidebar toggle
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('collapsed');
}

// ================== NOTIFICATIONS ==================
function showNotification(message, type = 'info', duration = 3000) {
    // Remove any existing notifications first
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Add CSS animation if not already present
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 5px;
                color: white;
                z-index: 10000;
                animation: slideInRight 0.3s ease;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                font-weight: 600;
            }
            .notification.info { background-color: #3498db; }
            .notification.success { background-color: #2ecc71; }
            .notification.error { background-color: #e74c3c; }
            .notification.warning { background-color: #f39c12; }
            
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

// ================== MODALS ==================

// For OLD modal system (Add Admin Modal)
function openAddAdminModal() {
    const modal = document.getElementById('addAdminModal');
    if (modal) {
        modal.style.display = 'block';
        console.log('Opening add admin modal');
    }
}

function closeAddAdminModal() {
    const modal = document.getElementById('addAdminModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// For NEW modal system (Inspector, Center modals)
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        modal.style.display = 'flex';
        console.log('Opening modal:', modalId);
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
    }
}

// Specific modal functions
function openAddInspectorModal() {
    openModal('addInspectorModal');
    loadServiceCenters();
}

function openAddCenterModal() {
    openModal('addCenterModal');
}

function openAddInspectionModal() {
    console.log('Opening add inspection modal - feature not implemented');
    showNotification('Add inspection feature coming soon', 'info');
}

function closeInspectorModal() {
    closeModal('assignInspectorModal');
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    // Handle old modal system
    const addAdminModal = document.getElementById('addAdminModal');
    if (event.target === addAdminModal) {
        closeAddAdminModal();
    }
    
    // Handle new modal system
    const modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
            modal.classList.remove('show');
        }
    });
});

// ================== AUTH ==================
function getAuthToken() {
    return localStorage.getItem("token") || "dummy_token";
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem("token");
        showNotification('Logged out successfully', 'success');
        // window.location.href = "/login";
        console.log('Logout successful');
    }
}

// ================== CENTERS ==================
async function saveCenter() {
    const name = document.getElementById("centerName").value.trim();
    const address = document.getElementById("centerAddress").value.trim();
    const contact = document.getElementById("centerContact").value.trim();
    const openTime = document.getElementById("openTime").value;
    const closeTime = document.getElementById("closeTime").value;

    if (!name || !address || !contact) {
        showNotification("Please fill all required fields.", 'error');
        return;
    }

    const center = { name, address, contactNumber: contact, openTime, closeTime };

    try {
        // Simulate API call
        console.log('Saving center:', center);
        
        // Simulate success
        setTimeout(() => {
            showNotification("Center added: " + name, 'success');
            closeModal("addCenterModal");
            document.getElementById("addCenterForm").reset();
            loadCenters();
        }, 1000);
        
    } catch (err) {
        console.error(err);
        showNotification("Error saving center.", 'error');
    }
}

async function loadCenters() {
    try {
        // Simulate API call - replace with actual API endpoint
        console.log('Loading centers...');
        
        // Mock data
        const centers = [
            {
                id: 1,
                name: "Downtown Service Center",
                address: "123 Main Street, Downtown",
                openTime: "08:00",
                closeTime: "18:00",
                contactNumber: "+1 (555) 123-4567"
            },
            {
                id: 2,
                name: "North Service Center", 
                address: "456 North Ave, Northside",
                openTime: "07:30",
                closeTime: "17:30",
                contactNumber: "+1 (555) 987-6543"
            }
        ];

        const tbody = document.querySelector("#centersTable tbody");
        if (!tbody) return;
        
        tbody.innerHTML = "";

        if (centers.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:gray;">No centers found</td></tr>`;
            return;
        }

        centers.forEach(center => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div class="stat-icon blue" style="width: 35px; height: 35px; font-size: 14px;">
                            <i class="fas fa-building"></i>
                        </div>
                        <div>
                            <div style="font-weight: 600; color: #0f172a;">${center.name}</div>
                            <div style="font-size: 12px; color: #64748b;">ID: ${center.id}</div>
                        </div>
                    </div>
                </td>
                <td>${center.address}</td>
                <td><div class="time-display">${center.openTime}</div></td>
                <td><div class="time-display">${center.closeTime}</div></td>
                <td>${center.contactNumber}</td>
                <td><span class="status-badge status-active"><i class="fas fa-check-circle"></i> Active</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="action-icon view" data-tooltip="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-icon edit" data-tooltip="Edit Center">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error(err);
        showNotification("Failed to load centers", 'error');
    }
}

async function loadServiceCenters() {
    try {
        // Mock data for service centers dropdown
        const centers = [
            { id: 1, name: "Downtown Service Center" },
            { id: 2, name: "North Service Center" },
            { id: 3, name: "South Service Center" }
        ];

        const dropdown = document.getElementById("inspectionCenter");
        if (!dropdown) return;
        
        dropdown.innerHTML = '<option value="">Select a service center</option>';

        centers.forEach(center => {
            const option = document.createElement("option");
            option.value = center.id;
            option.textContent = center.name;
            dropdown.appendChild(option);
        });
    } catch (err) {
        console.error(err);
        showNotification("Could not load center names", 'error');
    }
}

// ================== INSPECTORS ==================
let selectedSpecializations = [];

function toggleSpecialization(card, value) {
    card.classList.toggle('selected');
    
    if (selectedSpecializations.includes(value)) {
        selectedSpecializations = selectedSpecializations.filter(s => s !== value);
    } else {
        selectedSpecializations.push(value);
    }
    
    console.log('Selected specializations:', selectedSpecializations);
}

async function saveInspector() {
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const centerId = document.getElementById("inspectionCenter").value;

    if (!firstName || !lastName || !email || !phone || !centerId) {
        showNotification("Please fill all required fields.", 'error');
        return;
    }

    if (selectedSpecializations.length === 0) {
        showNotification("Select at least one specialization.", 'error');
        return;
    }

    const inspector = {
        firstName,
        lastName,
        email,
        phone,
        specializations: selectedSpecializations,
        centerId: parseInt(centerId)
    };

    try {
        console.log('Saving inspector:', inspector);
        
        // Simulate success
        setTimeout(() => {
            showNotification("Inspector added successfully", 'success');
            closeModal("addInspectorModal");
            
            // Reset form
            document.getElementById("addInspectorForm").reset();
            selectedSpecializations = [];
            document.querySelectorAll(".specialization-card.selected").forEach(card => {
                card.classList.remove('selected');
            });
            
            loadInspectors();
        }, 1000);
        
    } catch (err) {
        console.error(err);
        showNotification("Error saving inspector", 'error');
    }
}

async function loadInspectors() {
    try {
        // Mock data
        const inspectors = [
            {
                id: 1,
                firstName: "John",
                lastName: "Davis",
                fullName: "John Davis",
                email: "john.davis@autocert.com",
                centerName: "Downtown Center",
                specializations: ["Safety", "Emissions"]
            },
            {
                id: 2,
                firstName: "Sarah",
                lastName: "Miller",
                fullName: "Sarah Miller",
                email: "sarah.miller@autocert.com",
                centerName: "North Center",
                specializations: ["Engine", "Brakes", "Safety"]
            }
        ];

        const tbody = document.getElementById("inspectorsTableBody");
        if (!tbody) return;
        
        tbody.innerHTML = "";

        if (inspectors.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:gray;">No inspectors found</td></tr>`;
            return;
        }

        inspectors.forEach(inspector => {
            const specs = inspector.specializations ? inspector.specializations.join(", ") : "-";
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div class="user-avatar" style="width: 35px; height: 35px; font-size: 14px;">
                            ${inspector.firstName[0]}${inspector.lastName[0]}
                        </div>
                        <div>
                            <div style="font-weight: 600; color: #0f172a;">${inspector.fullName}</div>
                            <div style="font-size: 12px; color: #64748b;">ID: INS-${inspector.id.toString().padStart(3, '0')}</div>
                        </div>
                    </div>
                </td>
                <td>${inspector.email}</td>
                <td>${inspector.centerName}</td>
                <td>
                    <div style="display: flex; gap: 4px; flex-wrap: wrap;">
                        ${inspector.specializations.map(spec => 
                            `<span class="type-badge type-${spec.toLowerCase()}">${spec}</span>`
                        ).join('')}
                    </div>
                </td>
                <td>
                    <span class="status-badge status-active">
                        <i class="fas fa-circle"></i>
                        Online
                    </span>
                </td>
                <td>
                    <span class="status-badge status-active">
                        <i class="fas fa-check-circle"></i>
                        Active
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="action-icon view" data-tooltip="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-icon edit" data-tooltip="Edit Inspector" onclick="editInspector(${inspector.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-icon resend" data-tooltip="Reset Password">
                            <i class="fas fa-key"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error(err);
        showNotification("Failed to load inspectors", 'error');
    }
}

// Placeholder functions for inspector actions
function editInspector(id) {
    showNotification(`Edit inspector ${id} functionality not implemented yet`, 'info');
}

function deleteInspector(id) {
    if (confirm('Are you sure you want to delete this inspector?')) {
        showNotification(`Delete inspector ${id} functionality not implemented yet`, 'info');
    }
}

// Filter functions
function filterInspectorsByCenter(centerName) {
    const rows = document.querySelectorAll("#inspectorsTableBody tr");
    rows.forEach(row => {
        const rowCenter = row.querySelector("td:nth-child(3)").textContent;
        if (!centerName || rowCenter.includes(centerName)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}

function filterInspectors(searchTerm) {
    const rows = document.querySelectorAll("#inspectorsTableBody tr");
    searchTerm = searchTerm.toLowerCase();
    
    rows.forEach(row => {
        const name = row.querySelector("td:nth-child(1)").textContent.toLowerCase();
        const email = row.querySelector("td:nth-child(2)").textContent.toLowerCase();
        
        if (name.includes(searchTerm) || email.includes(searchTerm)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}

// ================== USERS ==================
async function loadUsers() {
    try {
        // Mock data
        const users = [
            {
                id: 1,
                name: "Alice Johnson",
                email: "alice.johnson@example.com",
                phone: "+1 (555) 123-4567",
                role: "Customer",
                status: "Active"
            },
            {
                id: 2,
                name: "Bob Smith",
                email: "bob.smith@example.com", 
                phone: "+1 (555) 987-6543",
                role: "Admin",
                status: "Active"
            },
            {
                id: 3,
                name: "Carol Brown",
                email: "carol.brown@example.com",
                phone: "+1 (555) 456-7890", 
                role: "Customer",
                status: "Inactive"
            }
        ];

        const tbody = document.getElementById("usersTableBody");
        if (!tbody) return;
        
        tbody.innerHTML = "";

        if (users.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:gray;">No users found</td></tr>`;
            return;
        }

        users.forEach(user => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div class="user-avatar" style="width: 35px; height: 35px; font-size: 14px;">
                            ${user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                            <div style="font-weight: 600; color: #0f172a;">${user.name}</div>
                            <div style="font-size: 12px; color: #64748b;">ID: USR-${user.id.toString().padStart(3, '0')}</div>
                        </div>
                    </div>
                </td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td>
                    <span class="status-badge role-${user.role.toLowerCase()}">${user.role}</span>
                </td>
                <td>
                    <span class="status-badge status-${user.status.toLowerCase()}">
                        <i class="fas fa-${user.status === 'Active' ? 'check-circle' : 'times-circle'}"></i>
                        ${user.status}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="action-icon view" data-tooltip="View Details" onclick="viewUser(${user.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-icon edit" data-tooltip="Edit User" onclick="editUser(${user.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-icon ${user.status === 'Active' ? 'delete' : 'complete'}" 
                                data-tooltip="${user.status === 'Active' ? 'Deactivate' : 'Activate'}" 
                                onclick="toggleUserStatus(${user.id}, '${user.status}')">
                            <i class="fas fa-${user.status === 'Active' ? 'ban' : 'check'}"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error(err);
        showNotification("Failed to load users", 'error');
    }
}

function filterUsers() {
    const searchTerm = document.getElementById('userSearch').value.toLowerCase();
    const roleFilter = document.getElementById('roleFilter').value;
    const rows = document.querySelectorAll('#usersTableBody tr');
    
    rows.forEach(row => {
        const name = row.querySelector('td:first-child').textContent.toLowerCase();
        const email = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
        const roleElement = row.querySelector('td:nth-child(4) .status-badge');
        const role = roleElement ? roleElement.textContent.toLowerCase() : '';
        
        const matchesSearch = name.includes(searchTerm) || email.includes(searchTerm);
        const matchesRole = roleFilter === 'all' || role === roleFilter;
        
        if (matchesSearch && matchesRole) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function viewUser(userId) {
    showNotification(`View details for user ID: ${userId}`, 'info');
}

function editUser(userId) {
    showNotification(`Edit user ID: ${userId}`, 'info');
}

function toggleUserStatus(userId, currentStatus) {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    if (confirm(`Are you sure you want to ${newStatus.toLowerCase()} this user?`)) {
        showNotification(`User status changed to ${newStatus}`, 'success');
        loadUsers(); // Reload to show changes
    }
}

// Save admin function
function saveAdmin() {
    const firstName = document.getElementById('adminFirstName').value.trim();
    const lastName = document.getElementById('adminLastName').value.trim();
    const email = document.getElementById('adminEmail').value.trim();
    const phone = document.getElementById('adminPhone').value.trim();
    const status = document.getElementById('adminStatus').value;
    
    if (!firstName || !lastName || !email || !phone || !status) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    console.log('Saving admin:', { firstName, lastName, email, phone, status });
    
    setTimeout(() => {
        showNotification('Admin added successfully!', 'success');
        closeAddAdminModal();
        document.getElementById('addAdminForm').reset();
        loadUsers(); // Reload users list
    }, 1000);
}

// ================== VEHICLES ==================
async function loadPendingVehicles() {
    try {
        // Mock data
        const vehicles = [
            {
                id: 1,
                year: 2022,
                make: "Honda",
                model: "Civic",
                postedBy: "Michael Johnson",
                price: 25000,
                images: null
            },
            {
                id: 2,
                year: 2020,
                make: "Toyota", 
                model: "Camry",
                postedBy: "Sarah Williams",
                price: 22000,
                images: null
            }
        ];
        
        if (vehicles.length === 0) return showEmptyState();
        renderVehicles(vehicles);
    } catch (err) {
        console.error(err);
        showErrorState("Failed to load vehicles");
    }
}

function renderVehicles(vehicles) {
    const container = document.getElementById('vehicle-container');
    if (!container) return;
    
    container.innerHTML = "";
    vehicles.forEach(v => container.appendChild(createVehicleCard(v)));
}

function createVehicleCard(vehicle) {
    const card = document.createElement('div');
    card.className = 'vehicle-card fade-in';
    const firstImage = (vehicle.images && vehicle.images.length > 0) ? vehicle.images[0] : null;
    card.innerHTML = `
        <div class="vehicle-image">
            ${firstImage ? `<img src="${firstImage}" alt="${vehicle.make} ${vehicle.model}">` : `<i class="fas fa-car"></i>`}
        </div>
        <div class="vehicle-info">
            <h3>${vehicle.year} ${vehicle.make} ${vehicle.model}</h3>
            <p>Posted by: ${vehicle.postedBy}</p>
            <div class="vehicle-footer">
                <span>$${vehicle.price ? vehicle.price.toLocaleString() : 'N/A'}</span>
            </div>
            <div class="vehicle-actions">
                <button onclick="approveVehicle(${vehicle.id})" class="btn-approve"><i class="fas fa-check"></i> Approve</button>
                <button onclick="rejectVehicle(${vehicle.id})" class="btn-reject"><i class="fas fa-times"></i> Reject</button>
            </div>
        </div>
    `;
    return card;
}

function showEmptyState() {
    const container = document.getElementById('vehicle-container');
    if (container) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-car" style="font-size: 48px; margin-bottom: 20px; color: #cbd5e1;"></i>
                <h3>No Pending Vehicles</h3>
                <p>All vehicle submissions have been processed.</p>
            </div>
        `;
    }
}

function showErrorState(msg) {
    const container = document.getElementById('vehicle-container');
    if (container) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle" style="font-size: 48px; margin-bottom: 20px; color: #cbd5e1;"></i>
                <h3>${msg}</h3>
                <p>Please try again later.</p>
            </div>
        `;
    }
}

async function approveVehicle(id) {
    try {
        console.log('Approving vehicle:', id);
        showNotification("Vehicle approved", 'success');
        loadPendingVehicles();
    } catch {
        showNotification("Failed to approve", 'error');
    }
}

async function rejectVehicle(id) {
    if (!confirm('Reject this vehicle?')) return;

    try {
        console.log('Rejecting vehicle:', id);
        showNotification("Vehicle rejected", 'success');
        loadPendingVehicles();
    } catch {
        showNotification("Failed to reject", 'error');
    }
}

// ================== INSPECTIONS ==================
let bookingId = null;
let selectedInspectorId = null;
let allInspectors = [];
let inspectionDate = null;

async function loadInspections() {
    try {
        // Mock data
        const inspections = [
            {
                inspectionId: "INS-001",
                customerName: "John Smith",
                vehicleNumber: "ABC-123",
                location: "Downtown Center",
                appointmentDateTime: "2024-03-15 10:00:00",
                status: "pending",
                assignedInspector: null,
                assignable: true
            },
            {
                inspectionId: "INS-002",
                customerName: "Jane Doe",
                vehicleNumber: "XYZ-789", 
                location: "North Center",
                appointmentDateTime: "2024-03-16 14:30:00",
                status: "scheduled",
                assignedInspector: "John Davis",
                assignable: false
            }
        ];
        
        renderInspections(inspections);
    } catch (error) {
        console.error("Error loading inspections:", error);
        showNotification("Failed to load inspections", "error");
    }
}

function renderInspections(data) {
    const tbody = document.querySelector("#inspectionsTableBody");
    if (!tbody) return;

    tbody.innerHTML = "";

    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;color:gray;">No inspections found</td></tr>`;
        return;
    }

    data.forEach(inspection => {
        const dateOnly = inspection.appointmentDateTime 
            ? inspection.appointmentDateTime.split(' ')[0] 
            : '';

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${inspection.inspectionId || 'N/A'}</td>
            <td>${inspection.customerName || 'N/A'}</td>
            <td>${inspection.vehicleNumber || 'N/A'}</td>
            <td>${inspection.location || 'N/A'}</td>
            <td>${inspection.appointmentDateTime || 'N/A'}</td>
            <td>
                <span class="status-badge status-${inspection.status ? inspection.status.toLowerCase() : 'pending'}">
                    <i class="fas fa-${getStatusIcon(inspection.status)}"></i>
                    ${inspection.status || 'Pending'}
                </span>
            </td>
            <td>${inspection.assignedInspector || 'Not assigned'}</td>
            <td>
                <div class="action-buttons">
                    ${inspection.assignable 
                        ? `<button class="btn-assign" onclick="openAssignInspectorModal('${inspection.inspectionId}', '${dateOnly}')">
                               Assign Inspector
                           </button>` 
                        : `<button class="btn-outline" disabled>Assigned</button>`}
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function getStatusIcon(status) {
    switch(status) {
        case 'completed': return 'check-circle';
        case 'pending': return 'clock';
        case 'scheduled': return 'calendar-alt';
        case 'in-progress': return 'spinner';
        case 'cancelled': return 'times-circle';
        default: return 'clock';
    }
}

function openAssignInspectorModal(inspectionId, appointmentDate) {
    bookingId = inspectionId;
    inspectionDate = appointmentDate;
    
    // Show the modal
    openModal("assignInspectorModal");
    
    // Reset selection
    selectedInspectorId = null;
    const confirmBtn = document.getElementById("confirmAssignBtn");
    if (confirmBtn) confirmBtn.disabled = true;
    
    // Load available inspectors
    loadAvailableInspectors();
}

async function loadAvailableInspectors() {
    const container = document.getElementById("inspectorCardsContainer");
    const loading = document.getElementById("inspectorsLoading");
    const noInspectors = document.getElementById("noInspectorsMessage");
    
    if (loading) loading.style.display = "flex";
    if (noInspectors) noInspectors.style.display = "none";
    if (container) container.innerHTML = '';
    
    try {
        // Mock inspector data with workload
        const inspectors = [
            {
                inspectorId: 1,
                name: "John Davis",
                email: "john.davis@autocert.com",
                workingCenter: "Downtown Center",
                specializations: ["Safety", "Emissions"],
                dailyBookingCount: 2
            },
            {
                inspectorId: 2,
                name: "Sarah Miller",
                email: "sarah.miller@autocert.com", 
                workingCenter: "North Center",
                specializations: ["Engine", "Brakes", "Safety"],
                dailyBookingCount: 4
            }
        ];
        
        allInspectors = inspectors;
        
        if (loading) loading.style.display = "none";
        
        if (inspectors.length === 0) {
            if (noInspectors) noInspectors.style.display = "block";
            return;
        }
        
        renderInspectorCards(inspectors);
    } catch (error) {
        console.error("Error loading inspectors:", error);
        if (loading) loading.style.display = "none";
        if (noInspectors) {
            noInspectors.style.display = "block";
            noInspectors.innerHTML = `
                <i class="fas fa-exclamation-triangle" style="font-size: 48px; margin-bottom: 15px;"></i>
                <h3>Failed to load inspectors</h3>
                <p>Please try again later</p>
            `;
        }
    }
}

function renderInspectorCards(inspectors) {
    const container = document.getElementById("inspectorCardsContainer");
    if (!container) return;
    
    container.innerHTML = '';
    
    inspectors.forEach(inspector => {
        const card = document.createElement('div');
        card.className = 'inspector-card';
        card.dataset.id = inspector.inspectorId;
        
        // Determine workload level
        let workloadLevel = 'low';
        let workloadClass = 'low-workload';
        let workloadPercentage = 30;
        
        if (inspector.dailyBookingCount >= 5) {
            workloadLevel = 'high';
            workloadClass = 'high-workload';
            workloadPercentage = 90;
        } else if (inspector.dailyBookingCount >= 3) {
            workloadLevel = 'medium';
            workloadClass = 'medium-workload';
            workloadPercentage = 60;
        }
        
        card.innerHTML = `
            <div class="inspector-name">${inspector.name}</div>
            <div class="inspector-detail">
                <i class="fas fa-envelope detail-icon"></i>
                <span>${inspector.email}</span>
            </div>
            <div class="inspector-detail">
                <i class="fas fa-map-marker-alt detail-icon"></i>
                <span>${inspector.workingCenter}</span>
            </div>
            <div class="specializations">
                ${inspector.specializations ? inspector.specializations.map(spec => 
                    `<span class="specialization-tag">${spec}</span>`
                ).join('') : ''}
            </div>
            <div class="workload-indicator">
                <div class="workload-text">Daily inspections: ${inspector.dailyBookingCount} (${workloadLevel} workload)</div>
                <div class="workload-bar">
                    <div class="workload-fill ${workloadClass}" style="width: ${workloadPercentage}%"></div>
                </div>
            </div>
        `;
        
        // Add click event to select inspector
        card.addEventListener('click', () => selectInspector(inspector.inspectorId));
        container.appendChild(card);
    });
}

function selectInspector(inspectorId) {
    selectedInspectorId = inspectorId;
    
    // Update UI to show selected inspector
    const cards = document.querySelectorAll('.inspector-card');
    cards.forEach(card => {
        if (card.dataset.id == inspectorId) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }
    });
    
    // Enable the assign button
    const confirmBtn = document.getElementById("confirmAssignBtn");
    if (confirmBtn) confirmBtn.disabled = false;
}

function filterInspectorsModal(searchTerm) {
    if (!searchTerm) {
        renderInspectorCards(allInspectors);
        return;
    }
    
    searchTerm = searchTerm.toLowerCase();
    const filteredInspectors = allInspectors.filter(inspector => 
        inspector.name.toLowerCase().includes(searchTerm) ||
        inspector.email.toLowerCase().includes(searchTerm) ||
        inspector.workingCenter.toLowerCase().includes(searchTerm) ||
        (inspector.specializations && inspector.specializations.some(spec => 
            spec.toLowerCase().includes(searchTerm)
        ))
    );
    
    renderInspectorCards(filteredInspectors);
    
    // Show/hide no results message
    const noInspectors = document.getElementById("noInspectorsMessage");
    if (noInspectors) {
        noInspectors.style.display = filteredInspectors.length === 0 ? "block" : "none";
    }
}

async function assignInspector() {
    if (!selectedInspectorId || !bookingId) {
        showNotification("Please select an inspector first", "error");
        return;
    }

    try {
        const assignBtn = document.getElementById("confirmAssignBtn");
        if (assignBtn) {
            assignBtn.disabled = true;
            assignBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Assigning...';
        }

        console.log('Assigning inspector:', selectedInspectorId, 'to booking:', bookingId);
        
        // Simulate API call
        setTimeout(() => {
            showNotification("Inspector assigned successfully", "success");
            closeInspectorModal();
            loadInspections();
            
            // Reset button
            if (assignBtn) {
                assignBtn.disabled = false;
                assignBtn.innerHTML = '<i class="fas fa-user-check"></i> Assign Inspector';
            }
        }, 1500);

    } catch (error) {
        console.error("Error assigning inspector:", error);
        showNotification("Failed to assign inspector", "error");
        
        const assignBtn = document.getElementById("confirmAssignBtn");
        if (assignBtn) {
            assignBtn.disabled = false;
            assignBtn.innerHTML = '<i class="fas fa-user-check"></i> Assign Inspector';
        }
    }
}

// ================== FILTER FUNCTIONS ==================
function filterInspections(value) {
    console.log('Filtering inspections:', value);
    // Implementation for filtering inspections table
}

function filterInspectionsByStatus(value) {
    console.log('Filtering by status:', value);
    // Implementation for filtering inspections by status
}

// ================== INIT ==================
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard initializing...');
    
    initNavigation();
    
    // Load initial data for the active section
    const activeSection = document.querySelector('.content-section.active');
    if (activeSection) {
        const sectionId = activeSection.id;
        console.log('Active section:', sectionId);
        
        if (sectionId === 'centers') {
            loadCenters();
            loadServiceCenters();
        } else if (sectionId === 'inspectors') {
            loadInspectors();
            loadServiceCenters();
        } else if (sectionId === 'vehicles') {
            loadPendingVehicles();
        } else if (sectionId === 'inspections') {
            loadInspections();
        } else if (sectionId === 'users') {
            loadUsers();
        }
    }
    
    // Add event listeners for modal buttons
    const confirmAssignBtn = document.getElementById("confirmAssignBtn");
    if (confirmAssignBtn) {
        confirmAssignBtn.addEventListener("click", assignInspector);
    }
    
    // Add event listener for the search input in inspector modal
    const inspectorSearch = document.querySelector('#assignInspectorModal .search-input');
    if (inspectorSearch) {
        inspectorSearch.addEventListener('input', function(e) {
            filterInspectorsModal(e.target.value);
        });
    }
    
    console.log('Dashboard initialized successfully');
});

// Global functions that need to be available
window.toggleSidebar = toggleSidebar;
window.openAddAdminModal = openAddAdminModal;
window.closeAddAdminModal = closeAddAdminModal;
window.openAddInspectorModal = openAddInspectorModal;
window.openAddCenterModal = openAddCenterModal;
window.openAddInspectionModal = openAddInspectionModal;
window.closeModal = closeModal;
window.closeInspectorModal = closeInspectorModal;
window.toggleSpecialization = toggleSpecialization;
window.saveAdmin = saveAdmin;
window.saveInspector = saveInspector;
window.saveCenter = saveCenter;
window.filterUsers = filterUsers;
window.filterInspectors = filterInspectors;
window.filterInspectorsByCenter = filterInspectorsByCenter;
window.filterInspections = filterInspections;
window.filterInspectionsByStatus = filterInspectionsByStatus;
window.filterInspectorsModal = filterInspectorsModal;
window.approveVehicle = approveVehicle;
window.rejectVehicle = rejectVehicle;
window.openAssignInspectorModal = openAssignInspectorModal;
window.assignInspector = assignInspector;
window.selectInspector = selectInspector;
window.viewUser = viewUser;
window.editUser = editUser;
window.toggleUserStatus = toggleUserStatus;
window.editInspector = editInspector;
window.deleteInspector = deleteInspector;
window.logout = logout;