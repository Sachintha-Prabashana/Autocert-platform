package lk.ijse.autocert.service.impl;

import lk.ijse.autocert.dto.UpdateProfileDTO;
import lk.ijse.autocert.dto.UserDTO;
import lk.ijse.autocert.entity.User;
import lk.ijse.autocert.repository.UserRepository;
import lk.ijse.autocert.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl {

    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    private final ModelMapper modelMapper;  // Injected ModelMapper

    public UserDTO getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Use ModelMapper here:
        return modelMapper.map(user, UserDTO.class);
    }

    public UserDTO updateProfile(String email, UpdateProfileDTO dto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setPhone(dto.getPhone());

        if (dto.getImage() != null && !dto.getImage().isEmpty()) {
            String imageUrl = fileStorageService.storeFile(dto.getImage());
            user.setProfileImageUrl(imageUrl);
        }

        User updatedUser = userRepository.save(user);
        // Map updated user to DTO using ModelMapper
        return modelMapper.map(updatedUser, UserDTO.class);
    }
}
