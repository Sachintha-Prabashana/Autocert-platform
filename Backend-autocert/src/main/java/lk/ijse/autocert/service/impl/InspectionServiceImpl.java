package lk.ijse.autocert.service.impl;

import jakarta.mail.internet.MimeMessage;
import lk.ijse.autocert.dto.InspectionDTO;
import lk.ijse.autocert.dto.InspectionHistoryDTO;
import lk.ijse.autocert.entity.*;
import lk.ijse.autocert.repository.BookingRepository;
import lk.ijse.autocert.repository.BookingVehicleRepository;
import lk.ijse.autocert.repository.InspectionRepository;
import lk.ijse.autocert.repository.UserRepository;
import lk.ijse.autocert.service.EmailService;
import lk.ijse.autocert.service.InspectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InspectionServiceImpl implements InspectionService {

    private final InspectionRepository inspectionRepository;
    private final BookingRepository bookingRepository;
    private final JavaMailSender mailSender;
    private final UserRepository userRepository;
    private final BookingVehicleRepository bookingVehicleRepository;
    private final EmailService emailService;

    @Override
    public boolean saveInspectionAndSendEmail(String loggedInUser, InspectionDTO dto) throws Exception {

        try {

            // 1️⃣ Get logged-in inspector entity
            User inspector = userRepository.findByEmail(loggedInUser)
                    .orElseThrow(() -> new RuntimeException("Inspector not found"));

            // 2️⃣ Get booking
            Booking booking = bookingRepository.findById(dto.getBookingId())
                    .orElseThrow(() -> new RuntimeException("Booking not found"));

            User customer = booking.getCustomer(); // Customer
            if (customer == null || customer.getEmail() == null) {
                throw new RuntimeException("Customer email not found");
            }

            // 2️⃣ Save inspection
            Inspection inspection = Inspection.builder()
                    .inspector(inspector)
                    .booking(booking)
                    .vehicleDetails(dto.getVehicle())
                    .type(dto.getType())
                    .result(dto.getResult())
                    .reportUrl(dto.getReportUrl())
                    .inspectionDate(java.time.LocalDateTime.now())
                    .build();

            inspectionRepository.save(inspection);

            // 3️⃣ Send report to customer email
            boolean success = emailService.sendEmailWithReport(customer.getEmail(), inspection.getReportUrl());

            if (success) {
                // 4️⃣ Update booking/inspection status to COMPLETE
                booking.setStatus(BookingStatus.COMPLETED);
                bookingRepository.save(booking);
                System.out.println("Booking status updated to COMPLETE for booking: " + dto.getBookingId());

            }


            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public List<InspectionHistoryDTO> getAllCompletedInspections() {
        return inspectionRepository.findAllCompletedInspections();
    }



}
