package lk.ijse.autocert.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TodayScheduleDTO {
    private String time;            // e.g. "09:00 AM"
    private Long bookingId;         // booking reference
    private String customerName;    // John Doe
    private String vehicle;         // Toyota Aqua 2021
    private String inspectionType;  // SAFETY / COMPREHENSIVE
    private String serviceType;     // MOBILE / FACILITY
    private String location;        // e.g. "No. 126, Matara"
    private String status;          // SCHEDULED / IN_PROGRESS / COMPLETED
}
