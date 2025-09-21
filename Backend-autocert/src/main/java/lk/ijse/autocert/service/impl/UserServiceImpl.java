package lk.ijse.autocert.service.impl;

import lk.ijse.autocert.dto.*;
import lk.ijse.autocert.entity.Role;
import lk.ijse.autocert.entity.User;
import lk.ijse.autocert.repository.UserRepository;
import lk.ijse.autocert.service.EmailService;
import lk.ijse.autocert.service.UserService;
import lk.ijse.autocert.util.PasswordGenerator;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;  // Injected ModelMapper
    private final ImgbbService imgbbService; // Assuming you have an ImgbbService for image uploads
    private final PasswordEncoder passwordEncoder; // For password encryption
    private final EmailService emailService; // For sending emails

    public UserDTO getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Use ModelMapper here:
        return modelMapper.map(user, UserDTO.class);
    }

    public UserDTO updateProfile(String email, UpdateProfileDTO dto) throws IOException, InterruptedException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setPhone(dto.getPhone());

        // Upload to ImgBB instead of local storage
        if (dto.getImage() != null && !dto.getImage().isEmpty()) {
            String imageUrl = imgbbService.uploadFile(dto.getImage());
            user.setProfileImageUrl(imageUrl);
        }

        User updatedUser = userRepository.save(user);
        return modelMapper.map(updatedUser, UserDTO.class);
    }

    @Override
    public User getUserEntityByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    @Override
    public void changePasswordByEmail(String email, PasswordChangeRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

    }

    @Override
    public Long findUserIdByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
        return user.getId();
    }

    @Override
    public void addAdmin(AdminCreateDTO dto) {
        // Check if email exists
        userRepository.findByEmail(dto.getEmail())
                .ifPresent(u -> { throw new RuntimeException("Email already exists"); });

        // Create user
        User user = new User();
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        user.setRole(Role.ADMIN);

        // Generate random password
        String generatedPassword = PasswordGenerator.generateTempPassword();
        user.setPassword(passwordEncoder.encode(generatedPassword));

        userRepository.save(user);

        // Send password to email
        emailService.sendAdminPassword(user.getEmail(), generatedPassword);
    }

    @Override
    public List<UserResponseDTO> getAllUsers() {
        List<User> users = userRepository.findByRoleIn(List.of(Role.CUSTOMER, Role.ADMIN));

        return users.stream()
                .map(u -> new UserResponseDTO(
                        u.getId(),
                        u.getFirstName() + " " + u.getLastName(),
                        u.getEmail(),
                        u.getPhone(),
                        u.getRole(),
                        "ACTIVE" // or map from a `status` field if available
                ))
                .collect(Collectors.toList());
    }



}
