package lk.ijse.autocert.controller;

import lk.ijse.autocert.dto.InspectionCenterDTO;
import lk.ijse.autocert.entity.InspectionCenter;
import lk.ijse.autocert.service.InspectionCenterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/centers")  // ✅ Base path
@RequiredArgsConstructor

public class InspectionCenterController {
    private final InspectionCenterService centerService;

    // ✅ Get center by name
    @GetMapping("/name/{name}")
    public ResponseEntity<InspectionCenterDTO> getCenterByName(@PathVariable String name) {
        return ResponseEntity.ok(centerService.getCenterByName(name));
    }
}
