package lk.ijse.autocert.controller;

import lk.ijse.autocert.dto.ApiResponse;
import lk.ijse.autocert.dto.BookingRequestDTO;
import lk.ijse.autocert.dto.BookingResponseDTO;
import lk.ijse.autocert.dto.UserDTO;
import lk.ijse.autocert.entity.User;
import lk.ijse.autocert.service.UserService;
import lk.ijse.autocert.service.impl.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final UserService userService;


    @PostMapping
    /*@PreAuthorize("hasRole('CUSTOMER')")*/
    public ResponseEntity<ApiResponse> createBooking(
            @RequestBody BookingRequestDTO dto,
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User principalUser) {

        // Fetch managed User entity from email
        User customer = userService.getUserEntityByEmail(principalUser.getUsername());

        // Pass DTO and managed entity to service
        BookingResponseDTO response = bookingService.createBooking(dto, customer);

        // Return response DTO
        return ResponseEntity.ok(
                new ApiResponse(201, "Booking created successfully", response)
        );
    }


}