package lk.ijse.autocert.dto;

import lk.ijse.autocert.entity.BookingStatus;
import lk.ijse.autocert.entity.InspectionType;
import lk.ijse.autocert.entity.TimeSlot;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InspectionAssignmentDTO {

    private Long bookingId;
    private String customerName;
    private String vehicleBrand;
    private String vehicleModel;
    private int vehicleYear;
    private InspectionType inspectionType;
    private LocalDate scheduledDate;
    private TimeSlot timeSlot;
    private BookingStatus status;
}