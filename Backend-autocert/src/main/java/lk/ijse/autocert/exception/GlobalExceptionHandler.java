package lk.ijse.autocert.exception;

import io.jsonwebtoken.ExpiredJwtException;
import lk.ijse.autocert.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(UsernameNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ApiResponse usernameNotFound(UsernameNotFoundException e) {
        return new ApiResponse(404, "User Not Found", e.getMessage());
    }

    @ExceptionHandler(BadCredentialsException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ApiResponse handleBadException(UsernameNotFoundException e) {
        return new ApiResponse(401, "Unauthorized", "Invalid username or password");
    }

    @ExceptionHandler(ExpiredJwtException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ApiResponse handleExpiredJwtException(ExpiredJwtException e) {
        return new ApiResponse(401, "Unauthorized", "JWT token has expired");
    }

    @ExceptionHandler(RuntimeException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ApiResponse handleException(Exception e) {
        return new ApiResponse(500, "Internal Server Error", e.getMessage());
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ApiResponse handleUserAlreadyExistsException(UserAlreadyExistsException e) {
        return new ApiResponse(409, "Conflict", "User with this email already exists");

    }


}
