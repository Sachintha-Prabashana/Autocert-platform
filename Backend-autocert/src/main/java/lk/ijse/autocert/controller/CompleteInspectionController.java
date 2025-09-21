package lk.ijse.autocert.controller;

import lk.ijse.autocert.dto.ApiResponse;
import lk.ijse.autocert.dto.BookingDetailsDTO;
import lk.ijse.autocert.dto.InspectionDTO;
import lk.ijse.autocert.entity.Inspection;
import lk.ijse.autocert.entity.User;
import lk.ijse.autocert.service.InspectionService;
import lk.ijse.autocert.service.impl.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/inspections")
@RequiredArgsConstructor

public class CompleteInspectionController {

    private final BookingService bookingService;
    private final InspectionService inspectionService;

    @GetMapping("/booking-details/{bookingId}")
    @PreAuthorize("hasRole('INSPECTOR')")
    public ResponseEntity<BookingDetailsDTO> getBookingDetails(@PathVariable Long bookingId) {
        BookingDetailsDTO bookingDetails = bookingService.getBookingDetailsForInspection(bookingId);
        if (bookingDetails != null) {
            return ResponseEntity.ok(bookingDetails);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PreAuthorize("hasRole('INSPECTOR')")
    @PostMapping("/save")
    public ResponseEntity<?> saveInspection(
            @AuthenticationPrincipal UserDetails principal,
            @RequestBody InspectionDTO dto) throws Exception {

        boolean isSaved = inspectionService.saveInspectionAndSendEmail(principal.getUsername(), dto);

        if (isSaved) {
            return ResponseEntity.ok(new ApiResponse(200, "Inspection saved and report sent successfully", true));
        } else {
            return ResponseEntity.badRequest().body(new ApiResponse(400, "Failed to save inspection or send report", false));
        }
    }
}
