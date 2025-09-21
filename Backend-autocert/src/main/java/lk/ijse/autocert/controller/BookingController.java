package lk.ijse.autocert.controller;

import lk.ijse.autocert.dto.ApiResponse;
import lk.ijse.autocert.dto.BookingRequestDTO;
import lk.ijse.autocert.dto.BookingResponseDTO;
import lk.ijse.autocert.dto.UserDTO;
import lk.ijse.autocert.entity.InspectionLocation;
import lk.ijse.autocert.entity.User;
import lk.ijse.autocert.service.UserService;
import lk.ijse.autocert.service.impl.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final UserService userService;


    @PostMapping
    public ResponseEntity<ApiResponse> createBooking(
            @RequestBody BookingRequestDTO dto,
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User principalUser
    ) {
        User customer = userService.getUserEntityByEmail(principalUser.getUsername());
        BookingResponseDTO response = bookingService.createBooking(dto, customer);

        return ResponseEntity.ok(new ApiResponse(201, "Booking created successfully", response));
    }

//    @PatchMapping("/assign-inspector")
//    public ResponseEntity<ApiResponse> assignInspector(@RequestParam Long bookingId,
//                                                       @RequestParam Long inspectorId) {
//        bookingService.assignInspector(bookingId, inspectorId);
//        return ResponseEntity.ok(new ApiResponse(200, "Inspector assigned successfully", null));
//    }

    @GetMapping("/pending-assignments")
    public ResponseEntity<ApiResponse> getPendingAssignments() {
        List<BookingResponseDTO> pending = bookingService.getPendingAssignments();
        return ResponseEntity.ok(new ApiResponse(200, "Pending assignments fetched", pending));
    }




}