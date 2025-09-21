package lk.ijse.autocert.controller;

import lk.ijse.autocert.dto.PendingVehicleDTO;
import lk.ijse.autocert.dto.VehicleResponseDTO;
import lk.ijse.autocert.service.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/vehicles")
public class VehicleAdminController {
    private final VehicleService vehicleService;
    // Admin: Approve vehicle
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/approve")
    public ResponseEntity<VehicleResponseDTO> approveVehicle(@PathVariable("id") Long vehicleId) {
        return ResponseEntity.ok(vehicleService.approveVehicle(vehicleId));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/pending")
    public ResponseEntity<List<PendingVehicleDTO>> getPendingVehicles() {
        List<PendingVehicleDTO> pendingVehicles = vehicleService.getPendingVehicles();
        return ResponseEntity.ok(pendingVehicles);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/reject")
    public ResponseEntity<VehicleResponseDTO> rejectVehicle(@PathVariable("id") Long vehicleId) {
        return ResponseEntity.ok(vehicleService.rejectVehicle(vehicleId));
    }
}
