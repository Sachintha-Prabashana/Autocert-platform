package lk.ijse.autocert.service;

import jakarta.transaction.Transactional;
import lk.ijse.autocert.dto.AuthDTO;
import lk.ijse.autocert.dto.GoogleLoginDTO;
import lk.ijse.autocert.dto.RegisterDTO;
import lk.ijse.autocert.entity.User;
import lk.ijse.autocert.exception.UserAlreadyExistsException;
import lk.ijse.autocert.repository.UserRepository;
import lk.ijse.autocert.util.GoogleTokenVerifier;
import lk.ijse.autocert.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;
    private final GoogleTokenVerifier googleTokenVerifier;

    // Method to register a new user
    public String register(RegisterDTO registerDTO) {
        if(userRepository.findByEmail(registerDTO.getEmail()).isPresent()){
            throw new UserAlreadyExistsException("User with this email already exists");

        }
        User newUser = User.builder()
                .firstName(registerDTO.getFirstName())
                .lastName(registerDTO.getLastName())
                .email(registerDTO.getEmail())
                .password(passwordEncoder.encode(registerDTO.getPassword())) // Encrypt the password
                .phone(registerDTO.getPhone())
                .build();
        userRepository.save(newUser);

        emailService.sendSimpleEmail(
                newUser.getEmail(),
                "Registration Successful",
                "Dear " + newUser.getFirstName() + ",\n\nThank you for registering at AutoCert! We're glad to have you.\n\nBest regards,\nAutoCert Team"
        );
        return "User registered successfully";
    }

    // Method to login a user and return a JWT token
    public String authenticate(AuthDTO authDTO) {
        User user = userRepository.findByEmail(authDTO.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found with email: " + authDTO.getEmail()));

        if (!passwordEncoder.matches(authDTO.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Incorrect password");
        }

        String token = jwtUtil.generateToken(user.getEmail());
        return token;

    }

    @Transactional
    public String loginWithGoogle(GoogleLoginDTO googleLoginDTO) throws GeneralSecurityException, IOException {
        com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload payload =
                googleTokenVerifier.verify(googleLoginDTO.getIdToken());

        String email = payload.getEmail();
        String firstName = (String) payload.get("given_name");
        String lastName = (String) payload.get("family_name");

        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = User.builder()
                    .email(email)
                    .firstName(firstName)
                    .lastName(lastName)
                    .password(passwordEncoder.encode(UUID.randomUUID().toString())) // random password
                    .build();
            return userRepository.save(newUser);
        });

        return jwtUtil.generateToken(user.getEmail());
    }



}
