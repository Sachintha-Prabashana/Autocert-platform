package lk.ijse.autocert.controller;

import lk.ijse.autocert.dto.InspectorRequestDTO;
import lk.ijse.autocert.dto.InspectorResponseDTO;
import lk.ijse.autocert.service.InspectorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/inspectors")
@RequiredArgsConstructor
public class UserAdminController {

    private final InspectorService inspectorService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<InspectorResponseDTO> addInspector(@RequestBody InspectorRequestDTO dto) {
        return ResponseEntity.ok(inspectorService.addInspector(dto));
    }
}
