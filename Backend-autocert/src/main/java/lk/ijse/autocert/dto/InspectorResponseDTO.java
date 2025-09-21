package lk.ijse.autocert.dto;

import lombok.Data;

import java.util.List;

@Data
public class InspectorResponseDTO {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private List<String> specializations; // ✅ Multiple specializations
    private String centerName;
}
