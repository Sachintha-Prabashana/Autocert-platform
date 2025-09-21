package lk.ijse.autocert.service;

import jakarta.transaction.Transactional;
import lk.ijse.autocert.dto.AuthDTO;
import lk.ijse.autocert.dto.AuthResponseDTO;
import lk.ijse.autocert.dto.GoogleLoginDTO;
import lk.ijse.autocert.dto.RegisterDTO;
import lk.ijse.autocert.entity.Role;
import lk.ijse.autocert.entity.User;
import lk.ijse.autocert.exception.UserAlreadyExistsException;
import org.springframework.security.authentication.BadCredentialsException;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.UUID;

public interface AuthService {
    public String register(RegisterDTO registerDTO) ;

    public AuthResponseDTO authenticate(AuthDTO authDTO) ;



    public String loginWithGoogle(GoogleLoginDTO googleLoginDTO) throws GeneralSecurityException, IOException ;


    public Role getUserRoleByEmail(String email) ;
}
