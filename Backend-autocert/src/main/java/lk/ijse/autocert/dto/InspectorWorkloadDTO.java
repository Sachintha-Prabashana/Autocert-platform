package lk.ijse.autocert.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InspectorDTO {
    private Long inspectorId;              // user id
    private String name;                   // firstName + lastName
    private String email;
    private String workingCenter;          // from InspectorProfile -> InspectionCenter
    private List<String> specializations; // from InspectorProfile
    private List<BookingInspectionDTO> assignedBookings; // bookings assigned to this inspector

}