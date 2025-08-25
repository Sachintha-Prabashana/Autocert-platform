package lk.ijse.autocert.service;

import lk.ijse.autocert.dto.UserDTO;
import lk.ijse.autocert.entity.User;

public interface UserService {
    UserDTO getUserByEmail(String email) ;
    User getUserEntityByEmail(String username);
}
