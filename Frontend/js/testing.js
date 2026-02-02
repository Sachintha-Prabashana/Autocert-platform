// ================== STYLING HELPERS ==================
// Status badge styling helper
function getStatusBadge(status, type = 'general') {
    const statusLower = status.toLowerCase();
    let badgeClass = 'status-badge';
    let icon = '';
    
    switch (statusLower) {
        case 'active':
        case 'completed':
        case 'operational':
        case 'online':
            badgeClass += ' status-active';
            icon = '<i class="fas fa-check-circle" style="font-size: 10px;"></i>';
            break;
        case 'inactive':
        case 'offline':
        case 'failed':
        case 'cancelled':
            badgeClass += ' status-inactive';
            icon = '<i class="fas fa-times-circle" style="font-size: 10px;"></i>';
            break;
        case 'pending':
        case 'waiting':
            badgeClass += ' status-pending';
            icon = '<i class="fas fa-clock" style="font-size: 10px;"></i>';
            break;
        case 'scheduled':
        case 'assigned':
            badgeClass += ' status-scheduled';
            icon = '<i class="fas fa-calendar-alt" style="font-size: 10px;"></i>';
            break;
        default:
            badgeClass += ' status-pending';
            icon = '<i class="fas fa-question-circle" style="font-size: 10px;"></i>';
    }
    
    return `<span class="${badgeClass}">${icon} ${status}</span>`;
}

// Inspection type badge styling
function getTypeBadge(type) {
    const typeLower = type.toLowerCase();
    let badgeClass = 'type-badge';
    
    switch (typeLower) {
        case 'safety':
        case 'general':
            badgeClass += ' type-safety';
            break;
        case 'emissions':
        case 'environmental':
            badgeClass += ' type-emissions';
            break;
        case 'annual':
        case 'yearly':
            badgeClass += ' type-annual';
            break;
        case 'brake':
        case 'brakes':
            badgeClass += ' type-brake';
            break;
        case 'engine':
            badgeClass += ' type-safety';
            break;
        case 'electrical':
            badgeClass += ' type-emissions';
            break;
        case 'body':
            badgeClass += ' type-annual';
            break;
        default:
            badgeClass += ' type-safety';
    }
    
    return `<span class="${badgeClass}">${type}</span>`;
}

// Action buttons generator
function getActionButtons(actions = []) {
    let buttonsHtml = '<div class="action-buttons">';
    
    actions.forEach(action => {
        let buttonClass = 'action-icon';
        let icon = '';
        let tooltip = '';
        let onclick = '';
        
        switch (action.type) {
            case 'view':
                buttonClass += ' view';
                icon = '<i class="fas fa-eye"></i>';
                tooltip = 'View Details';
                onclick = `onclick="${action.onclick || `viewDetails('${action.id}', '${action.entity}')`}"`;
                break;
            case 'edit':
                buttonClass += ' edit';
                icon = '<i class="fas fa-edit"></i>';
                tooltip = 'Edit';
                onclick = `onclick="${action.onclick || `editEntity('${action.id}', '${action.entity}')`}"`;
                break;
            case 'delete':
                buttonClass = 'action-icon';
                buttonClass += ' delete';
                icon = '<i class="fas fa-trash"></i>';
                tooltip = 'Delete';
                onclick = `onclick="${action.onclick || `deleteEntity('${action.id}', '${action.entity}')`}"`;
                break;
            case 'assign':
                buttonClass = 'btn-assign';
                icon = '<i class="fas fa-user-check"></i>';
                tooltip = 'Assign Inspector';
                onclick = `onclick="${action.onclick}"`;
                break;
            case 'reset-password':
                buttonClass += ' resend';
                icon = '<i class="fas fa-key"></i>';
                tooltip = 'Reset Password';
                onclick = `onclick="resetPassword('${action.id}')"`;
                break;
            case 'approve':
                buttonClass = 'btn-approve';
                icon = '<i class="fas fa-check"></i>';
                tooltip = 'Approve';
                onclick = `onclick="${action.onclick}"`;
                break;
            case 'reject':
                buttonClass = 'btn-reject';
                icon = '<i class="fas fa-times"></i>';
                tooltip = 'Reject';
                onclick = `onclick="${action.onclick}"`;
                break;
        }
        
        buttonsHtml += `<button class="${buttonClass}" data-tooltip="${tooltip}" ${onclick}>${icon}</button>`;
    });
    
    buttonsHtml += '</div>';
    return buttonsHtml;
}

// User avatar generator
function getUserAvatar(name, size = 35) {
    const initials = name.split(' ').map(word => word[0]).join('').toUpperCase().substring(0, 2);
    const colors = [
        'linear-gradient(135deg, #1e40af, #1d4ed8)',
        'linear-gradient(135deg, #059669, #047857)',
        'linear-gradient(135deg, #dc2626, #b91c1c)',
        'linear-gradient(135deg, #7c3aed, #6d28d9)',
        'linear-gradient(135deg, #ea580c, #c2410c)',
        'linear-gradient(135deg, #0891b2, #0e7490)'
    ];
    
    const colorIndex = name.length % colors.length;
    const backgroundColor = colors[colorIndex];
    
    return `<div class="user-avatar" style="width: ${size}px; height: ${size}px; font-size: ${size * 0.4}px; background: ${backgroundColor};">${initials}</div>`;
}

// User info cell generator
function getUserInfoCell(user) {
    return `
        <div style="display: flex; align-items: center; gap: 12px;">
            ${getUserAvatar(user.name)}
            <div>
                <div style="font-weight: 600; color: #0f172a;">${user.name}</div>
                <div style="font-size: 12px; color: #64748b;">${user.id ? `ID: ${user.id}` : user.email}</div>
            </div>
        </div>
    `;
}

// Specializations display generator
function getSpecializationsDisplay(specializations) {
    if (!specializations || specializations.length === 0) {
        return '<span style="color: #94a3b8; font-style: italic;">No specializations</span>';
    }
    
    let html = '<div style="display: flex; gap: 4px; flex-wrap: wrap;">';
    specializations.forEach(spec => {
        html += getTypeBadge(spec);
    });
    html += '</div>';
    return html;
}

// Time display formatter
function formatTimeDisplay(dateString) {
    if (!dateString) return '<span class="time-display">Not set</span>';
    
    // Check for Enum format (e.g. TEN_THIRTY_AM or TEN_AM)
    if (typeof dateString === 'string' && dateString.includes('_') && (dateString.endsWith('AM') || dateString.endsWith('PM'))) {
        try {
            const parts = dateString.split('_');
            const meridiem = parts.pop(); // AM or PM
            
            const numberMap = {
                'ONE': 1, 'TWO': 2, 'THREE': 3, 'FOUR': 4, 'FIVE': 5,
                'SIX': 6, 'SEVEN': 7, 'EIGHT': 8, 'NINE': 9, 'TEN': 10,
                'ELEVEN': 11, 'TWELVE': 12,
                'THIRTY': 30, 'FIFTEEN': 15, 'FORTY': 40, 'TWENTY': 20, 'ZERO': 0,
                'O': 0 // O_CLOCK?
            };
            
            let hour = numberMap[parts[0]];
            let minute = 0;
            
            // Sum up remaining parts for minutes
            for (let i = 1; i < parts.length; i++) {
                if (numberMap[parts[i]] !== undefined) {
                    minute += numberMap[parts[i]];
                }
            }
            
            if (hour) {
                const minStr = minute.toString().padStart(2, '0');
                return `<span class="time-display">${hour}.${minStr} ${meridiem}</span>`;
            }
        } catch (e) {
            console.error("Error parsing time enum:", e);
        }
    }
    
    // Specific check for simple formats like "10:30" or "10-30" if they aren't standard dates
    // ...

    const date = new Date(dateString);
    
    // Check if date is invalid
    if (isNaN(date.getTime())) {
        return `<span class="time-display">${dateString}</span>`;
    }

    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    // Future dates
    if (diff < 0) {
        return `<span class="time-display">${date.toLocaleDateString()} ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>`;
    }
    
    if (days === 0) {
        return `<span class="time-display">${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>`;
    } else if (days === 1) {
        return `<span class="time-display">Yesterday</span>`;
    } else if (days < 7) {
        return `<span class="time-display">${days} days ago</span>`;
    } else {
        return `<span class="time-display">${date.toLocaleDateString()}</span>`;
    }
}

// Workload indicator generator
function getWorkloadIndicator(current, max) {
    const percentage = Math.min((current / max) * 100, 100);
    let workloadClass = 'low-workload';
    
    if (percentage > 80) {
        workloadClass = 'high-workload';
    } else if (percentage > 50) {
        workloadClass = 'medium-workload';
    }
    
    return `
        <div style="display: flex; align-items: center; gap: 8px;">
            <div style="width: 60px; height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden;">
                <div style="width: ${percentage}%; height: 100%; background: linear-gradient(90deg, ${workloadClass === 'low-workload' ? '#22c55e, #16a34a' : workloadClass === 'medium-workload' ? '#f59e0b, #d97706' : '#ef4444, #dc2626'});"></div>
            </div>
            <span style="font-size: 12px; font-weight: 600;">${current}/${max}</span>
        </div>
    `;
}

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
function openAddInspectorModal() {
    document.getElementById("addInspectorModal").style.display = "flex";
}

function openAddCenterModal() {
    document.getElementById("addCenterModal").style.display = "flex";
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}




// Close modal when clicking outside
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(modal => {
        if (event.target === modal) modal.style.display = "none";
    });
};

// ================== AUTH ==================
function getAuthToken() {
    return localStorage.getItem("token");
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem("token");
        window.location.href = "/login";
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
        const response = await fetch("http://localhost:8080/api/admin/centers", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify(center)
        });

        if (response.ok) {
            const saved = await response.json();
            showNotification("Center added: " + saved.name, 'success');
            closeModal("addCenterModal");
            document.getElementById("addCenterForm").reset();
            loadCenters();
            loadCenterNames();
        } else {
            const error = await response.text();
            showNotification("Failed to add center: " + error, 'error');
        }
    } catch (err) {
        console.error(err);
        showNotification("Error saving center.", 'error');
    }
}

async function loadCenters() {
    try {
        const response = await fetch("http://localhost:8080/api/admin/centers", {
            method: "GET",
            headers: { "Authorization": `Bearer ${getAuthToken()}` }
        });
        if (!response.ok) throw new Error("Failed to fetch centers");

        const centers = await response.json();
        const tbody = document.querySelector("#centersTable tbody");
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
                            <div style="font-size: 12px; color: #64748b;">Service Center</div>
                        </div>
                    </div>
                </td>
                <td>${center.address || "-"}</td>
                <td><div class="time-display">${center.openTime || "08:00"}</div></td>
                <td><div class="time-display">${center.closeTime || "17:00"}</div></td>
                <td>${center.contactNumber || "-"}</td>
                <td>${getStatusBadge('operational')}</td>
                <td>${getActionButtons([
                    {type: 'view', id: center.id, entity: 'center'},
                    {type: 'edit', id: center.id, entity: 'center'}
                ])}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error(err);
        showNotification("Failed to load centers", 'error');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadCenterNames();
    loadCenters();
});

async function loadCenterNames() {
    try {
        const response = await fetch("http://localhost:8080/api/admin/centers/names", {
            method: "GET",
            headers: { "Authorization": `Bearer ${getAuthToken()}` }
        });

        if (!response.ok) throw new Error("Failed to fetch names");

        const centers = await response.json();
        const dropdown = document.getElementById("inspectionCenter");
        // Reset with default option
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
function toggleSpecialization(card, value) {
    card.classList.toggle('selected');
    const checkIcon = card.querySelector('.specialization-checkbox i');
    checkIcon.style.display = card.classList.contains('selected') ? 'block' : 'none';
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

    const selectedSpecializations = [];
    document.querySelectorAll(".specialization-card.selected")
        .forEach(card => selectedSpecializations.push(card.dataset.value));

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
        const response = await fetch("http://localhost:8080/api/admin/inspectors", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify(inspector)
        });

        if (response.ok) {
            showNotification("Inspector added", 'success');
            closeModal("addInspectorModal");
            document.getElementById("addInspectorForm").reset();
            
            // Reset specialization cards
            document.querySelectorAll(".specialization-card.selected").forEach(card => {
                card.classList.remove('selected');
                card.querySelector('.specialization-checkbox i').style.display = 'none';
            });
            
            loadInspectors();
        } else {
            const error = await response.text();
            showNotification("Failed to add inspector: " + error, 'error');
        }
    } catch (err) {
        console.error(err);
        showNotification("Error saving inspector", 'error');
    }
}

async function loadInspectors() {
    try {
        const response = await fetch("http://localhost:8080/api/admin/inspectors", {
            method: "GET",
            headers: { "Authorization": `Bearer ${getAuthToken()}` }
        });
        if (!response.ok) throw new Error("Failed to fetch inspectors");

        const inspectors = await response.json();
        const tbody = document.getElementById("inspectorsTableBody");
        tbody.innerHTML = "";

        if (inspectors.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:gray;">No inspectors found</td></tr>`;
            return;
        }

        inspectors.forEach(inspector => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${getUserInfoCell({
                    // DEBUG: Display keys to identify correct name properties
                    name: inspector.name || (inspector.firstName && inspector.lastName ? `${inspector.firstName} ${inspector.lastName}` : `Keys: ${Object.keys(inspector).join(', ')}`),
                    id: inspector.id
                })}</td>
                <td>${inspector.email}</td>
                <td>${inspector.centerName || 'N/A'}</td>
                <td>${getSpecializationsDisplay(inspector.specializations)}</td>
                <td>${getStatusBadge('offline', 'login')}</td>
                <td>${getStatusBadge('active')}</td>
                <td>${getActionButtons([
                    {type: 'view', id: inspector.id, entity: 'inspector'},
                    {type: 'edit', id: inspector.id, entity: 'inspector', onclick: `editInspector(${inspector.id})`},
                    {type: 'reset-password', id: inspector.id}
                ])}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error(err);
        showNotification("Failed to load inspectors", 'error');
    }
}

// ================== VEHICLES ==================
// ================== VEHICLES ==================
let allVehicles = []; // Store all vehicles for filtering

async function loadAllVehicles() {
    try {
        // Fetch real data from the API
        const response = await fetch("http://localhost:8080/api/admin/vehicles/pending", {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${getAuthToken()}` }
        });
        
        if (response.ok) {
            allVehicles = await response.json();
            // Ensure status is set to pending if missing (since we fetched pending)
            allVehicles = allVehicles.map(v => ({...v, status: v.status || 'pending'}));
        } else {
            console.error("Failed to fetch vehicles");
            allVehicles = []; 
        }

        updateVehicleStats();
        filterVehicles(); 
        
    } catch (err) {
        console.error(err);
        showErrorState("Failed to load vehicle data");
    }
}

// Alias for nav link click, as HTML calls loadPendingVehicles
const loadPendingVehicles = loadAllVehicles; 

function updateVehicleStats() {
    const pending = allVehicles.filter(v => v.status === 'pending').length;
    // Dummy values for other statuses as requested
    const approved = 12 + allVehicles.filter(v => v.status === 'approved').length;
    const scheduled = 8 + allVehicles.filter(v => v.status === 'scheduled').length;
    const completed = 45 + allVehicles.filter(v => v.status === 'completed').length;

    const pendingEl = document.getElementById('pendingCount');
    const approvedEl = document.getElementById('approvedCount');
    const scheduledEl = document.getElementById('scheduledCount');
    const completedEl = document.getElementById('completedCount');

    if (pendingEl) pendingEl.textContent = pending;
    if (approvedEl) approvedEl.textContent = approved;
    if (scheduledEl) scheduledEl.textContent = scheduled;
    if (completedEl) completedEl.textContent = completed;
}

function filterVehicles() {
    const statusFilter = document.getElementById("statusFilter").value;
    const searchText = document.getElementById("vehicleSearch").value.toLowerCase();
    
    const filtered = allVehicles.filter(vehicle => {
        const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
        // statusFilter might be 'pending', but vehicle.status could be undefined if API doesn't return it
        // Ensure robust matching
        
        const make = vehicle.make ? vehicle.make.toLowerCase() : '';
        const model = vehicle.model ? vehicle.model.toLowerCase() : '';
        const postedBy = vehicle.postedBy ? vehicle.postedBy.toLowerCase() : '';

        const matchesText = (
            make.includes(searchText) || 
            model.includes(searchText) || 
            postedBy.includes(searchText)
        );
        return matchesStatus && matchesText;
    });
    
    renderVehicles(filtered);
}

function renderVehicles(vehicles) {
    const container = document.getElementById('vehicle-container');
    if (!container) return;
    container.innerHTML = "";
    
    if (vehicles.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <i class="fas fa-search" style="font-size: 48px; margin-bottom: 15px; color: #cbd5e1;"></i>
                <h3 style="color: #64748b;">No vehicles found</h3>
                <p style="color: #94a3b8;">Try adjusting your search or filters</p>
            </div>
        `;
        return;
    }
    
    vehicles.forEach(v => container.appendChild(createVehicleCard(v)));
}

function createVehicleCard(vehicle) {
    const card = document.createElement('div');
    card.className = 'vehicle-card fade-in';
    
    // Premium Card Styling
    card.style.cssText = `
        background: white;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        transition: transform 0.2s, box-shadow 0.2s;
        border: 1px solid #f1f5f9;
        display: flex;
        flex-direction: column;
    `;

    card.onmouseover = () => {
        card.style.transform = 'translateY(-5px)';
        card.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
    };
    card.onmouseout = () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
    };

    const firstImage = (vehicle.images && vehicle.images.length > 0) ? vehicle.images[0] : null;
    
    const imgHtml = firstImage 
        ? `<div style="height: 200px; overflow: hidden;"><img src="${firstImage}" alt="${vehicle.make} ${vehicle.model}" style="width:100%; height:100%; object-fit:cover;"></div>` 
        : `<div style="width:100%; height:200px; background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%); display:flex; align-items:center; justify-content:center; color:#94a3b8;"><i class="fas fa-car" style="font-size:3.5rem;"></i></div>`;

    // Determine badge style
    let statusBadge = '';
    const status = vehicle.status || 'pending'; // Default to pending if unknown
    
    if (status === 'pending') statusBadge = '<span class="status-badge status-pending" style="padding: 6px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; letter-spacing: 0.025em; background-color: #fffbeb; color: #d97706; border: 1px solid #fcd34d;">Pending</span>';
    else if (status === 'approved') statusBadge = '<span class="status-badge status-active" style="padding: 6px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; letter-spacing: 0.025em; background-color: #f0fdf4; color: #16a34a; border: 1px solid #86efac;">Approved</span>';
    else if (status === 'rejected') statusBadge = '<span class="status-badge status-inactive" style="padding: 6px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; letter-spacing: 0.025em; background-color: #fef2f2; color: #dc2626; border: 1px solid #fca5a5;">Rejected</span>';
    else statusBadge = `<span class="status-badge" style="padding: 6px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; letter-spacing: 0.025em; background-color: #f1f5f9; color: #64748b;">${status}</span>`;

    // Actions
    let actionsHtml = '';
    if (status === 'pending') {
         actionsHtml = `
            <div class="vehicle-actions" style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; padding: 12px 20px 20px 20px; border-top:1px solid #f1f5f9; background: #f8fafc;">
                <button class="action-btn primary" onclick="approveVehicle(${vehicle.id})" style="justify-content:center; padding: 10px; border-radius: 8px; font-weight: 600; transition: all 0.2s;">
                    <i class="fas fa-check" style="margin-right: 6px;"></i> Approve
                </button>
                <button class="action-btn danger" onclick="rejectVehicle(${vehicle.id})" style="justify-content:center; padding: 10px; border-radius: 8px; font-weight: 600; transition: all 0.2s;">
                   <i class="fas fa-times" style="margin-right: 6px;"></i> Reject
                </button>
            </div>
         `;
    } else {
         actionsHtml = `
            <div class="vehicle-actions" style="padding: 12px 20px 20px 20px; border-top:1px solid #f1f5f9; background: #f8fafc;">
                <button class="action-btn secondary" onclick="viewVehicleDetails(${vehicle.id})" style="width: 100%; justify-content:center; padding: 10px; border-radius: 8px; font-weight: 600; transition: all 0.2s;">
                    <i class="fas fa-eye" style="margin-right: 6px;"></i> View Details
                </button>
            </div>
         `;
    }

    // Format Price
    const formattedPrice = vehicle.price ? `Rs ${vehicle.price.toLocaleString()}` : 'Price N/A';

    card.innerHTML = `
        <div class="vehicle-image">
            ${imgHtml}
        </div>
        <div class="vehicle-info" style="padding: 20px 20px 5px 20px; flex: 1; display: flex; flex-direction: column;">
            <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:12px; gap: 15px;">
                <div>
                    <h3 style="margin:0; font-size:1.25rem; font-weight: 700; color:#1e293b; letter-spacing: -0.025em; line-height: 1.2;">${vehicle.year} ${vehicle.make} ${vehicle.model}</h3>
                    <div style="display: flex; align-items: center; margin-top: 6px; color: #64748b; font-size: 0.875rem;">
                        <i class="fas fa-user-circle" style="margin-right: 6px; color: #94a3b8;"></i>
                        <span>${vehicle.postedBy || 'Unknown User'}</span>
                    </div>
                </div>
                ${statusBadge}
            </div>
            
            <div class="vehicle-footer" style="margin-top:auto; padding-top: 5px;">
                <span style="font-weight:800; font-size:1.5rem; color:#0f172a; letter-spacing: -0.025em;">${formattedPrice}</span>
            </div>
        </div>
        ${actionsHtml}
    `;
    return card;
}

function showEmptyState() {
     // This is now handled inside renderVehicles for empty results
}

function showErrorState(msg) {
    const container = document.getElementById('vehicle-container');
    if(container) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle" style="font-size: 48px; margin-bottom: 15px;"></i>
                <h3>${msg}</h3>
            </div>
        `;
    }
}

async function approveVehicle(id) {
    if(!confirm("Approve this vehicle listing?")) return;
    
    // Simulate API call success for demo
    showNotification("Vehicle approved successfully", 'success');
    
    // Update local state
    const vehicle = allVehicles.find(v => v.id === id);
    if(vehicle) {
        vehicle.status = 'approved';
        updateVehicleStats();
        filterVehicles();
    }
}

async function rejectVehicle(id) {
    if (!confirm('Reject this vehicle?')) return;
    
    // Simulate API call success for demo
    showNotification("Vehicle rejected", 'success');
    
    // Update local state
    const vehicle = allVehicles.find(v => v.id === id);
    if(vehicle) {
        vehicle.status = 'rejected';
        updateVehicleStats();
        filterVehicles();
    }
}

// ================== INSPECTIONS ==================
// Global variables for inspector assignment
let bookingId = null;
let selectedInspectorId = null;
let allInspectors = [];
let inspectionDate = null;

// Function to open the inspector assignment modal
function openAssignInspectorModal(inspectionId, appointmentDate) {
    bookingId = inspectionId;
    inspectionDate = appointmentDate;
    
    // Show the modal
    document.getElementById("assignInspectorModal").style.display = "flex";
    
    // Reset selection
    selectedInspectorId = null;
    document.getElementById("confirmAssignBtn").disabled = true;
    
    // Load available inspectors
    loadAvailableInspectors();
}

// Function to close the inspector modal
function closeInspectorModal() {
    document.getElementById("assignInspectorModal").style.display = "none";
    bookingId = null;
    selectedInspectorId = null;
    allInspectors = [];
}

// Function to load available inspectors
async function loadAvailableInspectors() {
    const container = document.getElementById("inspectorCardsContainer");
    const loading = document.getElementById("inspectorsLoading");
    const noInspectors = document.getElementById("noInspectorsMessage");
    
    // Show loading state
    loading.style.display = "flex";
    noInspectors.style.display = "none";
    container.innerHTML = '';
    
    try {
        // Fetch inspectors with workload for the specific date
        const response = await fetch(`http://localhost:8080/api/admin/inspectors/workload?date=${inspectionDate}`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${getAuthToken()}` }
        });
        
        if (!response.ok) throw new Error("Failed to fetch inspectors");
        
        const inspectors = await response.json();
        allInspectors = inspectors;
        
        // Hide loading
        loading.style.display = "none";
        
        if (inspectors.length === 0) {
            noInspectors.style.display = "block";
            return;
        }
        
        // Render inspector cards
        renderInspectorCards(inspectors);
    } catch (error) {
        console.error("Error loading inspectors:", error);
        loading.style.display = "none";
        noInspectors.style.display = "block";
        noInspectors.innerHTML = `
            <i class="fas fa-exclamation-triangle" style="font-size: 48px; margin-bottom: 15px;"></i>
            <h3>Failed to load inspectors</h3>
            <p>Please try again later</p>
        `;
    }
}

// Function to render inspector cards
function renderInspectorCards(inspectors) {
    const container = document.getElementById("inspectorCardsContainer");
    container.innerHTML = '';
    
    inspectors.forEach(inspector => {
        const card = document.createElement('div');
        card.className = 'inspector-card';
        card.dataset.id = inspector.inspectorId;
        
        // Determine workload level
        let workloadLevel = 'low';
        let workloadClass = 'low-workload';
        let workloadPercentage = Math.min((inspector.dailyBookingCount / 8) * 100, 100);
        
        if (inspector.dailyBookingCount >= 6) {
            workloadLevel = 'high';
            workloadClass = 'high-workload';
        } else if (inspector.dailyBookingCount >= 3) {
            workloadLevel = 'medium';
            workloadClass = 'medium-workload';
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

// Function to select an inspector
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
    document.getElementById("confirmAssignBtn").disabled = false;
}

// Function to filter inspectors in the modal
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
    noInspectors.style.display = filteredInspectors.length === 0 ? "block" : "none";
}

// Function to assign the selected inspector
async function assignInspector() {
    if (!selectedInspectorId || !bookingId) {
        showNotification("Please select an inspector first", "error");
        return;
    }

    try {
        const assignBtn = document.getElementById("confirmAssignBtn");
        assignBtn.disabled = true;
        assignBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Assigning...';

        // Send assignment request
        const response = await fetch(`http://localhost:8080/api/admin/inspectors/${bookingId}/assign-inspector`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify({
                inspectorId: selectedInspectorId
            })
        });

        if (response.ok) {
            showNotification("Inspector assigned successfully", "success");
            closeInspectorModal();
            loadInspections();
        } else {
            const errorData = await response.json();
            showNotification(errorData?.message || "Failed to assign inspector", "error");
        }
    } catch (error) {
        console.error("Error assigning inspector:", error);
        showNotification("Failed to assign inspector", "error");
    } finally {
        const assignBtn = document.getElementById("confirmAssignBtn");
        assignBtn.disabled = false;
        assignBtn.innerHTML = '<i class="fas fa-user-check"></i> Assign Inspector';
    }
}

// Load inspections
async function loadInspections() {
    try {
        const response = await fetch("http://localhost:8080/api/admin/inspections", {
            method: "GET",
            headers: { "Authorization": `Bearer ${getAuthToken()}` }
        });
        
        if (!response.ok) throw new Error("Failed to fetch inspections");
        
        const inspections = await response.json();
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

    // ✅ Reverse so newest appears first
    data.reverse();

    data.forEach(inspection => {
        const dateOnly = inspection.appointmentDateTime 
            ? inspection.appointmentDateTime.split(' ')[0] 
            : '';

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>
                <div style="font-weight: 600; color: #1e40af;">${inspection.inspectionId || 'N/A'}</div>
                <div style="font-size: 12px; color: #64748b;">${getTypeBadge(inspection.inspectionType || 'general')}</div>
            </td>
            <td>${inspection.customerName || 'N/A'}</td>
            <td>
                <div style="font-weight: 600; color: #0f172a;">${inspection.vehicleNumber || 'N/A'}</div>
                <div style="font-size: 12px; color: #64748b;">Vehicle Details</div>
            </td>
            <td>${inspection.location || 'N/A'}</td>
            <td>${formatTimeDisplay(inspection.appointmentDateTime)}</td>
            <td>${getStatusBadge(inspection.status || 'pending')}</td>
            <td>${inspection.assignedInspector || 'Not assigned'}</td>
            <td>${getActionButtons([
                {type: 'view', id: inspection.inspectionId, entity: 'inspection'},
                ...(inspection.assignable ? [{
                    type: 'assign', 
                    onclick: `openAssignInspectorModal('${inspection.inspectionId}', '${dateOnly}')`
                }] : []),
                {type: 'edit', id: inspection.inspectionId, entity: 'inspection'}
            ])}</td>
        `;
        tbody.appendChild(tr);
    });
}


// ================== USER MANAGEMENT ==================
function filterUsers() {
    const searchTerm = document.getElementById('userSearch')?.value.toLowerCase() || '';
    const roleFilter = document.getElementById('roleFilter')?.value || 'all';
    const rows = document.querySelectorAll('#usersTableBody tr');
    
    rows.forEach(row => {
        const name = row.querySelector('td:first-child')?.textContent.toLowerCase() || '';
        const email = row.querySelector('td:nth-child(2)')?.textContent.toLowerCase() || '';
        const roleElement = row.querySelector('td:nth-child(4) .type-badge');
        const role = roleElement ? roleElement.textContent.toLowerCase() : '';
        
        const matchesSearch = name.includes(searchTerm) || email.includes(searchTerm);
        const matchesRole = roleFilter === 'all' || role.includes(roleFilter);
        
        row.style.display = (matchesSearch && matchesRole) ? '' : 'none';
    });
}

// Function to populate users table with styling
function populateUsersTable(users) {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (users.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:gray;">No users found</td></tr>`;
        return;
    }
    
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${getUserInfoCell({
                name: `${user.firstName} ${user.lastName}`,
                email: user.email
            })}</td>
            <td>${user.email}</td>
            <td>${user.contactNumber || 'Not provided'}</td>
            <td>${getTypeBadge(user.role || 'customer')}</td>
            <td>${getStatusBadge(user.status || 'active')}</td>
            <td>${getActionButtons([
                {type: 'view', id: user.id, entity: 'user'},
                {type: 'edit', id: user.id, entity: 'user'},
                ...(user.role === 'customer' ? [{type: 'delete', id: user.id, entity: 'user'}] : [])
            ])}</td>
        `;
        tbody.appendChild(row);
    });
}

// ================== ACTION HANDLERS ==================
function viewDetails(id, entity) {
    showNotification(`View ${entity} details: ${id}`, 'info');
}

function editEntity(id, entity) {
    showNotification(`Edit ${entity}: ${id}`, 'info');
}

function deleteEntity(id, entity) {
    if (confirm(`Are you sure you want to delete this ${entity}?`)) {
        showNotification(`Delete ${entity}: ${id} (not implemented)`, 'warning');
    }
}

function resetPassword(id) {
    if (confirm('Send password reset email to this user?')) {
        showNotification(`Password reset sent for user: ${id}`, 'success');
    }
}

function editInspector(id) {
    showNotification(`Edit inspector ${id} functionality not implemented yet`, 'info');
}

function deleteInspector(id) {
    if (confirm('Are you sure you want to delete this inspector?')) {
        showNotification(`Delete inspector ${id} functionality not implemented yet`, 'info');
    }
}

// ================== FILTER FUNCTIONS ==================
function filterInspectorsByCenter(centerId) {
    const rows = document.querySelectorAll("#inspectorsTableBody tr");
    rows.forEach(row => {
        const centerCell = row.querySelector("td:nth-child(3)");
        if (centerCell) {
            const rowCenterId = centerCell.textContent.trim();
            row.style.display = (!centerId || rowCenterId.includes(centerId)) ? "" : "none";
        }
    });
}

function filterInspectors(searchTerm) {
    const rows = document.querySelectorAll("#inspectorsTableBody tr");
    searchTerm = searchTerm.toLowerCase();
    
    rows.forEach(row => {
        const nameCell = row.querySelector("td:nth-child(1)");
        const emailCell = row.querySelector("td:nth-child(2)");
        
        if (nameCell && emailCell) {
            const name = nameCell.textContent.toLowerCase();
            const email = emailCell.textContent.toLowerCase();
            
            row.style.display = (name.includes(searchTerm) || email.includes(searchTerm)) ? "" : "none";
        }
    });
}

function filterInspections(searchTerm) {
    const rows = document.querySelectorAll("#inspectionsTableBody tr");
    searchTerm = searchTerm.toLowerCase();
    
    rows.forEach(row => {
        const cells = row.querySelectorAll("td");
        let matches = false;
        
        cells.forEach(cell => {
            if (cell.textContent.toLowerCase().includes(searchTerm)) {
                matches = true;
            }
        });
        
        row.style.display = matches ? "" : "none";
    });
}

function filterInspectionsByStatus(status) {
    const rows = document.querySelectorAll("#inspectionsTableBody tr");
    
    rows.forEach(row => {
        const statusCell = row.querySelector("td:nth-child(6) .status-badge");
        if (statusCell) {
            const rowStatus = statusCell.textContent.toLowerCase();
            row.style.display = (!status || rowStatus.includes(status.toLowerCase())) ? "" : "none";
        }
    });
}

// ================== NAVIGATION HELPERS ==================
function navigateToUsers() {
    const usersLink = document.querySelector('.nav-link[data-section="users"]');
    if (usersLink) {
        usersLink.click();
    }
}

// ================== INIT ==================
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    
    // Add enhanced styling
    addEnhancedStyling();
    
    // Load initial data for the active section
    const activeSection = document.querySelector('.content-section.active');
    if (activeSection) {
        if (activeSection.id === 'centers') {
            loadCenters();
            loadCenterNames();
        } else if (activeSection.id === 'inspectors') {
            loadInspectors();
            loadCenterNames();
        } else if (activeSection.id === 'vehicles') {
            loadPendingVehicles();
        } else if (activeSection.id === 'inspections') {
            loadInspections();
        }
    }
    
    // Add event listeners for modal functionality
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
});

// Function to add enhanced styling CSS
function addEnhancedStyling() {
    if (document.getElementById('enhanced-admin-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'enhanced-admin-styles';
    style.textContent = `
        /* Enhanced action button styles */
        .action-icon.delete {
            background: #fee2e2;
            color: #dc2626;
        }
        
        .action-icon.delete:hover {
            background: #fecaca;
            color: #b91c1c;
        }
        
        /* Inspector card styles */
        .inspector-card {
            background: white;
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
        }
        
        .inspector-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
            border-color: #1e40af;
        }
        
        .inspector-card.selected {
            border-color: #1e40af;
            background: linear-gradient(135deg, #f8fafc, #f1f5f9);
            box-shadow: 0 4px 20px rgba(30, 64, 175, 0.1);
        }
        
        .inspector-name {
            font-size: 16px;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 8px;
        }
        
        .inspector-detail {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 6px;
            font-size: 13px;
            color: #64748b;
        }
        
        .detail-icon {
            width: 16px;
            color: #94a3b8;
        }
        
        .specializations {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-top: 8px;
        }
        
        .specialization-tag {
            background: linear-gradient(135deg, #dbeafe, #bfdbfe);
            color: #1e40af;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            border: 1px solid #93c5fd;
        }
        
        .workload-indicator {
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #e2e8f0;
        }
        
        .workload-text {
            font-size: 12px;
            font-weight: 600;
            margin-bottom: 8px;
            color: #374151;
        }
        
        .workload-bar {
            height: 6px;
            background: #f1f5f9;
            border-radius: 3px;
            overflow: hidden;
            position: relative;
        }
        
        .workload-fill {
            height: 100%;
            border-radius: 3px;
            transition: width 0.5s ease;
        }
        
        .low-workload {
            background: linear-gradient(90deg, #22c55e, #16a34a);
        }
        
        .medium-workload {
            background: linear-gradient(90deg, #f59e0b, #d97706);
        }
        
        .high-workload {
            background: linear-gradient(90deg, #ef4444, #dc2626);
        }
        
        .loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 40px;
            color: #64748b;
            text-align: center;
            grid-column: 1 / -1;
        }
        
        .loading i {
            font-size: 24px;
            margin-bottom: 15px;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        /* Empty state styling */
        .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: #64748b;
            grid-column: 1 / -1;
        }
        
        .empty-state h3 {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 10px;
            color: #374151;
        }
        
        .empty-state i {
            color: #94a3b8;
        }
        
        /* Enhanced vehicle card actions */
        .vehicle-actions {
            display: flex;
            gap: 10px;
            margin-top: 15px;
        }
        
        .vehicle-actions .action-buttons {
            width: 100%;
            justify-content: space-between;
        }
        
        .vehicle-actions .btn-approve,
        .vehicle-actions .btn-reject {
            flex: 1;
            justify-content: center;
        }
    `;
    
    document.head.appendChild(style);
}

// Export styling helpers for external use
window.AdminStyleHelpers = {
    getStatusBadge,
    getTypeBadge,
    getActionButtons,
    getUserAvatar,
    getUserInfoCell,
    getSpecializationsDisplay,
    formatTimeDisplay,
    getWorkloadIndicator,
    populateUsersTable
};