// ================== CONSTANTS & CONFIG ==================
let currentStep = 1;
const totalSteps = 4;
const token = localStorage.getItem("token"); // JWT stored in localStorage

// API Configuration
const API_BASE = "http://localhost:8080/api";
const API_BOOKINGS = `${API_BASE}/bookings`;
const API_CENTERS = `${API_BASE}/admin/centers`;

// Inspection Packages (Technical Protocols)
const InspectionType = {
    SAFETY: 5000,
    COMPREHENSIVE: 10000,
    PRE_PURCHASE: 7500,
    DIAGNOSTIC: 6000
};

// Available Time Slots
const TimeSlot = ["09:00", "10:30", "12:00", "15:00", "16:30"];

// ================== INITIALIZATION ==================
document.addEventListener('DOMContentLoaded', function() {
    
    // 1. INITIALIZE COMBO BOXES IMMEDIATELY (Fix for missing details)
    console.log("System Initialization: Loading Registry Data...");
    populateBrands();
    populateYears();
    setMinDate();

    // 2. RENDER INDUSTRIAL UI COMPONENTS
    renderInspectionTypes();
    renderTimeSlots();

    // 3. LOAD DYNAMIC DATA FROM BACKEND
    loadCenters();

    // 4. SETUP LOGIC & STEPPER
    setupEventListeners();
    updateProgress();
    showStep(currentStep);

    // 5. SECURITY VALIDATION
    if (!token) {
        console.warn("Unauthorized: System requires active token for protocol initiation.");
    }
});

// ================== UI POPULATION (REGISTRY) ==================

function populateYears() {
    const yearSelect = document.getElementById('year');
    if (!yearSelect) return;
    
    yearSelect.innerHTML = '<option value="">Select Production Year</option>';
    const currentYear = new Date().getFullYear();
    for (let y = currentYear; y >= 1990; y--) {
        const option = document.createElement('option');
        option.value = y;
        option.textContent = y;
        yearSelect.appendChild(option);
    }
}

function populateBrands() {
    const brands = ["Toyota","BMW","Honda","Mercedes","Ford","Nissan","Audi","Hyundai","Kia","Mazda", "Suzuki", "Mitsubishi"];
    const brandSelect = document.getElementById('brand');
    if (!brandSelect) return;

    brandSelect.innerHTML = '<option value="">Select Manufacturer</option>';
    brands.sort().forEach(brand => {
        const option = document.createElement('option');
        option.value = brand;
        option.textContent = brand;
        brandSelect.appendChild(option);
    });
}

function setMinDate() {
    const today = new Date();
    today.setDate(today.getDate() + 1); // Earliest deployment is T+1
    const dateInput = document.getElementById('inspectionDate');
    if(dateInput) dateInput.min = today.toISOString().split('T')[0];
}

// ================== DYNAMIC UI GENERATION ==================

function renderInspectionTypes() {
    const container = document.getElementById('inspectionGrid');
    if(!container) return;
    container.innerHTML = '';
    
    Object.entries(InspectionType).forEach(([name, price]) => {
        const card = document.createElement('div');
        card.className = 'service-option';
        
        card.innerHTML = `
            <input type="radio" name="inspectionType" value="${name}" id="insp-${name}">
            <label for="insp-${name}" style="width:100%; height:100%; display:block;">
                <div class="card-content">
                    <div class="card-icon">
                        <i class="fas fa-${getInspectionIcon(name)}"></i>
                    </div>
                    <div class="card-title">${formatInspectionName(name)} Protocol</div>
                    <div class="card-desc">${getInspectionDescription(name)}</div>
                    <div class="card-price">${price.toLocaleString()} LKR</div>
                </div>
            </label>
        `;
        container.appendChild(card);
    });
}

function renderTimeSlots() {
    const container = document.getElementById('timeSlots');
    if(!container) return;
    
    container.innerHTML = '';
    TimeSlot.forEach(slot => {
        const div = document.createElement('div');
        div.className='time-slot';
        div.dataset.time = slot;
        div.textContent = slot;
        container.appendChild(div);
    });
}

// ================== CENTER LOGISTICS ==================

async function loadCenters() {
    try {
        const res = await fetch(API_CENTERS, {
            method: 'GET',
            headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
        });
        
        if (!res.ok) { 
            renderCentersWithMock();
            return; 
        }
        
        const centers = await res.json();
        renderCenters(centers);
    } catch(err) {
        renderCentersWithMock();
    }
}

function renderCentersWithMock() {
    renderCenters([
        { id: 1, name: "Industrial Zone Center", address: "Sector 4, Main Rd", city: "Colombo" },
        { id: 2, name: "Regional Logistics Hub", address: "Hill Top Ave", city: "Kandy" }
    ]); 
}

function renderCenters(centers) {
    const container = document.getElementById('locationOptions');
    if(!container) return;
    container.innerHTML = '';

    // 1. Mobile Deployment Option
    const mobileOption = document.createElement('div');
    mobileOption.className = 'location-option';
    mobileOption.innerHTML = `
        <input type="radio" name="location" value="mobile" id="location-mobile">
        <label for="location-mobile" style="width:100%; height:100%; display:block;">
            <div class="card-content">
                <div class="card-icon"><i class="fas fa-truck-fast"></i></div>
                <div class="card-title">SITE DEPLOYMENT</div>
                <div class="card-desc">Technician arrives at your coordinates</div>
                <div class="card-price">+250 LKR</div>
            </div>
        </label>
    `;
    container.appendChild(mobileOption);

    // 2. Fixed Center Options
    centers.forEach(center => {
        const centerOption = document.createElement('div');
        centerOption.className = 'location-option';
        centerOption.innerHTML = `
            <input type="radio" name="location" value="center-${center.id}" id="location-${center.id}">
            <label for="location-${center.id}" style="width:100%; height:100%; display:block;">
                <div class="card-content">
                    <div class="card-icon"><i class="fas fa-microchip"></i></div>
                    <div class="card-title">${center.name}</div>
                    <div class="card-desc">${center.address}, ${center.city}</div>
                    <div class="card-price">System Default</div>
                </div>
            </label>
        `;
        container.appendChild(centerOption);
    });
}

// ================== SYSTEM LOGIC & NAVIGATION ==================

function setupEventListeners() {
    document.getElementById('nextBtn')?.addEventListener('click', nextStep);
    document.getElementById('prevBtn')?.addEventListener('click', previousStep);

    // FIX FOR CLASSLIST ERROR: Using robust parent detection
    document.addEventListener('change', e => {
        if (e.target.name === 'inspectionType' || e.target.name === 'location') {
            
            // Determine which class we are targeting based on the input name
            const targetClass = e.target.name === 'inspectionType' ? 'service-option' : 'location-option';
            
            // Safely find the closest container
            const parentCard = e.target.closest(`.${targetClass}`);
            
            if (parentCard) {
                // Clear all previous selections in this specific group
                document.querySelectorAll(`.${targetClass}`).forEach(c => c.classList.remove('selected'));
                // Add selected class to the container of the clicked radio
                parentCard.classList.add('selected');

                // Address logic for Mobile deployment
                if (e.target.name === 'location') {
                    const mobileAddress = document.getElementById('mobileAddress');
                    if (e.target.value === 'mobile') {
                        mobileAddress?.classList.add('show');
                        setMobileFieldsRequired(true);
                    } else {
                        mobileAddress?.classList.remove('show');
                        setMobileFieldsRequired(false);
                    }
                }
            }
        }
    });

    // Time Selection
    document.getElementById('timeSlots')?.addEventListener('click', e => {
        const timeSlot = e.target.closest('.time-slot');
        if (timeSlot && !timeSlot.classList.contains('unavailable')) {
            document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
            timeSlot.classList.add('selected');
            document.getElementById('selectedTime').value = timeSlot.dataset.time;
        }
    });

    document.getElementById('inspectionDate')?.addEventListener('change', updateTimeSlots);
}

function updateTimeSlots() {
    document.querySelectorAll('.time-slot').forEach(s => {
        s.classList.remove('unavailable','selected');
        if (Math.random() < 0.2) s.classList.add('unavailable'); 
    });
    const timeInput = document.getElementById('selectedTime');
    if(timeInput) timeInput.value = '';
}

function setMobileFieldsRequired(required) {
    ['streetAddress','city','stateProvince'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.required = required;
    });
}

// ================== STEP NAVIGATION & VALIDATION ==================

function validateStep(step){
    let valid = true;
    if(step === 1){
        ['brand','model','year'].forEach(id => {
            const el = document.getElementById(id);
            const err = document.getElementById(`${id}-error`);
            if(!el || !el.value.trim()){
                if(err) err.style.display = 'block'; 
                valid = false;
            } else {
                if(err) err.style.display = 'none';
            }
        });
    } else if(step === 2){
        if(!document.querySelector('input[name="inspectionType"]:checked')){
            alert('Select Diagnostic Protocol'); valid = false;
        }
    } else if(step === 3){
        const loc = document.querySelector('input[name="location"]:checked');
        const date = document.getElementById('inspectionDate');
        const time = document.getElementById('selectedTime');
        if(!loc || !date.value || !time.value){
            alert('Define Logistics & Window'); valid = false;
        }
    } else if(step === 4){
        if(!document.getElementById('termsAccepted').checked){
            alert('System Authorization Required'); valid = false;
        }
    }
    return valid;
}

function nextStep(){
    if(validateStep(currentStep)){
        if(currentStep < totalSteps){
            currentStep++; 
            showStep(currentStep); 
            updateProgress();
        }
        if(currentStep === 4){
            generateSummary(); 
            const btn = document.getElementById('nextBtn');
            if(btn) {
                btn.innerHTML = 'AUTHORIZE PROTOCOL <i class="fas fa-check-double"></i>';
                // Remove existing event listener before adding submit
                btn.onclick = submitForm;
            }
        }
    }
}

function previousStep(){
    if(currentStep > 1){
        currentStep--; 
        showStep(currentStep); 
        updateProgress(); 
        const btn = document.getElementById('nextBtn');
        if(btn) {
            btn.innerHTML = 'CONTINUE <i class="fas fa-chevron-right"></i>';
            btn.onclick = nextStep;
        }
    }
}

function showStep(step){
    document.querySelectorAll('.step-container').forEach(s => s.classList.remove('active'));
    document.getElementById(`step${step}`)?.classList.add('active');
    
    const prevBtn = document.getElementById('prevBtn');
    if(prevBtn) prevBtn.style.display = (step === 1) ? 'none' : 'flex';
    
    document.querySelectorAll('.step-item').forEach((item, index) => {
        item.classList.toggle('active', index + 1 === step);
    });
}

function updateProgress(){
    const progress = (currentStep / totalSteps) * 100;
    const bar = document.getElementById('progressFill');
    if(bar) bar.style.width = progress + '%';
}

// ================== DATA VERIFICATION & SUBMIT ==================

function generateSummary(){
    const formData = new FormData(document.getElementById('bookingForm'));
    const inspType = document.querySelector('input[name="inspectionType"]:checked');
    const loc = document.querySelector('input[name="location"]:checked');
    const summaryBox = document.getElementById('bookingSummary');
    
    if(!summaryBox || !inspType || !loc) return;

    const basePrice = InspectionType[inspType.value];
    const mobileFee = loc.value === 'mobile' ? 250 : 0;
    const total = basePrice + mobileFee;

    summaryBox.innerHTML = `
        <div class="summary-item"><span>PRIMARY UNIT</span><span>${formData.get('brand')} ${formData.get('model')} (${formData.get('year')})</span></div>
        <div class="summary-item"><span>PROTOCOL</span><span>${formatInspectionName(inspType.value)} Diagnostic</span></div>
        <div class="summary-item"><span>DEPLOYMENT</span><span>${loc.value === 'mobile' ? 'Site Coordinate' : 'Technical Hub'}</span></div>
        <div class="summary-item"><span>WINDOW</span><span>${formData.get('inspectionDate')} | ${document.getElementById('selectedTime').value}</span></div>
        <div class="summary-item total"><span>TOTAL ESTIMATE</span><span>${total.toLocaleString()} LKR</span></div>
    `;
}

async function submitForm(e) {
    if(e) e.preventDefault();
    if (!validateStep(4)) return;

    const btn = document.getElementById('nextBtn');
    const originalContent = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> INITIALIZING...';
    btn.disabled = true;

    try {
        const formData = new FormData(document.getElementById('bookingForm'));
        const inspType = document.querySelector('input[name="inspectionType"]:checked').value;
        const loc = document.querySelector('input[name="location"]:checked').value;
        const time = document.getElementById('selectedTime').value;

        const payload = {
            brand: formData.get('brand'),
            model: formData.get('model'),
            year: parseInt(formData.get('year')),
            mileage: formData.get('mileage') ? parseInt(formData.get('mileage')) : 0,
            description: formData.get('specialRequests'),
            appointmentDate: formData.get('inspectionDate'),
            timeSlot: mapTimeSlot(time),
            inspectionType: inspType,
            serviceType: loc === 'mobile' ? 'MOBILE' : 'FACILITY',
            streetAddress: loc === 'mobile' ? formData.get('streetAddress') : null,
            city: loc === 'mobile' ? formData.get('city') : null,
            stateProvince: loc === 'mobile' ? formData.get('stateProvince') : null
        };

        const res = await fetch(API_BOOKINGS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error('Data Sync Failure');
        
        alert("PROTOCOL REGISTERED SUCCESSFULLY.");
        window.location.href = "customer-dashboard.html";

    } catch (err) {
        console.error(err);
        alert("Critical System Error: Check backend connection.");
        btn.disabled = false;
        btn.innerHTML = originalContent;
    }
}

// ================== HELPERS ==================

function formatInspectionName(type) {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function getInspectionIcon(type) {
    const icons = { SAFETY: 'shield-halved', COMPREHENSIVE: 'microscope', PRE_PURCHASE: 'clipboard-check', DIAGNOSTIC: 'gauge-high' };
    return icons[type] || 'circle-nodes';
}

function getInspectionDescription(type) {
    const desc = {
        SAFETY: 'Critical safety system integrity check.',
        COMPREHENSIVE: 'Full-spectrum hardware & software diagnostic.',
        PRE_PURCHASE: 'Third-party asset verification audit.',
        DIAGNOSTIC: 'Internal combustion & electrical analysis.'
    };
    return desc[type] || '';
}

function mapTimeSlot(slot) {
    const map = { '09:00': 'NINE_AM', '10:30': 'TEN_THIRTY_AM', '12:00': 'TWELVE_PM', '15:00': 'THREE_PM', '16:30': 'FOUR_THIRTY_PM' };
    return map[slot] || null;
}