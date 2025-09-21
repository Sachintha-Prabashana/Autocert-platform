
        // Location data structure
        const locationData = {
            'western': {
                'colombo': ['Colombo', 'Dehiwala-Mount Lavinia', 'Moratuwa', 'Sri Jayawardenepura Kotte', 'Maharagama', 'Kesbewa', 'Padukka'],
                'gampaha': ['Gampaha', 'Negombo', 'Katunayake', 'Minuwangoda', 'Wattala', 'Kelaniya', 'Ja-Ela', 'Kadawatha'],
                'kalutara': ['Kalutara', 'Panadura', 'Horana', 'Beruwala', 'Aluthgama', 'Matugama', 'Bandaragama']
            },
            'central': {
                'kandy': ['Kandy', 'Gampola', 'Nawalapitiya', 'Wattegama', 'Harispattuwa'],
                'matale': ['Matale', 'Dambulla', 'Sigiriya', 'Galewela'],
                'nuwara-eliya': ['Nuwara Eliya', 'Hatton', 'Nallathanniya', 'Ginigathena']
            },
            'southern': {
                'galle': ['Galle', 'Hikkaduwa', 'Bentota', 'Ambalangoda', 'Elpitiya'],
                'matara': ['Matara', 'Weligama', 'Mirissa', 'Akuressa'],
                'hambantota': ['Hambantota', 'Tangalle', 'Tissamaharama']
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
            const currentStepElement = document.querySelector(`.step-content[data-step="${currentStep}"]`);
            const requiredInputs = currentStepElement.querySelectorAll('input[required], select[required]');
            
            let isValid = true;
            requiredInputs.forEach(input => {
                if (!input.value.trim()) {
                    input.focus();
                    alert(`Please fill in the ${input.previousElementSibling.textContent.replace(' *', '')} field.`);
                    isValid = false;
                    return false;
                }
            });
            
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

        // Form submission
        document.getElementById('vehicleForm').addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (validateCurrentStep()) {
                // Hide current step
                document.querySelector(`.step-content[data-step="${currentStep}"]`).classList.remove('active');
                document.querySelector(`.step[data-step="${currentStep}"]`).classList.add('completed');
                
                // Show success message
                document.querySelector('.step-content[data-step="success"]').classList.add('active');
                
                // Scroll to top
                window.scrollTo(0, 0);
                
                // Here you would normally send data to server
                console.log('Form submitted successfully');
            }
        });

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