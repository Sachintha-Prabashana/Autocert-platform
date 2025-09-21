package lk.ijse.autocert.service.impl;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lk.ijse.autocert.entity.Booking;
import lk.ijse.autocert.entity.User;
import lk.ijse.autocert.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.UrlResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.MalformedURLException;
import java.util.List;

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

    public void sendInspectorCredentials(User user, String centerName, List<String> specializations, String tempPassword) {
        String subject = "AutoCert - Inspector Account Created";

        String body = String.format("""
                Dear %s %s,

                Welcome to AutoCert Vehicle Inspection System!

                You have been registered as an inspector with the following details:
                - Name: %s %s
                - Email: %s
                - Inspection Center: %s
                - Specializations: %s

                Your temporary login credentials:
                Email: %s
                Password: %s

                IMPORTANT: Please change this password on your first login for security reasons.

                Best regards,
                AutoCert Admin Team
                """,
                user.getFirstName(), user.getLastName(),
                user.getFirstName(), user.getLastName(),
                user.getEmail(),
                centerName,
                String.join(", ", specializations),
                user.getEmail(),
                tempPassword
        );

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);
    }

    @Override
    public void sendAssignmentEmail(Booking booking) {
        if (booking.getInspector() == null) return;

        User user = booking.getInspector().getUser();
        String centerName = booking.getInspectionCenter() != null
                ? booking.getInspectionCenter().getName()
                : "Mobile Service";
        // Build HTML content
        String htmlContent = """
        <html>
        <body style="font-family:Arial,sans-serif; color:#333;">
            <div style="max-width:600px; margin:auto; padding:20px; border:1px solid #e0e0e0; border-radius:8px; background-color:#f9f9f9;">
                <h2 style="color:#007bff;">Hello %s %s,</h2>
                <p>You have been assigned to a new vehicle inspection. Please find the details below:</p>
                
                <h3 style="color:#555;">Booking Details</h3>
                <table style="width:100%%; border-collapse:collapse;">
                    <tr>
                        <td style="padding:8px; font-weight:bold;">Service Type:</td>
                        <td style="padding:8px;">%s</td>
                    </tr>
                    <tr>
                        <td style="padding:8px; font-weight:bold;">Appointment Date:</td>
                        <td style="padding:8px;">%s</td>
                    </tr>
                    <tr>
                        <td style="padding:8px; font-weight:bold;">Time Slot:</td>
                        <td style="padding:8px;">%s</td>
                    </tr>
                    <tr>
                        <td style="padding:8px; font-weight:bold;">Location:</td>
                        <td style="padding:8px;">%s</td>
                    </tr>
                </table>
                
                <h3 style="color:#555;">Vehicle Info</h3>
                <table style="width:100%%; border-collapse:collapse;">
                    <tr>
                        <td style="padding:8px; font-weight:bold;">Brand & Model:</td>
                        <td style="padding:8px;">%s %s</td>
                    </tr>
                    <tr>
                        <td style="padding:8px; font-weight:bold;">Year:</td>
                        <td style="padding:8px;">%d</td>
                    </tr>
                    <tr>
                        <td style="padding:8px; font-weight:bold;">Mileage:</td>
                        <td style="padding:8px;">%s km</td>
                    </tr>
                    <tr>
                        <td style="padding:8px; font-weight:bold;">Description:</td>
                        <td style="padding:8px;">%s</td>
                    </tr>
                </table>
                
                <h3 style="color:#555;">Inspector Info</h3>
                <p>Inspection Center: <b>%s</b></p>
                
                <p style="margin-top:20px;">Please log in to your dashboard to confirm and manage this inspection.</p>
                
                <a href="http://localhost:3000/login" style="display:inline-block; background:#007bff; color:white; padding:10px 20px; text-decoration:none; border-radius:5px;">Login to Dashboard</a>
                
                <p style="margin-top:20px; font-size:12px; color:#777;">This is an automated notification from AutoCert – Vehicle Inspection System.</p>
            </div>
        </body>
        </html>
        """.formatted(
                user.getFirstName(), user.getLastName(),
                booking.getServiceType().name(),
                booking.getAppointmentDate(),
                booking.getTimeSlot(),
                centerName,
                booking.getBookingVehicle().getBrand(),
                booking.getBookingVehicle().getModel(),
                booking.getBookingVehicle().getYear(),
                booking.getBookingVehicle().getMileage(),
                booking.getBookingVehicle().getDescription(),
                centerName
        );

        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");
            helper.setTo(user.getEmail());
            helper.setSubject("New Vehicle Inspection Assigned - AutoCert");
            helper.setText(htmlContent, true); // true = HTML
            helper.setFrom(fromEmail);

            mailSender.send(mimeMessage);
            System.out.println("✅ Assignment email sent to: " + user.getEmail());
        } catch (MessagingException e) {
            System.err.println("❌ Failed to send assignment email: " + e.getMessage());
        }
    }

    @Override
    public boolean sendEmailWithReport(String toEmail, String reportUrl) throws MessagingException, IOException {
        // Log customer email and report URL
        System.out.println("Sending inspection report email to: " + toEmail);
        System.out.println("Report URL: " + reportUrl);

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(toEmail);
        helper.setSubject("Your Vehicle Inspection Report");

        String htmlContent = """
        <html>
          <body style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #2E86C1;">AutoCert - Vehicle Inspection Report</h2>
            <p>Dear Customer,</p>
            <p>Your inspection report is attached as a PDF.<br/>
               You may also <a href='%s' target='_blank'>click here</a> to view it online.
            </p>
            <br/>
            <p style="font-size: 12px; color: #888;">
              Thank you for choosing <strong>AutoCert</strong>!<br/>
              This is an automated message, please do not reply.
            </p>
          </body>
        </html>
        """.formatted(reportUrl);

        helper.setText(htmlContent, true);

        // Use UrlResource to attach PDF from Cloudinary
        helper.addAttachment("InspectionReport.pdf", new UrlResource(reportUrl));

        mailSender.send(message);

        // Log confirmation after sending
        System.out.println("Inspection report email sent successfully to: " + toEmail);
        return true;
    }

    @Override
    public void sendAdminPassword(String email, String generatedPassword) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(email);
            helper.setSubject("🚀 Your Admin Account Credentials - AutoCert");

            // HTML Template
            String htmlContent = """
                <div style="font-family: Arial, sans-serif; padding:20px; background-color:#f4f6f8;">
                  <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:10px; box-shadow:0 4px 10px rgba(0,0,0,0.1); padding:30px;">
                    
                    <h2 style="color:#2c3e50; text-align:center;">Welcome to <span style="color:#0d6efd;">AutoCert</span> 🚗</h2>
                    
                    <p style="font-size:16px; color:#34495e;">
                      Hello, <br><br>
                      Your <b>Admin account</b> has been successfully created.  
                      Please use the credentials below to log in for the first time.
                    </p>
                    
                    <div style="margin:20px 0; padding:15px; background:#f1f5ff; border:1px solid #d1e7ff; border-radius:8px;">
                      <p style="font-size:16px; margin:0;"><b>Email:</b> %s</p>
                      <p style="font-size:16px; margin:0;"><b>Temporary Password:</b> <span style="color:#e74c3c;">%s</span></p>
                    </div>
                    
                    <p style="font-size:15px; color:#7f8c8d;">
                      For security reasons, please change your password immediately after logging in.
                    </p>
                    
                    <div style="text-align:center; margin-top:25px;">
                      <a href="http://localhost:3000/login" 
                         style="background:#0d6efd; color:#fff; padding:12px 25px; 
                                border-radius:5px; text-decoration:none; font-size:16px;">
                        🔑 Login to AutoCert
                      </a>
                    </div>
                    
                    <hr style="margin:30px 0; border:none; border-top:1px solid #ddd;">
                    
                    <p style="font-size:13px; color:#95a5a6; text-align:center;">
                      This is an automated email, please do not reply.<br>
                      © 2025 AutoCert - Vehicle Inspection & Registration Center
                    </p>
                  </div>
                </div>
                """.formatted(email, generatedPassword);

            helper.setText(htmlContent, true);

            mailSender.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email to " + email, e);
        }
    }


}
