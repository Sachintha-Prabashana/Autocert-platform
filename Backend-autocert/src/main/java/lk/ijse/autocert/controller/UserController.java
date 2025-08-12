package lk.ijse.autocert.controller;

import lk.ijse.autocert.dto.UpdateProfileDTO;
import lk.ijse.autocert.dto.UserDTO;
import lk.ijse.autocert.service.impl.UserServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserServiceImpl userService;  // Your service layer


    @GetMapping("/me")
    public ResponseEntity<UserDTO> getLoggedInUser(Authentication authentication) {
        String email = authentication.getName(); // Comes from JWT filter
        UserDTO userDTO = userService.getUserByEmail(email);
        return ResponseEntity.ok(userDTO);
    }

    @PutMapping(value = "/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserDTO> updateProfile(
            Authentication authentication,
            @ModelAttribute UpdateProfileDTO updateProfileDTO
    ) {
        String email = authentication.getName();
        UserDTO updatedUser = userService.updateProfile(email, updateProfileDTO);
        return ResponseEntity.ok(updatedUser);
    }

}
