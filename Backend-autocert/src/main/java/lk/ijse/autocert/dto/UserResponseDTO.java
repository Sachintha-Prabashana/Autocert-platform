package lk.ijse.autocert.dto;

import lk.ijse.autocert.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDTO {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private Role role;
    private String status; // ACTIVE / INACTIVE
}