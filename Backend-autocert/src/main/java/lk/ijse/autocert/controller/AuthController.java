package lk.ijse.autocert.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lk.ijse.autocert.dto.*;
import lk.ijse.autocert.entity.Role;
import lk.ijse.autocert.service.AuthService;
import lk.ijse.autocert.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> registerUser(@RequestBody RegisterDTO registerDTO) {
        return ResponseEntity.ok(
                new ApiResponse(200, "User registered successfully", authService.register(registerDTO))
        );
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> loginUser(@RequestBody AuthDTO authDTO) {
        // ✅ Get AuthResponseDTO (token + role)
        AuthResponseDTO authResponse = authService.authenticate(authDTO);

        // ❌ Do not set cookie anymore
        return ResponseEntity.ok(authResponse);
    }


    @PostMapping("/logout")
    public ResponseEntity<ApiResponse> logout() {
        // ✅ Just return success, frontend will delete JS cookie
        return ResponseEntity.ok(new ApiResponse(
                200,
                "User logged out successfully",
                null,
                null
        ));
    }

    @PostMapping("/google")
    public ResponseEntity<ApiResponse> loginWithGoogle(@RequestBody GoogleLoginDTO googleLoginDTO) {
        try {
            authService.loginWithGoogle(googleLoginDTO);

            // ✅ No cookie is set, frontend will create JS cookie
            return ResponseEntity.ok(new ApiResponse(200, "Google login successful", null));
        } catch (GeneralSecurityException | IOException e) {
            return ResponseEntity.status(401).body(new ApiResponse(401, "Invalid Google token", e.getMessage()));
        }
    }

    // Dashboard endpoints remain the same
    @GetMapping("/admin/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> adminDashboard() {
        return ResponseEntity.ok(new ApiResponse(200, "Welcome to Admin Dashboard", null));
    }

    @GetMapping("/customer/dashboard")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse> customerDashboard() {
        return ResponseEntity.ok(new ApiResponse(200, "Welcome to Customer Dashboard", null));
    }

    @GetMapping("/inspector/dashboard")
    @PreAuthorize("hasRole('INSPECTOR')")
    public ResponseEntity<ApiResponse> inspectorDashboard() {
        return ResponseEntity.ok(new ApiResponse(200, "Welcome to Inspector Dashboard", null));
    }
}