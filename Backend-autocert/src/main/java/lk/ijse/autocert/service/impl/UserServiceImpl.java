package lk.ijse.autocert.service.impl;

import lk.ijse.autocert.dto.UpdateProfileDTO;
import lk.ijse.autocert.dto.UserDTO;
import lk.ijse.autocert.entity.User;
import lk.ijse.autocert.repository.UserRepository;
import lk.ijse.autocert.service.ImgbbService;
import lk.ijse.autocert.service.UserService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;  // Injected ModelMapper
    private final ImgbbService imgbbService; // Assuming you have an ImgbbService for image uploads

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
            String imageUrl = imgbbService.uploadImage(dto.getImage());
            user.setProfileImageUrl(imageUrl);
        }

        User updatedUser = userRepository.save(user);
        return modelMapper.map(updatedUser, UserDTO.class);
    }

    @Override
    public User getUserEntityByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

}
