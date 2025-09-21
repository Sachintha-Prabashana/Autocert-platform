package lk.ijse.autocert.dto;

import lk.ijse.autocert.entity.BookingStatus;
import lk.ijse.autocert.entity.TimeSlot;
import lk.ijse.autocert.entity.InspectionType;
import lk.ijse.autocert.entity.ServiceType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BookingResponseDTO {
    private Long id;
    private String brand;
    private String model;
    private int year;
    private String description;
    private Integer mileage;

    private String centerName;
    private LocalDate appointmentDate;
    private TimeSlot timeSlot;
    private InspectionType inspectionType;
    private ServiceType serviceType;

    private String streetAddress;
    private String streetAddressLine2;
    private String city;
    private String stateProvince;
    private String postalCode;

    private LocalDateTime createdAt;

    // Inspector info
    private Long inspectorId;
    private String inspectorName;

    // Booking status
    private BookingStatus status;
}
