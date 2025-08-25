package lk.ijse.autocert.service;

import org.springframework.mail.SimpleMailMessage;

public interface EmailService {
    void sendRegistrationEmail(String toEmail, String firstName);
}
