
        // Location data structure
        const locationData = {
            'western': {
                'colombo': ['Colombo', 'Dehiwala-Mount Lavinia', 'Moratuwa', 'Sri Jayawardenepura Kotte', 'Maharagama', 'Kesbewa', 'Padukka', 'Homagama', 'Piliyandala'],
                'gampaha': ['Gampaha', 'Negombo', 'Katunayake', 'Minuwangoda', 'Wattala', 'Kelaniya', 'Ja-Ela', 'Kadawatha', 'Divulapitiya'],
                'kalutara': ['Kalutara', 'Panadura', 'Horana', 'Beruwala', 'Aluthgama', 'Matugama', 'Bandaragama', 'Wadduwa']
            },
            'central': {
                'kandy': ['Kandy', 'Gampola', 'Nawalapitiya', 'Wattegama', 'Harispattuwa', 'Peradeniya', 'Katugastota'],
                'matale': ['Matale', 'Dambulla', 'Sigiriya', 'Galewela', 'Ukuwela'],
                'nuwara-eliya': ['Nuwara Eliya', 'Hatton', 'Nallathanniya', 'Ginigathena', 'Talawakele']
            },
            'southern': {
                'galle': ['Galle', 'Hikkaduwa', 'Bentota', 'Ambalangoda', 'Elpitiya', 'Karapitiya'],
                'matara': ['Matara', 'Weligama', 'Mirissa', 'Akuressa', 'Dikwella', 'Kamburupitiya'],
                'hambantota': ['Hambantota', 'Tangalle', 'Tissamaharama', 'Ambalantota', 'Beliatta']
            },
            'northern': {
                'jaffna': ['Jaffna', 'Chavakachcheri', 'Point Pedro', 'Nallur'],
                'kilinochchi': ['Kilinochchi', 'Paranthan'],
                'mannar': ['Mannar', 'Talaimannar'],
                'vavuniya': ['Vavuniya', 'Cheddikulam'],
                'mullaitivu': ['Mullaitivu', 'Puthukkudiyiruppu']
            },
            'eastern': {
                'trincomalee': ['Trincomalee', 'Mutur', 'Kinniya', 'Kantale'],
                'batticaloa': ['Batticaloa', 'Kattankudy', 'Eravur'],
                'ampara': ['Ampara', 'Kalmunai', 'Sainthamaruthu', 'Akkaraipattu']
            },
            'north-western': {
                'kurunegala': ['Kurunegala', 'Kuliyapitiya', 'Pannala', 'Narammala', 'Wariyapola'],
                'puttalam': ['Puttalam', 'Chilaw', 'Wennappuwa', 'Dankotuwa', 'Marawila']
            },
            'north-central': {
                'anuradhapura': ['Anuradhapura', 'Kekirawa', 'Thambuttegama', 'Mihintale', 'Eppawala'],
                'polonnaruwa': ['Polonnaruwa', 'Hingurakgoda', 'Medirigiriya', 'Kaduruwela']
            },
            'uva': {
                'badulla': ['Badulla', 'Bandarawela', 'Haputale', 'Welimada', 'Ella', 'Mahiyanganaya'],
                'monaragala': ['Monaragala', 'Wellawaya', 'Buttala', 'Kataragama', 'Bibile']
            },
            'sabaragamuwa': {
                'ratnapura': ['Ratnapura', 'Balangoda', 'Embilipitiya', 'Pelmadulla', 'Eheliyagoda'],
                'kegalle': ['Kegalle', 'Mawanella', 'Warakapola', 'Rambukkana', 'Ruwanwella']
            }
        };

        let currentStep = 1;
        const totalSteps = 6;

        // Initialize year dropdown
        const yearSelect = document.getElementById('year');
        const currentYear = new Date().getFullYear();
        for (let year = currentYear; year >= 1990; year--) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
        }

        // Location cascade functionality
        const provinceSelect = document.getElementById('province');
        const districtSelect = document.getElementById('district');
        const citySelect = document.getElementById('city');

        provinceSelect.addEventListener('change', function() {
            const selectedProvince = this.value;
            districtSelect.innerHTML = '<option value="">Select District</option>';
            citySelect.innerHTML = '<option value="">Select City</option>';
            
            if (selectedProvince && locationData[selectedProvince]) {
                districtSelect.disabled = false;
                const districts = Object.keys(locationData[selectedProvince]);
                districts.forEach(district => {
                    const option = document.createElement('option');
                    option.value = district;
                    option.textContent = district.charAt(0).toUpperCase() + district.slice(1).replace('-', ' ');
                    districtSelect.appendChild(option);
                });
            } else {
                districtSelect.disabled = true;
                citySelect.disabled = true;
            }
        });

        districtSelect.addEventListener('change', function() {
            const selectedProvince = provinceSelect.value;
            const selectedDistrict = this.value;
            citySelect.innerHTML = '<option value="">Select City</option>';
            
            if (selectedProvince && selectedDistrict && locationData[selectedProvince][selectedDistrict]) {
                citySelect.disabled = false;
                const cities = locationData[selectedProvince][selectedDistrict];
                cities.forEach(city => {
                    const option = document.createElement('option');
                    option.value = city.toLowerCase().replace(/\s+/g, '-');
                    option.textContent = city;
                    citySelect.appendChild(option);
                });
            } else {
                citySelect.disabled = true;
            }
        });

        // Step 1 validation
        document.getElementById('step1Next').addEventListener('click', function() {
            if (provinceSelect.value && districtSelect.value && citySelect.value) {
                nextStep();
            } else {
                alert('Please select Province, District, and City to continue.');
            }
        });

        // Step navigation functions
        function nextStep() {
            if (validateCurrentStep()) {
                if (currentStep < totalSteps) {
                    // Hide current step
                    document.querySelector(`.step-content[data-step="${currentStep}"]`).classList.remove('active');
                    document.querySelector(`.step[data-step="${currentStep}"]`).classList.add('completed');
                    document.querySelector(`.step[data-step="${currentStep}"]`).classList.remove('active');
                    
                    // Show next step
                    currentStep++;
                    document.querySelector(`.step-content[data-step="${currentStep}"]`).classList.add('active');
                    document.querySelector(`.step[data-step="${currentStep}"]`).classList.add('active');
                    
                    // Scroll to top
                    window.scrollTo(0, 0);
                }
            }
        }

        function previousStep() {
            if (currentStep > 1) {
                // Hide current step
                document.querySelector(`.step-content[data-step="${currentStep}"]`).classList.remove('active');
                document.querySelector(`.step[data-step="${currentStep}"]`).classList.remove('active');
                
                // Show previous step
                currentStep--;
                document.querySelector(`.step-content[data-step="${currentStep}"]`).classList.add('active');
                document.querySelector(`.step[data-step="${currentStep}"]`).classList.add('active');
                document.querySelector(`.step[data-step="${currentStep}"]`).classList.remove('completed');
                
                // Scroll to top
                window.scrollTo(0, 0);
            }
        }

        function validateCurrentStep() {
            // Step 1: Location Validation
            if (currentStep === 1) {
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
            }

            // Step 2: Basic Info Validation
            if (currentStep === 2) {
                const make = document.getElementById("make").value;
                const model = document.getElementById("model").value;
                const year = document.getElementById("year").value;
                
                if (!make || !model || !year) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Required Fields Missing',
                        text: 'Please fill in Make, Model, and Year.',
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
            }

            // Step 6: Price Validation
            if (currentStep === 6) {
                const price = document.getElementById("price").value;
                 if (!price || parseFloat(price) <= 0) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Invalid Price',
                        text: 'Please enter a valid price greater than 0.',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#ef4444'
                    });
                    return false;
                }
            }
            
            // Generic check for other required fields in the current step
            const currentStepElement = document.querySelector(`.step-content[data-step="${currentStep}"]`);
            const requiredInputs = currentStepElement.querySelectorAll('input[required], select[required]');
            
            let isValid = true;
            for (let input of requiredInputs) {
                if (!input.value.trim()) {
                     Swal.fire({
                        icon: 'warning',
                        title: 'Required Field',
                        text: `Please fill in the ${input.previousElementSibling.textContent.replace(' *', '')} field.`,
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#f59e0b'
                    });
                    input.focus();
                    isValid = false;
                    break; 
                }
            }
            
            return isValid;
        }

        // Feature selection functionality
        function toggleFeature(element) {
            const checkbox = element.querySelector('input[type="checkbox"]');
            checkbox.checked = !checkbox.checked;
            element.classList.toggle('selected', checkbox.checked);
        }

        // Photo upload functionality
        function triggerFileInput(slotIndex) {
            const photoSlot = document.querySelectorAll('.photo-slot')[slotIndex];
            const fileInput = photoSlot.querySelector('.photo-input');
            fileInput.click();
        }

        function handlePhotoUpload(slotIndex, input) {
            const file = input.files[0];
            if (file && file.type.startsWith('image/')) {
                const photoSlot = document.querySelectorAll('.photo-slot')[slotIndex];
                const placeholder = photoSlot.querySelector('.upload-placeholder');
                const previewImage = photoSlot.querySelector('.preview-image');
                const removeButton = photoSlot.querySelector('.remove-photo');

                const reader = new FileReader();
                reader.onload = function(e) {
                    previewImage.src = e.target.result;
                    previewImage.style.display = 'block';
                    placeholder.style.display = 'none';
                    removeButton.style.display = 'flex';
                    photoSlot.classList.add('has-image');
                };
                reader.readAsDataURL(file);
            }
        }

        function removePhoto(slotIndex) {
            const photoSlot = document.querySelectorAll('.photo-slot')[slotIndex];
            const placeholder = photoSlot.querySelector('.upload-placeholder');
            const previewImage = photoSlot.querySelector('.preview-image');
            const removeButton = photoSlot.querySelector('.remove-photo');
            const fileInput = photoSlot.querySelector('.photo-input');

            previewImage.style.display = 'none';
            placeholder.style.display = 'flex';
            removeButton.style.display = 'none';
            photoSlot.classList.remove('has-image');
            fileInput.value = '';
        }

        // Phone number formatting
        document.getElementById('contactPhone').addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 10) {
                value = `${value.slice(0, 3)} ${value.slice(3, 6)} ${value.slice(6, 10)}`;
            }
            e.target.value = value;
        });

        // Form submission is handled by vehicle.js
        // Conflicting submit handler removed

        // Initialize feature items
        document.querySelectorAll('.feature-item').forEach(item => {
            const checkbox = item.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', function() {
                item.classList.toggle('selected', this.checked);
            });
        });

        // Prevent form submission on Enter key (except in textareas)
        document.getElementById('vehicleForm').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
            }
        });

        // Auto-focus first input when step changes
        function focusFirstInput() {
            const currentStepElement = document.querySelector(`.step-content[data-step="${currentStep}"]`);
            const firstInput = currentStepElement.querySelector('input, select, textarea');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
        }