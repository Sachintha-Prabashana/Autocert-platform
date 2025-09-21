package lk.ijse.autocert.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BookingInspectionDTO {
    private Long inspectionId;           // Booking ID
    private String type;                 // FACILITY / MOBILE
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String vehicleNumber;
    private String vehicleModel;
    private String location;             // Facility center OR mobile address
    private String appointmentDateTime;  // formatted string
    private String status;               // PENDING / SCHEDULED / IN_PROGRESS / COMPLETED / CANCELLED
    private String assignedInspector;    // null if none
    private Boolean assignable;          // true if admin can assign inspector (for MOBILE only and inspector not assigned)
}
