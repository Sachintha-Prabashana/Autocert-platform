package lk.ijse.autocert.dto;

import lombok.Data;

@Data
public class RegisterDTO {
    private String firstName;
    private String lastName;
    private String email;
    private String password; // Raw password, to be encrypted before saving
    private String phone;
}
