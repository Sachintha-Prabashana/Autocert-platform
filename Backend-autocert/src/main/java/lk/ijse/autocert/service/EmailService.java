package lk.ijse.autocertbackend.service;

import org.springframework.mail.SimpleMailMessage;

public interface EmailService {
    void sendSimpleEmail(String toEmail, String subject, String body);
}
