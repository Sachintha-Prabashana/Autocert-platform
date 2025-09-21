package lk.ijse.autocert.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InspectorWorkloadDTO {
    private Long inspectorId;
    private String name;
    private String email;
    private String workingCenter;
    private List<String> specializations;
    private int dailyBookingCount; // number of bookings on the specific day

}