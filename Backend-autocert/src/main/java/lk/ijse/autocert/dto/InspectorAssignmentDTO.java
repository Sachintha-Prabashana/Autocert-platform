package lk.ijse.autocert.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InspectorAssignmentDTO {
    private Long inspectorId; // This refers to InspectorProfile id
    private Long bookingId;
}
