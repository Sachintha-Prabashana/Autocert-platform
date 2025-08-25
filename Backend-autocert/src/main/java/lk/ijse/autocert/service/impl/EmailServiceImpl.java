package lk.ijse.autocert.service.impl;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lk.ijse.autocert.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Async
    public void sendRegistrationEmail(String toEmail, String firstName) {
        try {
            String subject = "Welcome to AutoCert 🚗";
            String htmlContent = "<h2 style='color:#007bff;'>Hi " + firstName + ",</h2>"
                    + "<p>Thank you for signing up at <b>AutoCert – Vehicle Inspection & Registration Center</b>.</p>"
                    + "<p>Your account has been created successfully! We’re excited to have you on board.</p>"
                    + "<a href='http://localhost:3000/login' style='display:inline-block;background:#007bff;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;'>Login Now</a>"
                    + "<br><br><p>Best Regards,<br>The AutoCert Team</p>";

            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setFrom(fromEmail);
            helper.setText(htmlContent, true); // true = HTML

            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            System.err.println("❌ Failed to send registration email: " + e.getMessage());
        }
    }
}
