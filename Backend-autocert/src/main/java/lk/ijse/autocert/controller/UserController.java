package lk.ijse.autocert.controller;

import lk.ijse.autocert.dto.*;
import lk.ijse.autocert.entity.User;
import lk.ijse.autocert.service.impl.ChatServiceImpl;
import lk.ijse.autocert.service.impl.UserServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserServiceImpl userService;  // Your service layer
    private final ChatServiceImpl chatService;


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
    ) throws IOException, InterruptedException {
        String email = authentication.getName();
        UserDTO updatedUser = userService.updateProfile(email, updateProfileDTO);
        return ResponseEntity.ok(updatedUser);
    }

    @PatchMapping("/change-password")
    public ResponseEntity<ApiResponse> changePassword(@RequestBody PasswordChangeRequest request,
                                                      Authentication authentication) {

        try {
            // If JWT stores email instead of ID
            String email = authentication.getName();
            userService.changePasswordByEmail(email, request);

            return ResponseEntity.ok(new ApiResponse(200, "Password updated successfully", null));


        } catch (RuntimeException e) {
            // failure response
            return ResponseEntity.badRequest().body(
                    new ApiResponse(400, e.getMessage(), null)
            );
        }
    }

    // Get current inspector info
    @GetMapping("/my-name")
    public Map<String, String> getInspectorName(@AuthenticationPrincipal org.springframework.security.core.userdetails.User principal) {
        User inspector = userService.getUserEntityByEmail(principal.getUsername());
        return Map.of(
                "firstName", inspector.getFirstName(),
                "lastName", inspector.getLastName()
        );
    }

    // Add Admin
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/add-admin")
    public ResponseEntity<ApiResponse> addAdmin(@RequestBody AdminCreateDTO dto) {
        try {
            userService.addAdmin(dto);
            return ResponseEntity.ok(new ApiResponse(200, "Admin added successfully", null));
        } catch (RuntimeException e) {
            return ResponseEntity.ok(new ApiResponse(400, e.getMessage(), null));
        }
    }

    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }


    @GetMapping("/all")
    public List<ChatContactDTO> getAllUsers(Authentication authentication) {
        // Get the current logged-in user from SecurityContext
        String email = authentication.getName(); // from JWT / login principal
        return chatService.getAllUsersExcluding(email);
    }



}
