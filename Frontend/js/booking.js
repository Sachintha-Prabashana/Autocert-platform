// ==================== Set min appointment date ====================
document.getElementById('appointmentDate').min = new Date().toISOString().split('T')[0];

// ==================== Inspection Type Selection ====================
document.querySelectorAll('input[name="inspectionType"]').forEach(radio => {
    radio.addEventListener('change', function() {
        document.querySelectorAll('.inspection-type').forEach(type => type.classList.remove('selected'));
        if (this.checked) this.closest('.inspection-type').classList.add('selected');
    });
});

// ==================== Form Validation ====================
function validateForm() {
    let isValid = true;
    const requiredFields = ['brand', 'model', 'year', 'appointmentDate'];
    document.querySelectorAll('.error-message').forEach(e => e.style.display = 'none');

    requiredFields.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        const errorElement = document.getElementById(fieldName + 'Error');
        if (!field.value.trim()) {
            errorElement.style.display = 'block';
            isValid = false;
        }
    });

    const inspectionType = document.querySelector('input[name="inspectionType"]:checked');
    if (!inspectionType) {
        alert('Please select an inspection type.');
        isValid = false;
    }

    const year = parseInt(document.getElementById('year').value);
    const currentYear = new Date().getFullYear();
    if (year && (year < 1900 || year > currentYear)) {
        const yearError = document.getElementById('yearError');
        yearError.textContent = `Please enter a year between 1900 and ${currentYear}`;
        yearError.style.display = 'block';
        isValid = false;
    }

    return isValid;
}

// ==================== Form Submission ====================
document.getElementById('bookingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    if (!validateForm()) return;

    const submitBtn = document.getElementById('submitBtn');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking...';

    const formData = {
        brand: document.getElementById('brand').value,
        model: document.getElementById('model').value,
        year: parseInt(document.getElementById('year').value),
        description: document.getElementById('description').value,
        inspectionType: document.querySelector('input[name="inspectionType"]:checked').value,
        appointmentDate: document.getElementById('appointmentDate').value
    };

    const token = localStorage.getItem('token'); // ✅ Get token from localStorage
    if (!token) {
        alert('You must be logged in to book an inspection.');
        window.location.href = '/Frontend/pages/signin.html';
        return;
    }

    fetch('http://localhost:8080/api/bookings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // ✅ Send token in header
        },
        body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(apiResponse => {
        if (apiResponse.status === 201 || apiResponse.status === 200) {
            alert('✅ Booking created successfully!');
            document.getElementById('bookingForm').reset();
            document.querySelectorAll('.inspection-type').forEach(type => type.classList.remove('selected'));
        } else {
            alert(apiResponse.message || '❌ Failed to create booking.');
        }
    })
    .catch(err => {
        console.error(err);
        alert('❌ Something went wrong. Please try again.');
    })
    .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    });
});

// ==================== Go Back Function ====================
function goBack() {
    if (confirm('Are you sure you want to go back? Any unsaved changes will be lost.')) {
        window.history.back();
    }
}

// ==================== Optional: Redirect if not logged in ====================
window.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login first!');
        window.location.href = '/Frontend/pages/signin.html';
    }
});
