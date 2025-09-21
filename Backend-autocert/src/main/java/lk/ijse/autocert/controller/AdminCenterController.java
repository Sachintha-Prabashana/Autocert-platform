package lk.ijse.autocert.controller;


import lk.ijse.autocert.dto.CenterDTO;
import lk.ijse.autocert.dto.InspectionCenterDTO;
import lk.ijse.autocert.service.InspectionCenterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/centers")
public class AdminCenterController {

    private final InspectionCenterService centerService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<InspectionCenterDTO> addCenter(@RequestBody InspectionCenterDTO dto) {
        InspectionCenterDTO saved = centerService.saveCenter(dto);
        return ResponseEntity.ok(saved);
    }

    // Get all centers
    @PreAuthorize("hasRole('ADMIN') or hasRole('CUSTOMER')")
    @GetMapping
    public ResponseEntity<List<InspectionCenterDTO>> getAllCenters() {
        return ResponseEntity.ok(centerService.getAllCenters());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/names")
    public ResponseEntity<List<CenterDTO>> getCenterNames() {
        List<CenterDTO> centers = centerService.getAllCenterNames();
        return ResponseEntity.ok(centers);
    }
}
