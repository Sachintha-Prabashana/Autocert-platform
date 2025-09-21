package lk.ijse.autocert.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminCreateDTO {
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    // No password field needed since it's generated
}