// Global variables
let currentInspection = null;
let currentBookingData = null;

// Load today's schedule
async function loadTodaySchedule() {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            showNotification("Not authenticated. Please login again.", "error");
            return;
        }

        const response = await fetch("http://localhost:8080/api/inspector/schedule/today", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch schedule data");
        }

        const schedule = await response.json();
        const tbody = document.querySelector("#dashboard table tbody");
        tbody.innerHTML = ""; // clear old rows

        schedule.forEach(item => {
            const statusClass = item.status.toLowerCase().replace('_', '-');
            const row = `
                <tr>
                    <td>${item.time}</td>
                    <td>${item.bookingId}</td>
                    <td>${item.customerName}</td>
                    <td>${item.vehicle}</td>
                    <td>${item.inspectionType}</td>
                    <td>${item.serviceType}</td>
                    <td>${item.location}</td>
                    <td><span class="status-badge status-${statusClass}">${item.status}</span></td>
                    <td>
                        <div class="action-buttons">
                            ${item.status === "SCHEDULED" 
                                ? `<button class="action-btn start" title="Start Inspection" onclick="startInspection('${item.bookingId}', '${item.inspectionType}', ${JSON.stringify(item).replace(/'/g, "\\'")})">
                                    <i class="fas fa-play"></i>
                                </button>`
                                : item.status === "IN_PROGRESS"
                                    ? `<button class="action-btn complete" title="Continue Inspection" onclick="continueInspection('${item.bookingId}', '${item.inspectionType}', ${JSON.stringify(item).replace(/'/g, "\\'")})">
                                        <i class="fas fa-edit"></i>
                                    </button>`
                                    : ''
                            }
                            <button class="action-btn view" title="View Details" onclick="viewDetails('${item.bookingId}')">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    } catch (error) {
        console.error("Error loading schedule:", error);
        showNotification("Error loading today's schedule", "error");
    }
}

// Start inspection
function startInspection(bookingId, inspectionType, bookingData) {
    currentInspection = { bookingId, inspectionType };
    currentBookingData = bookingData;
    loadInspectionForm(inspectionType, bookingData);
    document.getElementById('inspectionModal').style.display = 'flex';
}

// Continue inspection
function continueInspection(bookingId, inspectionType, bookingData) {
    currentInspection = { bookingId, inspectionType };
    currentBookingData = bookingData;
    loadInspectionForm(inspectionType, bookingData, true);
    document.getElementById('inspectionModal').style.display = 'flex';
}

// Load inspection form based on type
function loadInspectionForm(inspectionType, bookingData, isResume = false) {
    const modalTitle = document.getElementById('inspectionModalTitle');
    const formContent = document.getElementById('inspectionFormContent');
    
    modalTitle.innerHTML = `<i class="fas fa-clipboard-check"></i> ${inspectionType} Inspection - ${bookingData.bookingId}`;
    
    let formHtml = '';
    
    // Generate form based on inspection type
    switch (inspectionType) {
        case 'Annual Safety':
            formHtml = generateAnnualSafetyForm(bookingData);
            break;
        case 'Emissions Test':
            formHtml = generateEmissionsForm(bookingData);
            break;
        case 'Pre-Purchase':
            formHtml = generatePrePurchaseForm(bookingData);
            break;
        case 'Brake Inspection':
            formHtml = generateBrakeInspectionForm(bookingData);
            break;
        default:
            formHtml = generateGeneralInspectionForm(bookingData);
    }
    
    formContent.innerHTML = formHtml;
    
    // Load draft data if resuming
    if (isResume) {
        loadDraftData(bookingData.bookingId);
    }
}

// Generate Annual Safety Inspection Form
function generateAnnualSafetyForm(bookingData) {
    return `
        <div class="form-section">
            <h4>Booking Information</h4>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Booking ID</label>
                    <input type="text" class="form-input" value="${bookingData.bookingId}" readonly>
                </div>
                <div class="form-group">
                    <label class="form-label">Customer</label>
                    <input type="text" class="form-input" value="${bookingData.customerName}" readonly>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Vehicle</label>
                    <input type="text" class="form-input" value="${bookingData.vehicle}" readonly>
                </div>
                <div class="form-group">
                    <label class="form-label">Service Type</label>
                    <input type="text" class="form-input" value="${bookingData.serviceType}" readonly>
                </div>
            </div>
        </div>

        <div class="form-section">
            <h4>Vehicle Information</h4>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">VIN Number</label>
                    <input type="text" class="form-input" id="vin" placeholder="Enter VIN" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Odometer Reading</label>
                    <input type="number" class="form-input" id="odometer" placeholder="Miles" required>
                </div>
            </div>
        </div>

        <div class="form-section">
            <h4>Exterior Inspection</h4>
            <div class="checkbox-group">
                <div class="checkbox-item">
                    <input type="checkbox" id="lights">
                    <label for="lights">All lights functioning</label>
                </div>
                <div class="checkbox-item">
                    <input type="checkbox" id="tires">
                    <label for="tires">Tire condition acceptable</label>
                </div>
                <div class="checkbox-item">
                    <input type="checkbox" id="bodyDamage">
                    <label for="bodyDamage">No significant body damage</label>
                </div>
                <div class="checkbox-item">
                    <input type="checkbox" id="windshield">
                    <label for="windshield">Windshield clear</label>
                </div>
            </div>
        </div>

        <div class="form-section">
            <h4>Engine & Mechanical</h4>
            <div class="checkbox-group">
                <div class="checkbox-item">
                    <input type="checkbox" id="engineStart">
                    <label for="engineStart">Engine starts properly</label>
                </div>
                <div class="checkbox-item">
                    <input type="checkbox" id="brakes">
                    <label for="brakes">Brakes functioning</label>
                </div>
                <div class="checkbox-item">
                    <input type="checkbox" id="steering">
                    <label for="steering">Steering responsive</label>
                </div>
                <div class="checkbox-item">
                    <input type="checkbox" id="suspension">
                    <label for="suspension">Suspension working</label>
                </div>
            </div>
        </div>

        <div class="form-section">
            <h4>Interior Safety</h4>
            <div class="checkbox-group">
                <div class="checkbox-item">
                    <input type="checkbox" id="seatbelts">
                    <label for="seatbelts">All seatbelts functional</label>
                </div>
                <div class="checkbox-item">
                    <input type="checkbox" id="airbags">
                    <label for="airbags">Airbag warning lights off</label>
                </div>
                <div class="checkbox-item">
                    <input type="checkbox" id="mirrors">
                    <label for="mirrors">All mirrors present</label>
                </div>
                <div class="checkbox-item">
                    <input type="checkbox" id="horn">
                    <label for="horn">Horn working</label>
                </div>
            </div>
        </div>

        <div class="form-section">
            <h4>Final Assessment</h4>
            <div class="form-group">
                <label class="form-label">Inspection Result</label>
                <select class="form-input" id="inspectionResult" required>
                    <option value="">Select result</option>
                    <option value="PASS">Pass</option>
                    <option value="FAIL">Fail</option>
                    <option value="CONDITIONAL">Conditional Pass</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Inspector Notes</label>
                <textarea class="form-textarea" id="inspectorNotes" placeholder="Enter any additional observations or concerns..." required></textarea>
            </div>
        </div>
    `;
}

// Generate Emissions Test Form
function generateEmissionsForm(bookingData) {
    return `
        <div class="form-section">
            <h4>Booking Information</h4>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Booking ID</label>
                    <input type="text" class="form-input" value="${bookingData.bookingId}" readonly>
                </div>
                <div class="form-group">
                    <label class="form-label">Customer</label>
                    <input type="text" class="form-input" value="${bookingData.customerName}" readonly>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Vehicle</label>
                    <input type="text" class="form-input" value="${bookingData.vehicle}" readonly>
                </div>
                <div class="form-group">
                    <label class="form-label">Service Type</label>
                    <input type="text" class="form-input" value="${bookingData.serviceType}" readonly>
                </div>
            </div>
        </div>

        <div class="form-section">
            <h4>Vehicle Information</h4>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">VIN Number</label>
                    <input type="text" class="form-input" id="vin" placeholder="Enter VIN" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Engine Type</label>
                    <input type="text" class="form-input" id="engineType" placeholder="e.g., 4-cylinder, V6" required>
                </div>
            </div>
        </div>

        <div class="form-section">
            <h4>Emissions Test Results</h4>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">CO Level (ppm)</label>
                    <input type="number" step="0.01" class="form-input" id="coLevel" placeholder="0.00" required>
                </div>
                <div class="form-group">
                    <label class="form-label">HC Level (ppm)</label>
                    <input type="number" step="0.01" class="form-input" id="hcLevel" placeholder="0.00" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">NOx Level (ppm)</label>
                    <input type="number" step="0.01" class="form-input" id="noxLevel" placeholder="0.00" required>
                </div>
                <div class="form-group">
                    <label class="form-label">O2 Level (%)</label>
                    <input type="number" step="0.01" class="form-input" id="o2Level" placeholder="0.00" required>
                </div>
            </div>
        </div>

        <div class="form-section">
            <h4>Visual Inspection</h4>
            <div class="checkbox-group">
                <div class="checkbox-item">
                    <input type="checkbox" id="catalyticConverter">
                    <label for="catalyticConverter">Catalytic converter present</label>
                </div>
                <div class="checkbox-item">
                    <input type="checkbox" id="exhaustSystem">
                    <label for="exhaustSystem">Exhaust system intact</label>
                </div>
                <div class="checkbox-item">
                    <input type="checkbox" id="airFilter">
                    <label for="airFilter">Air filter clean</label>
                </div>
                <div class="checkbox-item">
                    <input type="checkbox" id="gasCapSeal">
                    <label for="gasCapSeal">Gas cap seals properly</label>
                </div>
            </div>
        </div>

        <div class="form-section">
            <h4>Test Results</h4>
            <div class="form-group">
                <label class="form-label">Overall Result</label>
                <select class="form-input" id="inspectionResult" required>
                    <option value="">Select result</option>
                    <option value="PASS">Pass</option>
                    <option value="FAIL">Fail</option>
                    <option value="CONDITIONAL">Conditional Pass</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Inspector Notes</label>
                <textarea class="form-textarea" id="inspectorNotes" placeholder="Enter test details and observations..." required></textarea>
            </div>
        </div>
    `;
}

// Generate Pre-Purchase Inspection Form
function generatePrePurchaseForm(bookingData) {
    return `
        <div class="form-section">
            <h4>Booking Information</h4>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Booking ID</label>
                    <input type="text" class="form-input" value="${bookingData.bookingId}" readonly>
                </div>
                <div class="form-group">
                    <label class="form-label">Customer</label>
                    <input type="text" class="form-input" value="${bookingData.customerName}" readonly>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Vehicle</label>
                    <input type="text" class="form-input" value="${bookingData.vehicle}" readonly>
                </div>
                <div class="form-group">
                    <label class="form-label">Service Type</label>
                    <input type="text" class="form-input" value="${bookingData.serviceType}" readonly>
                </div>
            </div>
        </div>

        <div class="form-section">
            <h4>Vehicle Overview</h4>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">VIN Number</label>
                    <input type="text" class="form-input" id="vin" placeholder="Enter VIN" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Odometer Reading</label>
                    <input type="number" class="form-input" id="odometer" placeholder="Miles" required>
                </div>
            </div>
        </div>

        <div class="form-section">
            <h4>Exterior Condition</h4>
            <div class="checkbox-group">
                <div class="checkbox-item">
                    <input type="checkbox" id="paintCondition">
                    <label for="paintCondition">Paint in good condition</label>
                </div>
                <div class="checkbox-item">
                    <input type="checkbox" id="bodyPanels">
                    <label for="bodyPanels">Body panels aligned</label>
                </div>
                <div class="checkbox-item">
                    <input type="checkbox" id="rust">
                    <label for="rust">No significant rust</label>
                </div>
                <div class="checkbox-item">
                    <input type="checkbox" id="tireWear">
                    <label for="tireWear">Even tire wear</label>
                </div>
            </div>
        </div>

        <div class="form-section">
            <h4>Engine & Mechanical</h4>
            <div class="checkbox-group">
                <div class="checkbox-item">
                    <input type="checkbox" id="engineSound">
                    <label for="engineSound">Engine runs smoothly</label>
                </div>
                <div class="checkbox-item">
                    <input type="checkbox" id="fluidLeaks">
                    <label for="fluidLeaks">No fluid leaks</label>
                </div>
                <div class="checkbox-item">
                    <input type="checkbox" id="transmission">
                    <label for="transmission">Transmission shifts properly</label>
                </div>
                <div class="checkbox-item">
                    <input type="checkbox" id="airConditioning">
                    <label for="airConditioning">A/C working</label>
                </div>
            </div>
        </div>

        <div class="form-section">
            <h4>Interior Assessment</h4>
            <div class="checkbox-group">
                <div class="checkbox-item">
                    <input type="checkbox" id="seatCondition">
                    <label for="seatCondition">Seats in good condition</label>
                </div>
                <div class="checkbox-item">
                    <input type="checkbox" id="electronics">
                    <label for="electronics">All electronics functional</label>
                </div>
                <div class="checkbox-item">
                    <input type="checkbox" id="odorIssues">
                    <label for="odorIssues">No unusual odors</label>
                </div>
                <div class="checkbox-item">
                    <input type="checkbox" id="dashboard">
                    <label for="dashboard">Dashboard complete</label>
                </div>
            </div>
        </div>

        <div class="form-section">
            <h4>Overall Assessment</h4>
            <div class="form-group">
                <label class="form-label">Condition Rating</label>
                <select class="form-input" id="conditionRating" required>
                    <option value="">Select rating</option>
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Purchase Recommendation</label>
                <select class="form-input" id="recommendation" required>
                    <option value="">Select recommendation</option>
                    <option value="recommended">Recommended</option>
                    <option value="conditional">Recommended with conditions</option>
                    <option value="not-recommended">Not recommended</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Inspection Result</label>
                <select class="form-input" id="inspectionResult" required>
                    <option value="">Select result</option>
                    <option value="PASS">Pass</option>
                    <option value="FAIL">Fail</option>
                    <option value="CONDITIONAL">Conditional Pass</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Inspector Notes</label>
                <textarea class="form-textarea" id="inspectorNotes" placeholder="Detailed assessment and recommendations..." required></textarea>
            </div>
        </div>
    `;
}

// Generate Brake Inspection Form
function generateBrakeInspectionForm(bookingData) {
    return `
        <div class="form-section">
            <h4>Booking Information</h4>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Booking ID</label>
                    <input type="text" class="form-input" value="${bookingData.bookingId}" readonly>
                </div>
                <div class="form-group">
                    <label class="form-label">Customer</label>
                    <input type="text" class="form-input" value="${bookingData.customerName}" readonly>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Vehicle</label>
                    <input type="text" class="form-input" value="${bookingData.vehicle}" readonly>
                </div>
                <div class="form-group">
                    <label class="form-label">Service Type</label>
                    <input type="text" class="form-input" value="${bookingData.serviceType}" readonly>
                </div>
            </div>
        </div>

        <div class="form-section">
            <h4>Vehicle Information</h4>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">VIN Number</label>
                    <input type="text" class="form-input" id="vin" placeholder="Enter VIN" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Odometer Reading</label>
                    <input type="number" class="form-input" id="odometer" placeholder="Miles" required>
                </div>
            </div>
        </div>

        <div class="form-section">
            <h4>Front Brakes</h4>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Left Pad Thickness (mm)</label>
                    <input type="number" step="0.1" class="form-input" id="leftFrontPad" placeholder="0.0" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Right Pad Thickness (mm)</label>
                    <input type="number" step="0.1" class="form-input" id="rightFrontPad" placeholder="0.0" required>
                </div>
            </div>
            <div class="checkbox-group">
                <div class="checkbox-item">
                    <input type="checkbox" id="frontRotorCondition">
                    <label for="frontRotorCondition">Front rotors in good condition</label>
                </div>
                <div class="checkbox-item">
                    <input type="checkbox" id="frontCalipers">
                    <label for="frontCalipers">Front calipers functioning</label>
                </div>
            </div>
        </div>

        <div class="form-section">
            <h4>Rear Brakes</h4>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Left Pad Thickness (mm)</label>
                    <input type="number" step="0.1" class="form-input" id="leftRearPad" placeholder="0.0" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Right Pad Thickness (mm)</label>
                    <input type="number" step="0.1" class="form-input" id="rightRearPad" placeholder="0.0" required>
                </div>
            </div>
            <div class="checkbox-group">
                <div class="checkbox-item">
                    <input type="checkbox" id="rearRotorCondition">
                    <label for="rearRotorCondition">Rear rotors in good condition</label>
                </div>
                <div class="checkbox-item">
                    <input type="checkbox" id="rearCalipers">
                    <label for="rearCalipers">Rear calipers functioning</label>
                </div>
            </div>
        </div>

        <div class="form-section">
            <h4>Brake System</h4>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Brake Fluid Level</label>
                    <select class="form-input" id="brakeFluidLevel" required>
                        <option value="">Select level</option>
                        <option value="full">Full</option>
                        <option value="adequate">Adequate</option>
                        <option value="low">Low</option>
                        <option value="empty">Empty</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Brake Pedal Feel</label>
                    <select class="form-input" id="pedalFeel" required>
                        <option value="">Select feel</option>
                        <option value="firm">Firm</option>
                        <option value="soft">Soft</option>
                        <option value="spongy">Spongy</option>
                    </select>
                </div>
            </div>
            <div class="checkbox-group">
                <div class="checkbox-item">
                    <input type="checkbox" id="brakeLines">
                    <label for="brakeLines">Brake lines intact</label>
                </div>
                <div class="checkbox-item">
                    <input type="checkbox" id="masterCylinder">
                    <label for="masterCylinder">Master cylinder working</label>
                </div>
                <div class="checkbox-item">
                    <input type="checkbox" id="parkingBrake">
                    <label for="parkingBrake">Parking brake effective</label>
                </div>
            </div>
        </div>

        <div class="form-section">
            <h4>Test Results</h4>
            <div class="form-group">
                <label class="form-label">Overall Brake Condition</label>
                <select class="form-input" id="overallCondition" required>
                    <option value="">Select condition</option>
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="needs-service">Needs Service</option>
                    <option value="unsafe">Unsafe</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Inspection Result</label>
                <select class="form-input" id="inspectionResult" required>
                    <option value="">Select result</option>
                    <option value="PASS">Pass</option>
                    <option value="FAIL">Fail</option>
                    <option value="CONDITIONAL">Conditional Pass</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Inspector Notes</label>
                <textarea class="form-textarea" id="inspectorNotes" placeholder="Detailed brake system assessment..." required></textarea>
            </div>
        </div>
    `;
}

// Generate General Inspection Form
function generateGeneralInspectionForm(bookingData) {
    return `
        <div class="form-section">
            <h4>Booking Information</h4>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Booking ID</label>
                    <input type="text" class="form-input" value="${bookingData.bookingId}" readonly>
                </div>
                <div class="form-group">
                    <label class="form-label">Customer</label>
                    <input type="text" class="form-input" value="${bookingData.customerName}" readonly>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Vehicle</label>
                    <input type="text" class="form-input" value="${bookingData.vehicle}" readonly>
                </div>
                <div class="form-group">
                    <label class="form-label">Service Type</label>
                    <input type="text" class="form-input" value="${bookingData.serviceType}" readonly>
                </div>
            </div>
        </div>

        <div class="form-section">
            <h4>General Vehicle Inspection</h4>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">VIN Number</label>
                    <input type="text" class="form-input" id="vin" placeholder="Enter VIN" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Inspection Type</label>
                    <input type="text" class="form-input" id="customInspectionType" value="${bookingData.inspectionType}" readonly>
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Inspection Result</label>
                <select class="form-input" id="inspectionResult" required>
                    <option value="">Select result</option>
                    <option value="PASS">Pass</option>
                    <option value="FAIL">Fail</option>
                    <option value="CONDITIONAL">Conditional Pass</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Inspector Notes</label>
                <textarea class="form-textarea" id="inspectorNotes" placeholder="Enter inspection details..." required></textarea>
            </div>
        </div>
    `;
}

// Load draft data from localStorage
function loadDraftData(bookingId) {
    const draftKey = `inspection_draft_${bookingId}`;
    const draftData = localStorage.getItem(draftKey);
    
    if (draftData) {
        const data = JSON.parse(draftData);
        const formData = data.formData;
        
        // Populate form fields with draft data
        for (const [key, value] of Object.entries(formData)) {
            const element = document.getElementById(key);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = value;
                } else {
                    element.value = value;
                }
            }
        }
        
        showNotification('Draft data loaded successfully', 'info');
    }
}

// Save inspection draft
function saveInspectionDraft() {
    if (!currentInspection) return;
    
    // Collect form data
    const formData = collectInspectionData();
    
    // Save to localStorage as draft
    const draftKey = `inspection_draft_${currentInspection.bookingId}`;
    localStorage.setItem(draftKey, JSON.stringify({
        ...currentInspection,
        formData: formData,
        savedAt: new Date().toISOString()
    }));
    
    showNotification('Inspection draft saved successfully', 'success');
}

// Collect inspection data from form
function collectInspectionData() {
    const formData = {};
    const modal = document.getElementById('inspectionModal');
    
    // Collect all input values
    const inputs = modal.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        if (input.id && !input.readOnly && input.id !== 'customInspectionType') {
            if (input.type === 'checkbox') {
                formData[input.id] = input.checked;
            } else {
                formData[input.id] = input.value;
            }
        }
    });
    
    return formData;
}

// Validate inspection form
function validateInspectionForm(formData) {
    // Check required fields
    if (!formData.vin || !formData.vin.trim()) {
        showNotification('VIN number is required', 'error');
        return false;
    }
    
    if (!formData.inspectionResult) {
        showNotification('Inspection result is required', 'error');
        return false;
    }
    
    if (!formData.inspectorNotes || !formData.inspectorNotes.trim()) {
        showNotification('Inspector notes are required', 'error');
        return false;
    }
    
    return true;
}

// Submit inspection
async function submitInspection() {
    if (!currentInspection || !currentBookingData) return;
    
    // Collect form data
    const formData = collectInspectionData();
    
    // Validate required fields
    if (!validateInspectionForm(formData)) {
        return;
    }
    
    try {
        // Generate PDF report
        const pdfUrl = await generatePDFReport(formData);
        
        // Prepare DTO for backend
        const inspectionDTO = {
            bookingId: currentInspection.bookingId,
            bookingVehicleId: currentBookingData.bookingVehicleId, // You'll need to get this from your data
            type: currentInspection.inspectionType,
            result: formData.inspectionResult,
            reportUrl: pdfUrl
        };
        
        const token = localStorage.getItem("token");
        
        // Submit to backend
        const response = await fetch("http://localhost:8080/api/inspections/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(inspectionDTO)
        });
        
        const result = await response.json();
        
        if (result.code === 200) {
            showNotification('Inspection completed and report sent to customer', 'success');
            closeModal('inspectionModal');
            
            // Clear draft
            localStorage.removeItem(`inspection_draft_${currentInspection.bookingId}`);
            
            // Refresh the page data
            setTimeout(() => {
                loadTodaySchedule();
            }, 2000);
        } else {
            showNotification(result.message || 'Failed to submit inspection', 'error');
        }
    } catch (error) {
        console.error("Inspection submission error:", error);
        showNotification('Server error. Please try again later.', 'error');
    }
}

// Generate PDF report
async function generatePDFReport(formData) {
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Add header
        doc.setFontSize(20);
        doc.text('AutoCert Vehicle Inspection Report', 20, 30);
        
        // Add booking info
        doc.setFontSize(12);
        doc.text(`Booking ID: ${currentInspection.bookingId}`, 20, 50);
        doc.text(`Inspection Type: ${currentInspection.inspectionType}`, 20, 60);
        doc.text(`Inspector: ${document.getElementById('inspectorName').textContent}`, 20, 70);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 80);
        
        // Add customer and vehicle info
        doc.text(`Customer: ${currentBookingData.customerName}`, 20, 95);
        doc.text(`Vehicle: ${currentBookingData.vehicle}`, 20, 105);
        doc.text(`Service Type: ${currentBookingData.serviceType}`, 20, 115);
        
        // Add form data
        let yPosition = 135;
        doc.setFontSize(14);
        doc.text('Inspection Details:', 20, yPosition);
        yPosition += 15;
        
        doc.setFontSize(10);
        for (const [key, value] of Object.entries(formData)) {
            if (value && key !== 'inspectorNotes') {
                const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                doc.text(`${label}: ${value}`, 20, yPosition);
                yPosition += 7;
                
                // Add new page if needed
                if (yPosition > 270) {
                    doc.addPage();
                    yPosition = 20;
                }
            }
        }
        
        // Add notes if present
        if (formData.inspectorNotes) {
            if (yPosition > 250) {
                doc.addPage();
                yPosition = 20;
            }
            
            doc.setFontSize(12);
            doc.text('Inspector Notes:', 20, yPosition);
            yPosition += 10;
            
            doc.setFontSize(10);
            const splitText = doc.splitTextToSize(formData.inspectorNotes, 170);
            doc.text(splitText, 20, yPosition);
        }
        
        // Save PDF to cloud storage (you'll need to implement this)
        const pdfBlob = doc.output('blob');
        const pdfUrl = await uploadToCloudStorage(pdfBlob, `inspection_report_${currentInspection.bookingId}.pdf`);
        
        return pdfUrl;
    } catch (error) {
        console.error("PDF generation error:", error);
        throw new Error("Failed to generate PDF report");
    }
}

// Upload to cloud storage (placeholder - implement based on your cloud provider)
async function uploadToCloudStorage(blob, fileName) {
    // This is a placeholder function
    // Implement based on your cloud storage solution (AWS S3, Google Cloud Storage, etc.)
    
    // For demo purposes, we'll return a mock URL
    return `https://cloudstorage.example.com/reports/${fileName}`;
}

// View details
function viewDetails(bookingId) {
    showNotification(`Viewing details for ${bookingId}`, 'info');
}

// Initialize when page loads
document.addEventListener("DOMContentLoaded", () => {
    loadTodaySchedule();
});