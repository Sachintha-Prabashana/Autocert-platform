package lk.ijse.autocert.dto;

import lk.ijse.autocert.entity.InspectionType;
import lk.ijse.autocert.entity.ResultStatus;
import lk.ijse.autocert.entity.VehicleStatus;
import lombok.Data;

@Data
public class InspectionDTO {
    private Long bookingId;
    private String vehicle;
    private InspectionType type;
    private ResultStatus result;
    private String reportUrl; // URL of the PDF report
}