package lk.ijse.autocert.service;

import jakarta.mail.MessagingException;
import lk.ijse.autocert.entity.Booking;
import lk.ijse.autocert.entity.User;
import org.springframework.mail.SimpleMailMessage;

import java.io.IOException;
import java.net.MalformedURLException;
import java.util.List;

public interface EmailService {
    void sendRegistrationEmail(String toEmail, String firstName);

    void sendInspectorCredentials(User user, String name, List<String> specializations, String tempPassword);

    void sendAssignmentEmail(Booking booking);

    boolean sendEmailWithReport(String email, String reportUrl) throws MessagingException, IOException;

    void sendAdminPassword(String email, String generatedPassword);
}
