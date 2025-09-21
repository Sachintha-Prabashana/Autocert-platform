// =====================
// Vehicle Form Submission with Imgbb Uploads and SweetAlert2
// =====================

document.addEventListener("DOMContentLoaded", function () {
    const vehicleForm = document.getElementById("vehicleForm");
    const submitBtn = document.querySelector(".btn-submit");

    vehicleForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!validateCurrentStep()) return;

        const token = localStorage.getItem("token");
        if (!token) {
            Swal.fire({
                icon: 'warning',
                title: 'Authentication Required',
                text: 'You must log in first!',
                confirmButtonText: 'OK',
                confirmButtonColor: '#f59e0b'
            });
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = "⏳ Submitting...";

        // Show loading SweetAlert
        Swal.fire({
            title: 'Submitting Your Listing',
            text: 'Please wait while we upload your photos and create your listing...',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            // -------------------------
            // Upload photos and get URLs
            // -------------------------
            const photoInputs = document.querySelectorAll(".photo-input");
            const photoURLs = [];

            // Update loading message for photo uploads
            if (photoInputs.length > 0) {
                Swal.update({
                    text: 'Uploading your photos...'
                });
            }

            for (let input of photoInputs) {
                if (input.files.length > 0) {
                    for (let file of input.files) {
                        const formData = new FormData();
                        formData.append("image", file);

                        const imgbbRes = await fetch("http://localhost:8080/api/upload", {
                            method: "POST",
                            headers: { "Authorization": "Bearer " + token },
                            body: formData
                        });

                        if (!imgbbRes.ok) {
                            throw new Error("Failed to upload image: " + file.name);
                        }

                        const json = await imgbbRes.json();

                        // If backend returns { url: "..." }
                        if (json.url) {
                            photoURLs.push(json.url);
                        }
                        // If backend returns array: ["https://..."]
                        else if (Array.isArray(json)) {
                            photoURLs.push(...json);
                        } else {
                            throw new Error("Unexpected response from upload endpoint");
                        }
                    }
                }
            }

            // Update loading message for form submission
            Swal.update({
                text: 'Creating your vehicle listing...'
            });

            // -------------------------
            // Collect form data payload
            // -------------------------
            const payload = {
                province: document.getElementById("province").value,
                district: document.getElementById("district").value,
                city: document.getElementById("city").value,
                make: document.getElementById("make").value,
                model: document.getElementById("model").value,
                year: parseInt(document.getElementById("year").value),
                mileage: parseInt(document.getElementById("mileage").value),
                condition: document.getElementById("condition").value,
                bodyType: document.getElementById("bodyType").value,
                engine: document.getElementById("engine").value,
                transmission: document.getElementById("transmission").value,
                fuelType: document.getElementById("fuelType").value,
                color: document.getElementById("color").value,
                features: Array.from(document.querySelectorAll("input[name='features']:checked")).map(f => f.value),
                photos: photoURLs, // only URLs
                price: parseFloat(document.getElementById("price").value),
                negotiable: document.getElementById("negotiable").checked,
                contactName: document.getElementById("contactName").value,
                contactPhone: document.getElementById("contactPhone").value,
                description: document.getElementById("description").value
            };

            // -------------------------
            // Submit JSON to backend
            // -------------------------
            const res = await fetch("http://localhost:8080/api/vehicles/add", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || 'Failed to submit listing');
            }

            // -------------------------
            // Success handling
            // -------------------------
            currentStep = "success";
            showStep("success");
            window.scrollTo(0, 0);
            
            // Close loading and show success
            Swal.fire({
                icon: 'success',
                title: 'Listing Submitted Successfully!',
                text: 'Your vehicle listing has been created and is now pending approval.',
                confirmButtonText: 'Great!',
                confirmButtonColor: '#10b981',
                showClass: {
                    popup: 'animate__animated animate__zoomIn'
                },
                hideClass: {
                    popup: 'animate__animated animate__zoomOut'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    // Optional: redirect to listings page or reset form
                    // window.location.href = '/my-listings';
                }
            });

        } catch (err) {
            console.error('Submission error:', err);
            
            // Close loading and show error
            Swal.fire({
                icon: 'error',
                title: 'Submission Failed',
                text: err.message || 'Something went wrong while submitting your listing. Please try again.',
                confirmButtonText: 'Try Again',
                confirmButtonColor: '#ef4444',
                footer: '<small>If the problem persists, please contact support.</small>'
            });
            
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = "Submit Listing";
        }
    });
});

// -------------------------
// Validate Current Step with SweetAlert
// -------------------------
function validateCurrentStep() {
    const province = document.getElementById("province").value;
    const district = document.getElementById("district").value;
    const city = document.getElementById("city").value;

    if (!province || !district || !city) {
        Swal.fire({
            icon: 'warning',
            title: 'Incomplete Information',
            text: 'Please select province, district, and city before proceeding.',
            confirmButtonText: 'OK',
            confirmButtonColor: '#f59e0b'
        });
        return false;
    }

    // Additional validation can be added here
    const make = document.getElementById("make").value;
    const model = document.getElementById("model").value;
    const year = document.getElementById("year").value;
    const price = document.getElementById("price").value;

    if (!make || !model || !year || !price) {
        Swal.fire({
            icon: 'warning',
            title: 'Required Fields Missing',
            html: 'Please fill in all required fields:<br/><strong>Make, Model, Year, and Price</strong>',
            confirmButtonText: 'OK',
            confirmButtonColor: '#f59e0b'
        });
        return false;
    }

    // Validate year range
    const currentYear = new Date().getFullYear();
    const vehicleYear = parseInt(year);
    if (vehicleYear < 1900 || vehicleYear > currentYear + 1) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid Year',
            text: `Please enter a valid year between 1900 and ${currentYear + 1}.`,
            confirmButtonText: 'OK',
            confirmButtonColor: '#ef4444'
        });
        return false;
    }

    // Validate price
    const vehiclePrice = parseFloat(price);
    if (vehiclePrice <= 0) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid Price',
            text: 'Please enter a valid price greater than 0.',
            confirmButtonText: 'OK',
            confirmButtonColor: '#ef4444'
        });
        return false;
    }

    return true;
}

// -------------------------
// Show Step (for multi-step form)
// -------------------------
function showStep(step) {
    document.querySelectorAll(".step-content").forEach(el => el.classList.remove("active"));
    const stepEl = document.querySelector(`[data-step="${step}"]`);
    if (stepEl) stepEl.classList.add("active");
}

// -------------------------
// Additional SweetAlert utility functions
// -------------------------

// Confirmation dialog for form reset
function confirmFormReset() {
    Swal.fire({
        title: 'Reset Form?',
        text: 'All your entered information will be lost.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, reset it!',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            document.getElementById("vehicleForm").reset();
            Swal.fire({
                icon: 'success',
                title: 'Form Reset',
                text: 'The form has been cleared.',
                timer: 1500,
                showConfirmButton: false
            });
        }
    });
}

// Photo upload progress feedback
function showPhotoUploadFeedback(current, total) {
    const percentage = Math.round((current / total) * 100);
    Swal.update({
        text: `Uploading photos... ${current}/${total} (${percentage}%)`
    });
}