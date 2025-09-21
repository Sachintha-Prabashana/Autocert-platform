package lk.ijse.autocert.dto;

import lk.ijse.autocert.entity.InspectionType;
import lk.ijse.autocert.entity.ResultStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InspectionHistoryDTO {
    private Long inspectionId;       // Changed from bookingId
    private String customerName;
    private String vehicleBrand;
    private String vehicleModel;
    private int vehicleYear;
    private InspectionType inspectionType;   // SAFETY, COMPREHENSIVE, etc.
    private LocalDateTime dateCompleted;
    private ResultStatus result;           // PASS, FAIL
}