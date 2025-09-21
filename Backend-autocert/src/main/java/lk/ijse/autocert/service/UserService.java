package lk.ijse.autocert.service;

import lk.ijse.autocert.dto.AdminCreateDTO;
import lk.ijse.autocert.dto.PasswordChangeRequest;
import lk.ijse.autocert.dto.UserDTO;
import lk.ijse.autocert.dto.UserResponseDTO;
import lk.ijse.autocert.entity.User;

import java.util.List;

public interface UserService {
    UserDTO getUserByEmail(String email) ;
    User getUserEntityByEmail(String username);
    void changePasswordByEmail(String email, PasswordChangeRequest request) ;

    Long findUserIdByEmail(String email);

    void addAdmin(AdminCreateDTO user);

    List<UserResponseDTO> getAllUsers();
}
