package lk.ijse.autocert.controller;

import lk.ijse.autocert.dto.*;
import lk.ijse.autocert.service.UserService;
import lk.ijse.autocert.service.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService vehicleService;
    private final UserService userService;


    // Customer: Submit vehicle
    @PostMapping("/add")
    public VehicleResponseDTO addVehicle(@RequestBody VehicleRequestDTO dto,
                                         @AuthenticationPrincipal org.springframework.security.core.userdetails.User principal) {

        // Extract email from logged-in user
        String email = principal.getUsername();

        // Find user by email
        UserDTO owner = userService.getUserByEmail(email);

        return vehicleService.saveVehicle(dto, owner.getId());
    }

    // Customer: Get approved vehicles
    @GetMapping("/approved")
    public List<VehicleResponseDTO> getApprovedVehicles() {
        return vehicleService.getAllApprovedVehicles();
    }

    // Customer: Get single approved vehicle details by ID
    @GetMapping("/approved/{id}")
    public ResponseEntity<VehicleResponseDTO> getApprovedVehicleById(@PathVariable Long id) {
        VehicleResponseDTO vehicle = vehicleService.getApprovedVehicleById(id);
        if (vehicle == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(vehicle);
    }

    @GetMapping("/my-listings")
    public ResponseEntity<List<MyListingDTO>> getMyListings(@AuthenticationPrincipal User principal) {
        Long userId = userService.findUserIdByEmail(principal.getUsername());
        List<MyListingDTO> vehicles = vehicleService.getUserVehicles(userId);
        return ResponseEntity.ok(vehicles);
    }

    // Get vehicle by ID
    @GetMapping("/my-listings/{vehicleId}")
    public ResponseEntity<VehicleUpdateDTO> getMyListingById(@PathVariable Long vehicleId) {
        VehicleUpdateDTO dto = vehicleService.getVehicleByIdUpdate(vehicleId);
        if (dto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/my-listings/{vehicleId}")
    public ResponseEntity<ApiResponse> deleteMyListing(
            @PathVariable Long vehicleId,
            @AuthenticationPrincipal User principal) {

        Long userId = userService.findUserIdByEmail(principal.getUsername());

        boolean deleted = vehicleService.deleteUserVehicle(vehicleId, userId);
        if (deleted) {
            return ResponseEntity.ok(new ApiResponse(200, "Vehicle deleted successfully", null));
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new ApiResponse(403, "You are not authorized to delete this listing", null));
        }
    }

    @PutMapping("/my-listings/{vehicleId}")
    public ResponseEntity<ApiResponse> updateMyListing(
            @PathVariable Long vehicleId,
            @RequestBody VehicleUpdateDTO updateDTO,
            @AuthenticationPrincipal User principal) {

        Long userId = userService.findUserIdByEmail(principal.getUsername());

        boolean updated = vehicleService.updateUserVehicle(vehicleId, userId, updateDTO);
        if (updated) {
            return ResponseEntity.ok(new ApiResponse(200, "Vehicle updated successfully", updateDTO));
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new ApiResponse(403, "You are not authorized to update this listing", null));
        }
    }
}

