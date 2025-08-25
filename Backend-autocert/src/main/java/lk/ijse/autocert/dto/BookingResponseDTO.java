package lk.ijse.autocert.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponseDTO {
    private Long bookingId;
    private LocalDate appointmentDate;
    private String status;

    // Vehicle info
    private Long vehicleId;           // Optional if using BookingVehicle
    private String brand;
    private String model;
    private int year;
    private String description;

    // Inspection info
    private String inspectionType;
    private double inspectionPrice;
}
