package lk.ijse.autocert.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class UpdateProfileDTO {
    private String firstName;
    private String lastName;
    private String phone;
    private MultipartFile image; // The actual uploaded image
}
