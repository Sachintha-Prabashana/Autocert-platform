package lk.ijse.autocert.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InspectionDTO {

    private Long inspectionId;
    private String inspectionType; // FACILITY / MOBILE
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String vehicleNumber;
    private String vehicleModel;
    private String location; // facility name OR mobile address
    private String appointmentDateTime;
    private String status; // PENDING / SCHEDULED / IN_PROGRESS / COMPLETED / CANCELLED
    private String assignedInspector; // null if not assigned
    private boolean assignable; // true if MOBILE & not assigned
}