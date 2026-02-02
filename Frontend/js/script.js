const signInBtn = document.getElementById('signInBtn');
    const signUpBtn = document.getElementById('signUpBtn');
    const signInModal = document.getElementById('signInModal');
    const signUpModal = document.getElementById('signUpModal');
    const modalClose = document.getElementById('modalClose');
    const signUpModalClose = document.getElementById('signUpModalClose');
    const switchToSignUp = document.getElementById('switchToSignUp');
    const switchToSignIn = document.getElementById('switchToSignIn');

    function openModal(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    signInBtn?.addEventListener('click', e => { e.preventDefault(); openModal(signInModal); });
    signUpBtn?.addEventListener('click', e => { e.preventDefault(); openModal(signUpModal); });

    modalClose?.addEventListener('click', () => closeModal(signInModal));
    signUpModalClose?.addEventListener('click', () => closeModal(signUpModal));

    signInModal?.addEventListener('click', e => { if(e.target === signInModal) closeModal(signInModal); });
    signUpModal?.addEventListener('click', e => { if(e.target === signUpModal) closeModal(signUpModal); });

    document.addEventListener('keydown', e => { if(e.key === 'Escape') { closeModal(signInModal); closeModal(signUpModal); } });

    switchToSignUp?.addEventListener('click', e => { e.preventDefault(); closeModal(signInModal); setTimeout(() => openModal(signUpModal), 300); });
    switchToSignIn?.addEventListener('click', e => { e.preventDefault(); closeModal(signUpModal); setTimeout(() => openModal(signInModal), 300); });

    // ==================== REGISTER FORM ====================
    const registerForm = document.getElementById("signUpForm");
    registerForm?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const user = {
            firstName: document.getElementById("firstName").value,
            lastName: document.getElementById("lastName").value,
            email: document.getElementById("signUpEmail").value,
            password: document.getElementById("signUpPassword").value,
            phone: document.getElementById("phoneNumber").value
        };
        try {
            // Show loading alert
            Swal.fire({
                title: 'Registering...',
                text: 'Please wait while we create your account',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            
            const res = await fetch("http://localhost:8080/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user)
            });
            const data = await res.json();
            
            if(res.ok){
                // Close loading alert and show success
                Swal.fire({
                    icon: 'success',
                    title: 'Registration Successful!',
                    text: 'Please login to continue',
                    confirmButtonText: 'OK'
                }).then(() => {
                    registerForm.reset();
                    closeModal(signUpModal);
                    setTimeout(() => openModal(signInModal), 300);
                });
            } else {
                // Show error alert
                Swal.fire({
                    icon: 'error',
                    title: 'Registration Failed',
                    text: data.message || 'Please try again',
                    confirmButtonText: 'OK'
                });
            }
        } catch(err){
            console.error(err);
            // Show error alert
            Swal.fire({
                icon: 'error',
                title: 'Something went wrong!',
                text: 'Please check your connection and try again',
                confirmButtonText: 'OK'
            });
        }
    });

    // ==================== LOGIN FORM ====================
    const loginForm = document.getElementById("signInForm");
    loginForm?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        
        try {
            // Show loading alert
            Swal.fire({
                title: 'Logging in...',
                text: 'Please wait while we authenticate you',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            
            const res = await fetch("http://localhost:8080/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            
            if(!res.ok) { 
                // Show error alert
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: data.message || 'Please check your credentials and try again',
                    confirmButtonText: 'OK'
                });
                return; 
            }

            //  Store token and role in localStorage
            localStorage.setItem("token", data.accessToken);
            localStorage.setItem("role", data.role);

            // Show success alert
            Swal.fire({
                icon: 'success',
                title: 'Login Successful!',
                text: `Welcome back! Redirecting to your dashboard...`,
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                //  Redirect based on role
                if(data.role === "ADMIN") window.location.href = "pages/admin-dashboard.html";
                else if(data.role === "INSPECTOR") window.location.href = "pages/test/test.html";
                else if(data.role === "CUSTOMER") window.location.href = "pages/customer-dashboard.html";
                else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Unknown Role',
                        text: 'Please contact support',
                        confirmButtonText: 'OK'
                    });
                }
            });
        } catch(err) { 
            console.error(err);
            // Show error alert
            Swal.fire({
                icon: 'error',
                title: 'Something went wrong!',
                text: 'Please check your connection and try again',
                confirmButtonText: 'OK'
            });
        }
    });

    // ==================== NAVBAR SCROLL ====================
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        if(navbar) window.scrollY > 50 ? navbar.classList.add('scrolled') : navbar.classList.remove('scrolled');
    });

    // ==================== FADE-IN ON SCROLL ====================
    const fadeObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add('visible'); });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

    // ==================== STATS COUNTER ====================
    function animateCounter(id, target, suffix = '') {
        const el = document.getElementById(id);
        if(!el) return;
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if(current >= target) { current = target; clearInterval(timer); }
            el.textContent = Math.floor(current).toLocaleString() + suffix;
        }, 50);
    }
    const statsSection = document.querySelector('.stats');
    if(statsSection){
        const statsObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if(entry.isIntersecting){
                    animateCounter('inspections', 25000, '+');
                    animateCounter('vehicles', 15000, '+');
                    animateCounter('customers', 50000, '+');
                    animateCounter('rating', 4.9, '★');
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        statsObserver.observe(statsSection);
    }

    // ==================== SMOOTH SCROLL ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if(target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // ==================== BUTTON HOVER EFFECTS ====================
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => btn.style.transform = 'translateY(-3px) scale(1.05)');
        btn.addEventListener('mouseleave', () => btn.style.transform = 'translateY(0) scale(1)');
    });

    // ==================== HERO PARTICLES ====================
    function createParticle() {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = particle.style.height = Math.random()*4+2 + 'px';
        particle.style.background = 'rgba(255,255,255,0.5)';
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random()*window.innerWidth + 'px';
        particle.style.top = window.innerHeight + 'px';
        particle.style.pointerEvents = 'none';
        particle.style.animation = 'particleFloat 8s linear forwards';
        document.querySelector('.hero')?.appendChild(particle);
        setTimeout(() => particle.remove(), 8000);
    }
    setInterval(createParticle, 500);

    const style = document.createElement('style');
    style.textContent = `
    @keyframes particleFloat {
        to { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
    }`;
    document.head.appendChild(style);

    // ==================== FORM INPUT ANIMATION ====================
    document.querySelectorAll('.form-input').forEach(input => {
        input.addEventListener('focus', () => input.style.transform = 'scale(1.02)');
        input.addEventListener('blur', () => input.style.transform = 'scale(1)');
    });

    // ==================== PASSWORD STRENGTH & MATCH ====================
    const regPassword = document.getElementById('signUpPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    const passwordStrength = document.getElementById('passwordStrength');
    const passwordMatch = document.getElementById('passwordMatch');

    function checkPasswordStrength(password){
        let strength = 0;
        let feedback = [];
        if(password.length >= 8) strength++; else feedback.push('at least 8 characters');
        if(/[a-z]/.test(password)) strength++; else feedback.push('lowercase letters');
        if(/[A-Z]/.test(password)) strength++; else feedback.push('uppercase letters');
        if(/[0-9]/.test(password)) strength++; else feedback.push('numbers');
        if(/[^A-Za-z0-9]/.test(password)) strength++; else feedback.push('special characters');
        return {strength, feedback};
    }

    regPassword?.addEventListener('input', () => {
        const result = checkPasswordStrength(regPassword.value);
        if(!regPassword.value) { passwordStrength.textContent=''; passwordStrength.className='password-strength'; return; }
        if(result.strength <= 2){
            passwordStrength.textContent = `Weak: Add ${result.feedback.join(', ')}`;
            passwordStrength.className = 'password-strength weak';
        } else if(result.strength <= 4){
            passwordStrength.textContent = 'Medium strength password';
            passwordStrength.className = 'password-strength medium';
        } else {
            passwordStrength.textContent = 'Strong password!';
            passwordStrength.className = 'password-strength strong';
        }
        checkPasswordMatch();
    });

    function checkPasswordMatch(){
        if(!confirmPassword) return;
        if(!confirmPassword.value){ passwordMatch.textContent=''; passwordMatch.className='password-match'; return; }
        if(regPassword.value === confirmPassword.value){
            passwordMatch.textContent = 'Passwords match!';
            passwordMatch.className = 'password-match match';
        } else {
            passwordMatch.textContent = 'Passwords do not match';
            passwordMatch.className = 'password-match no-match';
        }
    }

    confirmPassword?.addEventListener('input', checkPasswordMatch);