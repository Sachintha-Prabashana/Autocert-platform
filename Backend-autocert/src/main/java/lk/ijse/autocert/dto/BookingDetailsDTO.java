package lk.ijse.autocert.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingDetailsDTO {
    private Long bookingId;
    private String customerName;
    private String customerEmail;
    private String vehicleBrand;
    private String vehicleModel;
    private int vehicleYear;
    private String inspectionType;
    private String bookingDate;
    private String status;
}