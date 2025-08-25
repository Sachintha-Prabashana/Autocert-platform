    function handleCredentialResponse(response) {
        const idToken = response.credential;

        // Send the token to your backend for verification/login/signup
        fetch('http://localhost:8080/auth/google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken })
        })
        .then(res => res.json())
        .then(data => {
            alert('Google login successful!');
            window.location.href = '/Frontend/pages/dashboard.html'; // Redirect to dashboard
            console.log(data);
            // Redirect or store JWT here
        })
        .catch(err => {
            alert('Google login failed.');
            console.error(err);
        });
    }

    window.onload = function () {
      google.accounts.id.initialize({
        client_id: "1034440170497-1pe4jbqr79bc9535q65fe09dh5j5v6ba.apps.googleusercontent.com",
        callback: handleCredentialResponse
      });

      google.accounts.id.renderButton(
        document.getElementById("googleSignInBtn"),
        { theme: "outline", size: "large", width: '100%' }
      );

      google.accounts.id.prompt(); // Optional: One Tap prompt
    };