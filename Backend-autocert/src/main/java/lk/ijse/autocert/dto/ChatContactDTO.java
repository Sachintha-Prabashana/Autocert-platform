package lk.ijse.autocert.dto;

import lk.ijse.autocert.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatContactDTO {
    private Long id;
    private String name;
    private Role role;
    private boolean online;
}
