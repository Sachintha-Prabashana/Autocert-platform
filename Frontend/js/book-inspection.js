// ================== CONSTANTS ==================
let currentStep = 1;
const totalSteps = 4;
const token = localStorage.getItem("token"); // JWT stored in localStorage

// API endpoints
const API_BASE = "http://localhost:8080/api";
const API_BOOKINGS = `${API_BASE}/bookings`;
const API_CENTERS = `${API_BASE}/admin/centers`;

// Inspection types and mapping to backend enums
const InspectionType = {
    SAFETY: 5000,
    COMPREHENSIVE: 10000,
    PRE_PURCHASE: 7500,
    DIAGNOSTIC: 6000
};

// Time slots
const TimeSlot = ["09:00", "10:30", "12:00", "15:00", "16:30"];

// ================== INITIALIZATION ==================
document.addEventListener('DOMContentLoaded', function() {
    if (!token) {
        alert("Please login first.");
        window.location.href = "/login.html";
        return;
    }

    populateBrands();
    populateYears();
    setMinDate();
    updateProgress();
    setupEventListeners();
    loadCenters();
    renderInspectionTypes();
    renderTimeSlots();
    showStep(currentStep); // Show first step
});

// ------------------ Populate Years ------------------
function populateYears() {
    const yearSelect = document.getElementById('year');
    const currentYear = new Date().getFullYear();
    for (let y = currentYear; y >= 1990; y--) {
        const option = document.createElement('option');
        option.value = y;
        option.textContent = y;
        yearSelect.appendChild(option);
    }
}

// ------------------ Populate Vehicle Makes ------------------
function populateBrands() {
    const brands = ["Toyota","BMW","Honda","Mercedes","Ford","Nissan","Audi","Hyundai","Kia","Mazda"];
    const brandSelect = document.getElementById('brand');
    brands.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand;
        option.textContent = brand;
        brandSelect.appendChild(option);
    });
}

// ------------------ Min Date ------------------
function setMinDate() {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    document.getElementById('inspectionDate').min = today.toISOString().split('T')[0];
}

// ------------------ Event Listeners ------------------
function setupEventListeners() {
    // Navigation buttons
    document.getElementById('nextBtn').addEventListener('click', nextStep);
    document.getElementById('prevBtn').addEventListener('click', previousStep);

    // Inspection type selection
    document.addEventListener('change', e => {
        if (e.target.name === 'inspectionType') {
            document.querySelectorAll('.service-option').forEach(c => c.classList.remove('selected'));
            e.target.closest('.service-option').classList.add('selected');
        }
    });

    // Location selection
    document.addEventListener('change', e => {
        if (e.target.name === 'location') {
            document.querySelectorAll('.location-option').forEach(c => c.classList.remove('selected'));
            e.target.closest('.location-option').classList.add('selected');

            const mobileAddress = document.getElementById('mobileAddress');
            const serviceCenters = document.getElementById('serviceCenters');
            if (e.target.value === 'mobile') {
                mobileAddress.classList.add('show');
                serviceCenters.style.display = 'none';
                setMobileFieldsRequired(true);
                setCenterFieldsRequired(false);
            } else {
                mobileAddress.classList.remove('show');
                serviceCenters.style.display = 'block';
                setMobileFieldsRequired(false);
                setCenterFieldsRequired(true);
            }
        }
    });

    // Time slot selection
    document.addEventListener('click', e => {
        if (e.target.classList.contains('time-slot') && !e.target.classList.contains('unavailable')) {
            document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
            e.target.classList.add('selected');
            document.getElementById('selectedTime').value = e.target.dataset.time;
        }
    });

    // Date change
    document.getElementById('inspectionDate').addEventListener('change', updateTimeSlots);
}

function setMobileFieldsRequired(required) {
    ['streetAddress','city','stateProvince','postalCode'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.required = required;
    });
}

function setCenterFieldsRequired(required) {
    document.querySelectorAll('input[name="selectedCenter"]').forEach(r => r.required = required);
}

// ------------------ Load Centers ------------------
async function loadCenters() {
    try {
        const res = await fetch(API_CENTERS, {
            method: 'GET',
            headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
        });
        if (!res.ok) throw new Error("Failed to load centers.");
        const centers = await res.json();
        renderCenters(centers);
    } catch(err) {
        console.error(err);
        alert("Error loading service centers.");
    }
}

function renderCenters(centers) {
    const container = document.getElementById('locationOptions');
    container.innerHTML = '';

    // Mobile option
    const mobileOption = document.createElement('div');
    mobileOption.className = 'location-option';
    mobileOption.innerHTML = `
        <input type="radio" name="location" value="mobile" id="location-mobile">
        <label for="location-mobile">
            <div class="location-header">
                <div class="location-icon">
                    <i class="fas fa-truck"></i>
                </div>
                <div class="location-details">
                    <h3>Mobile Service</h3>
                    <p>Our certified inspector comes to your location</p>
                </div>
                <div class="location-badge">+25 LKR</div>
            </div>
        </label>
    `;
    container.appendChild(mobileOption);

    // Centers
    centers.forEach(center => {
        const centerOption = document.createElement('div');
        centerOption.className = 'location-option';
        centerOption.innerHTML = `
            <input type="radio" name="location" value="center-${center.id}" id="location-${center.id}">
            <label for="location-${center.id}">
                <div class="location-header">
                    <div class="location-icon">
                        <i class="fas fa-warehouse"></i>
                    </div>
                    <div class="location-details">
                        <h3>${center.name}</h3>
                        <p>${center.address}, ${center.city}</p>
                    </div>
                    <div class="location-badge">Standard Rate</div>
                </div>
            </label>
        `;
        container.appendChild(centerOption);
    });
}

// ------------------ Inspection Types ------------------
function renderInspectionTypes() {
    const container = document.getElementById('inspectionGrid');
    container.innerHTML = '';
    Object.entries(InspectionType).forEach(([name, price]) => {
        const card = document.createElement('div');
        card.className = 'service-option';
        card.innerHTML = `
            <input type="radio" name="inspectionType" value="${name}" id="insp-${name}">
            <label for="insp-${name}">
                <div class="service-header">
                    <div class="service-icon">
                        <i class="fas fa-${getInspectionIcon(name)}"></i>
                    </div>
                    <div class="service-details">
                        <h3>${formatInspectionName(name)} Inspection</h3>
                        <p>${getInspectionDescription(name)}</p>
                        <div class="service-price">${price.toLocaleString()} LKR</div>
                    </div>
                </div>
            </label>
        `;
        container.appendChild(card);
    });
}

function formatInspectionName(type) {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function getInspectionIcon(type) {
    const icons = { 
        SAFETY:'shield-alt', 
        COMPREHENSIVE:'search', 
        PRE_PURCHASE:'shopping-cart', 
        DIAGNOSTIC:'laptop-medical' 
    };
    return icons[type] || 'clipboard-check';
}

function getInspectionDescription(type) {
    const desc = {
        SAFETY:'Essential safety systems and components check',
        COMPREHENSIVE:'Complete vehicle health assessment with detailed diagnostics',
        PRE_PURCHASE:'Thorough pre-purchase inspection for informed buying decisions',
        DIAGNOSTIC:'Advanced electronic systems diagnostics and troubleshooting'
    };
    return desc[type] || '';
}

// ------------------ Time Slots ------------------
function renderTimeSlots() {
    const container = document.getElementById('timeSlots');
    container.innerHTML = '';
    TimeSlot.forEach(slot => {
        const div = document.createElement('div');
        div.className='time-slot';
        div.dataset.time = slot;
        div.textContent = slot;
        container.appendChild(div);
    });
}

function updateTimeSlots() {
    document.querySelectorAll('.time-slot').forEach(s => {
        s.classList.remove('unavailable','selected');
        if (Math.random() < 0.2) s.classList.add('unavailable'); // demo
    });
    document.getElementById('selectedTime').value='';
}

// ------------------ Multi-Step Navigation ------------------
function validateStep(step){
    let valid = true;
    if(step===1){
        ['brand','model','year'].forEach(id=>{
            const el=document.getElementById(id);
            const errorEl = document.getElementById(`${id}-error`);
            if(!el.value.trim()){
                if(errorEl) errorEl.style.display='block'; 
                valid=false;
            } else {
                if(errorEl) errorEl.style.display='none';
            }
        });
    } else if(step===2){
        if(!document.querySelector('input[name="inspectionType"]:checked')){
            alert('Please select an inspection package'); 
            valid=false;
        }
    } else if(step===3){
        const loc = document.querySelector('input[name="location"]:checked');
        if(!loc){alert('Please select a service location'); valid=false;}
        if(!document.getElementById('inspectionDate').value){alert('Please select your preferred date'); valid=false;}
        if(!document.getElementById('selectedTime').value){alert('Please select a time slot'); valid=false;}
        if(loc && loc.value==='mobile'){
            ['streetAddress','city','stateProvince','postalCode'].forEach(id=>{
                const el = document.getElementById(id);
                if(!el.value.trim()){alert('Please complete your service address'); valid=false;}
            });
        }
    } else if(step===4){
        if(!document.getElementById('termsAccepted').checked){
            alert('Please accept the terms and conditions'); 
            valid=false;
        }
    }
    return valid;
}

function nextStep(){
    if(validateStep(currentStep)){
        if(currentStep<totalSteps){
            currentStep++; 
            showStep(currentStep); 
            updateProgress();
        }
        if(currentStep===4){
            generateSummary(); 
            const btn=document.getElementById('nextBtn'); 
            btn.innerHTML='<i class="fas fa-calendar-check"></i> Confirm Booking'; 
            btn.onclick=submitForm;
        }
    }
}

function previousStep(){
    if(currentStep>1){
        currentStep--; 
        showStep(currentStep); 
        updateProgress(); 
        const btn=document.getElementById('nextBtn'); 
        btn.innerHTML='Continue <i class="fas fa-arrow-right"></i>'; 
        btn.onclick=nextStep;
    }
}

function showStep(step){
    document.querySelectorAll('.step-container').forEach(s=>s.classList.remove('active'));
    document.getElementById(`step${step}`).classList.add('active');
    document.getElementById('prevBtn').style.display = step===1 ? 'none':'flex';
    
    document.querySelectorAll('.nav-step').forEach((navStep, index) => {
        navStep.classList.toggle('active', index+1===step);
    });
}

function updateProgress(){
    const progress=(currentStep/totalSteps)*100;
    document.getElementById('progressFill').style.width=progress+'%';
}

// ------------------ Summary ------------------
function generateSummary(){
    const formData = new FormData(document.getElementById('bookingForm'));
    const inspectionType = document.querySelector('input[name="inspectionType"]:checked');
    const loc = document.querySelector('input[name="location"]:checked');
    
    let html = '';
    html += `<div class="summary-item"><span>Vehicle:</span><span>${formData.get('brand')} ${formData.get('model')} (${formData.get('year')})</span></div>`;
    html += `<div class="summary-item"><span>Service Package:</span><span>${formatInspectionName(inspectionType.value)} Inspection</span></div>`;
    html += `<div class="summary-item"><span>Service Type:</span><span>${loc.value==='mobile'?'Mobile Service':'Service Center'}</span></div>`;
    
    if(loc.value==='mobile'){
        html += `<div class="summary-item"><span>Service Address:</span><span>${formData.get('streetAddress')}, ${formData.get('city')}, ${formData.get('stateProvince')} ${formData.get('postalCode')}</span></div>`;
    }
    
    html += `<div class="summary-item"><span>Date & Time:</span><span>${formatDate(formData.get('inspectionDate'))} at ${document.getElementById('selectedTime').value}</span></div>`;
    
    const basePrice = InspectionType[inspectionType.value];
    const mobileCharge = loc.value === 'mobile' ? 25 : 0;
    const totalPrice = basePrice + mobileCharge;
    
    if(mobileCharge > 0) {
        html += `<div class="summary-item"><span>Base Price:</span><span>${basePrice.toLocaleString()} LKR</span></div>`;
        html += `<div class="summary-item"><span>Mobile Service:</span><span>+${mobileCharge} LKR</span></div>`;
    }
    
    html += `<div class="summary-item"><span>Total Amount:</span><span>${totalPrice.toLocaleString()} LKR</span></div>`;
    
    document.getElementById('bookingSummary').innerHTML = html;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

// ------------------ Submit Form ------------------
async function submitForm() {
    if (!validateStep(4)) return;

    const btn = document.getElementById('nextBtn');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing Booking...';
    btn.disabled = true;

    try {
        const formData = new FormData(document.getElementById('bookingForm'));
        const inspectionTypeInput = document.querySelector('input[name="inspectionType"]:checked').value;
        const locationInput = document.querySelector('input[name="location"]:checked').value;

        const bookingRequest = {
            brand: formData.get('brand'),
            model: formData.get('model'),
            year: parseInt(formData.get('year')),
            description: formData.get('specialRequests') || null,
            mileage: formData.get('mileage') ? parseInt(formData.get('mileage')) : null,
            centerName: locationInput.startsWith('center-') 
                ? document.querySelector(`#location-${locationInput.split('-')[1]}`).nextElementSibling.querySelector('h3').textContent 
                : null,
            appointmentDate: formData.get('inspectionDate'), 
            timeSlot: mapTimeSlot(document.getElementById('selectedTime').value),
            inspectionType: mapInspectionType(inspectionTypeInput),
            serviceType: locationInput === 'mobile' ? 'MOBILE' : 'FACILITY',
            streetAddress: locationInput === 'mobile' ? formData.get('streetAddress') : null,
            streetAddressLine2: locationInput === 'mobile' ? formData.get('streetAddressLine2') : null,
            city: locationInput === 'mobile' ? formData.get('city') : null,
            stateProvince: locationInput === 'mobile' ? formData.get('stateProvince') : null,
            postalCode: locationInput === 'mobile' ? formData.get('postalCode') : null
        };

        console.log("Booking Request:", bookingRequest);

        const response = await fetch(API_BOOKINGS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(bookingRequest)
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.message || 'Failed to create booking');
        }

        const result = await response.json();
        alert("Booking confirmed successfully!");
        // window.location.href = `/booking-confirmation.html?id=${result.data.id}`;
        window.location.href = `/customer-dashboard.html`; // Redirect to dashboard for demo

    } catch (err) {
        console.error("Booking error:", err);
        alert(err.message || "Error processing booking. Please try again.");
        btn.innerHTML = '<i class="fas fa-calendar-check"></i> Confirm Booking';
        btn.disabled = false;
    }
}

// ------------------ Map Enums ------------------
function mapInspectionType(type) {
    switch(type) {
        case 'SAFETY': return 'SAFETY';
        case 'COMPREHENSIVE': return 'COMPREHENSIVE';
        case 'PRE_PURCHASE': return 'PRE_PURCHASE';
        case 'DIAGNOSTIC': return 'DIAGNOSTIC';
        default: return 'SAFETY';
    }
}

function mapTimeSlot(slot) {
    switch(slot) {
        case '09:00': return 'NINE_AM';
        case '10:30': return 'TEN_THIRTY_AM';
        case '12:00': return 'TWELVE_PM';
        case '15:00': return 'THREE_PM';
        case '16:30': return 'FOUR_THIRTY_PM';
        default: return null;
    }
}
