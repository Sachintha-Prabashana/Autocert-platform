package lk.ijse.autocert.dto;

import lombok.Data;

@Data
public class InspectionCenterDTO {
    private Long id;
    private String name;
    private String address;
    private String contactNumber;
    private String openTime;   // format: HH:mm
    private String closeTime;  // format: HH:mm
}
