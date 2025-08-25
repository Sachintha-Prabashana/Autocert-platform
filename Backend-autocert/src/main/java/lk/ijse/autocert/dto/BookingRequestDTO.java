package lk.ijse.autocert.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BookingDTO {
    private Long id;
    private Long vehicleId;
    private Long ownerId;
    private LocalDateTime appointmentDate;
    private String status;
}
