package lk.ijse.autocert.dto;

import lombok.Data;

import java.util.List;

@Data
public class InspectorRequestDTO {
    private String firstName;
    private String lastName;
    private String email;
    private String phone;

    // ✅ Updated: an inspector can have multiple specializations
    private List<String> specializations;
    private Long centerId; // safer to use ID
}
