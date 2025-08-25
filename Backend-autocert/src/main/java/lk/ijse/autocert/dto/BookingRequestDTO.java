package lk.ijse.autocert.dto;

import lk.ijse.autocert.entity.InspectionType;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class BookingRequestDTO {
    private String brand;
    private String model;
    private int year;
    private String description;
    private LocalDate appointmentDate;
    private InspectionType inspectionType;
}
