package lk.ijse.autocert.service.impl;

import lk.ijse.autocert.dto.InspectionAssignmentDTO;
import lk.ijse.autocert.dto.InspectorRequestDTO;
import lk.ijse.autocert.dto.InspectorResponseDTO;
import lk.ijse.autocert.dto.InspectorWorkloadDTO;
import lk.ijse.autocert.entity.InspectionCenter;
import lk.ijse.autocert.entity.InspectorProfile;
import lk.ijse.autocert.entity.Role;
import lk.ijse.autocert.entity.User;
import lk.ijse.autocert.repository.BookingRepository;
import lk.ijse.autocert.repository.InspectionCenterRepository;
import lk.ijse.autocert.repository.InspectorProfileRepository;
import lk.ijse.autocert.repository.UserRepository;
import lk.ijse.autocert.service.EmailService;
import lk.ijse.autocert.service.InspectorService;
import lk.ijse.autocert.util.PasswordGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InspectorServiceImpl implements InspectorService {
    private final UserRepository userRepository;
    private final InspectorProfileRepository inspectorProfileRepository;
    private final PasswordEncoder passwordEncoder; // For encoding password
    private final InspectionCenterRepository centerRepository;
    private final EmailService emailService; // For sending emails
    private final BookingRepository bookingRepository;

    @Override
    public InspectorResponseDTO addInspector(InspectorRequestDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // 1️⃣ Generate a temporary password
        String tempPassword = PasswordGenerator.generateTempPassword();

        // 1️⃣ Create User
        User user = User.builder()
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .role(Role.INSPECTOR)
                .password(passwordEncoder.encode(tempPassword))
                .build();
        user = userRepository.save(user);

        InspectionCenter center = centerRepository.findById(dto.getCenterId())
                .orElseThrow(() -> new RuntimeException("Center not found"));

        InspectorProfile profile = InspectorProfile.builder()
                .user(user)
                .inspectionCenter(center)
                .specializations(dto.getSpecializations()) // ✅ now a List<String>
                .build();
        profile = inspectorProfileRepository.save(profile);

        // ✅ Just set profile, no extra save needed
        user.setInspectorProfile(profile);

        // 5️⃣ Send email with credentials
        emailService.sendInspectorCredentials(user, center.getName(), dto.getSpecializations(), tempPassword);


        // 5️⃣ Return response
        InspectorResponseDTO response = new InspectorResponseDTO();
        response.setId(user.getId());
        response.setFullName(user.getFirstName() + " " + user.getLastName());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());
        response.setSpecializations(profile.getSpecializations());
        response.setCenterName(center.getName());

        return response;
    }

    @Override
    public List<InspectorResponseDTO> getAllInspectors() {
        List<InspectorProfile> profiles = inspectorProfileRepository.findAll();

        return profiles.stream().map(profile -> {
            InspectorResponseDTO dto = new InspectorResponseDTO();
            dto.setId(profile.getId());
            dto.setFullName(profile.getUser().getFirstName() + " " + profile.getUser().getLastName());
            dto.setEmail(profile.getUser().getEmail());
            dto.setPhone(profile.getUser().getPhone());
            dto.setSpecializations(profile.getSpecializations()); // List<String>
            dto.setCenterName(profile.getInspectionCenter().getName());
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public void deleteInspector(Long id) {
        // Find the inspector profile first
        InspectorProfile profile = inspectorProfileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inspector not found"));

        // Remove the profile reference from User
        User user = profile.getUser();
        if (user != null) {
            user.setInspectorProfile(null);
            userRepository.save(user);
        }

        // Delete the profile
        inspectorProfileRepository.delete(profile);

        // Optionally, also delete the User record
         userRepository.delete(user);

    }

    @Override
    public List<InspectionAssignmentDTO> getAssignmentsForInspector(User inspector) {
        return bookingRepository.findByInspector_User(inspector)
                .stream()
                .map(b -> new InspectionAssignmentDTO(
                        b.getId(),
                        b.getCustomer().getFirstName() + " " + b.getCustomer().getLastName(),
                        b.getBookingVehicle().getBrand(),
                        b.getBookingVehicle().getModel(),
                        b.getBookingVehicle().getYear(),
                        b.getInspectionType(),
                        b.getAppointmentDate(),
                        b.getTimeSlot(),
                        b.getStatus()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public List<InspectorWorkloadDTO> getInspectorsWithWorkload(String appointmentDate) {
        LocalDate date = LocalDate.parse(appointmentDate); // "YYYY-MM-DD"
        List<User> inspectors = userRepository.findByRole(Role.INSPECTOR);

        return inspectors.stream().map(user -> {
            InspectorWorkloadDTO dto = new InspectorWorkloadDTO();
            dto.setInspectorId(user.getId());
            dto.setName(user.getFirstName() + " " + user.getLastName());
            dto.setEmail(user.getEmail());

            if (user.getInspectorProfile() != null) {
                dto.setWorkingCenter(user.getInspectorProfile().getInspectionCenter().getName());
                dto.setSpecializations(user.getInspectorProfile().getSpecializations());

                // Only the count, never the actual entity
                int count = bookingRepository.countByInspectorAndDate(user.getInspectorProfile(), date);
                dto.setDailyBookingCount(count);
            }

            return dto;
        }).collect(Collectors.toList());
    }



}
