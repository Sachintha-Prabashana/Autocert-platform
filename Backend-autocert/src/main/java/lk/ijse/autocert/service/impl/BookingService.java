package lk.ijse.autocert.service.impl;

import lk.ijse.autocert.dto.*;
import lk.ijse.autocert.entity.*;
import lk.ijse.autocert.repository.BookingRepository;
import lk.ijse.autocert.repository.InspectionCenterRepository;
import lk.ijse.autocert.repository.InspectorProfileRepository;
import lk.ijse.autocert.repository.UserRepository;
import lk.ijse.autocert.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final InspectionCenterRepository centerRepository;
    private final ModelMapper modelMapper;
    private final InspectorProfileRepository inspectorProfileRepository;
    private final EmailService emailService;  // ✅ Inject EmailService

    private static final int MAX_BOOKINGS_PER_SLOT = 5;

    @Transactional
    public BookingResponseDTO createBooking(BookingRequestDTO dto, User customer) {

        // 1️⃣ Validate FACILITY → must have centerName
        InspectionCenter center = null;
        if (dto.getServiceType() == ServiceType.FACILITY) {
            if (dto.getCenterName() == null)
                throw new IllegalArgumentException("Center name is required for FACILITY service type.");

            center = centerRepository.findByName(dto.getCenterName())
                    .orElseThrow(() -> new RuntimeException("Center not found"));
        }

        // 2️⃣ Validate MOBILE → must have address
        if (dto.getServiceType() == ServiceType.MOBILE && dto.getStreetAddress() == null)
            throw new IllegalArgumentException("Address is required for MOBILE service type.");

        // 3️⃣ Validate time slot
        long bookedCount = center != null ?
                bookingRepository.countByAppointmentDateAndTimeSlotAndInspectionCenter(
                        dto.getAppointmentDate(), dto.getTimeSlot(), center) : 0;

        if (bookedCount >= MAX_BOOKINGS_PER_SLOT)
            throw new RuntimeException("Time slot fully booked at this center");

        // 4️⃣ Map vehicle
        BookingVehicle vehicle = BookingVehicle.builder()
                .brand(dto.getBrand())
                .model(dto.getModel())
                .year(dto.getYear())
                .description(dto.getDescription())
                .mileage(dto.getMileage())
                .build();

        // 5️⃣ Service address
        ServiceAddress address = null;
        if (dto.getServiceType() == ServiceType.MOBILE) {
            address = ServiceAddress.builder()
                    .streetAddress(dto.getStreetAddress())
                    .streetAddressLine2(dto.getStreetAddressLine2())
                    .city(dto.getCity())
                    .stateProvince(dto.getStateProvince())
                    .postalCode(dto.getPostalCode())
                    .build();
        }

        // 6️⃣ Create booking
        Booking booking = Booking.builder()
                .appointmentDate(dto.getAppointmentDate())
                .inspectionType(dto.getInspectionType())
                .timeSlot(dto.getTimeSlot())
                .inspectionCenter(center)
                .serviceType(dto.getServiceType())
                .serviceAddress(address)
                .customer(customer)
                .status(BookingStatus.PENDING_ASSIGNMENT)
                .bookingVehicle(vehicle)
                .build();
        vehicle.setBooking(booking);

        // 7️⃣ Auto-assign inspector
        if (center != null) {
            // Get all inspectors for this center
            List<InspectorProfile> inspectors = userRepository.findInspectorsByCenter(center.getId())
                    .stream()
                    .map(User::getInspectorProfile) // convert User -> InspectorProfile
                    .filter(ip -> ip != null)
                    .collect(Collectors.toList());

            // Find first available inspector with slots
            InspectorProfile assignedInspector = inspectors.stream()
                    .filter(ip -> bookingRepository.countByInspectorAndStatus(ip, BookingStatus.PENDING_ASSIGNMENT) < MAX_BOOKINGS_PER_SLOT)
                    .findFirst()
                    .orElse(null);

            if (assignedInspector != null) {
                booking.setInspector(assignedInspector); // InspectorProfile type
                booking.setStatus(BookingStatus.ASSIGNED);
            } else {
                booking.setStatus(BookingStatus.PENDING_ASSIGNMENT); // stays pending if none available
            }
        }


        Booking savedBooking = bookingRepository.save(booking);

        // ✅ Send email if inspector assigned automatically
        if (savedBooking.getInspector() != null) {
            emailService.sendAssignmentEmail(savedBooking);
        }

        // 8️⃣ Manual mapping to DTO
        BookingResponseDTO response = new BookingResponseDTO();
        response.setId(savedBooking.getId());
        response.setBrand(savedBooking.getBookingVehicle().getBrand());
        response.setModel(savedBooking.getBookingVehicle().getModel());
        response.setYear(savedBooking.getBookingVehicle().getYear());
        response.setDescription(savedBooking.getBookingVehicle().getDescription());
        response.setMileage(savedBooking.getBookingVehicle().getMileage());
        response.setAppointmentDate(savedBooking.getAppointmentDate());
        response.setInspectionType(savedBooking.getInspectionType());
        response.setTimeSlot(savedBooking.getTimeSlot());
        response.setServiceType(savedBooking.getServiceType());
        response.setCenterName(savedBooking.getInspectionCenter() != null ? savedBooking.getInspectionCenter().getName() : null);
        response.setStreetAddress(savedBooking.getServiceAddress() != null ? savedBooking.getServiceAddress().getStreetAddress() : null);
        response.setStreetAddressLine2(savedBooking.getServiceAddress() != null ? savedBooking.getServiceAddress().getStreetAddressLine2() : null);
        response.setCity(savedBooking.getServiceAddress() != null ? savedBooking.getServiceAddress().getCity() : null);
        response.setStateProvince(savedBooking.getServiceAddress() != null ? savedBooking.getServiceAddress().getStateProvince() : null);
        response.setPostalCode(savedBooking.getServiceAddress() != null ? savedBooking.getServiceAddress().getPostalCode() : null);
        response.setInspectorName(savedBooking.getInspector() != null ?
                savedBooking.getInspector().getUser().getFirstName() + " " + savedBooking.getInspector().getUser().getLastName()
                : null);
        response.setStatus(savedBooking.getStatus());

        return response;
    }


    public boolean assignInspector(InspectorAssignmentDTO assignmentDTO) {
        // Fetch booking and inspector
        Optional<Booking> bookingOpt = bookingRepository.findById(assignmentDTO.getBookingId());
//        Optional<InspectorProfile> inspectorOpt = inspectorProfileRepository.findById(assignmentDTO.getInspectorId());
        Optional<User> userOpt = userRepository.findById(assignmentDTO.getInspectorId());
        Optional<InspectorProfile> inspectorOpt = userOpt.flatMap(u -> Optional.ofNullable(u.getInspectorProfile()));

        if (bookingOpt.isEmpty() || inspectorOpt.isEmpty()) {
            return false; // Either booking or inspector not found
        }

        Booking booking = bookingOpt.get();
        InspectorProfile inspector = inspectorOpt.get();

        LocalDate appointmentDate = booking.getAppointmentDate();
        if (appointmentDate == null) {
            return false; // Booking has no appointment date
        }

        // Check inspector availability for the date
        if (!isInspectorAvailable(inspector, appointmentDate)) {
            return false; // Inspector is fully booked
        }

        // For FACILITY inspections, ensure inspector belongs to the same center
        if (booking.getServiceType() == ServiceType.FACILITY) {
            if (booking.getInspectionCenter() == null || inspector.getInspectionCenter() == null) {
                return false; // Center info missing
            }
            if (!inspector.getInspectionCenter().getId().equals(booking.getInspectionCenter().getId())) {
                return false; // Inspector not assigned to this facility
            }
        }

        // Assign inspector to the booking
        booking.setInspector(inspector);
        booking.setStatus(BookingStatus.ASSIGNED);

        // Save changes
        bookingRepository.save(booking);

        // Send email notification (safely)
        try {
            emailService.sendAssignmentEmail(booking);
        } catch (Exception e) {
            System.err.println("❌ Failed to send assignment email: " + e.getMessage());
        }

        return true;
    }

    // Helper method to check inspector availability
    private boolean isInspectorAvailable(InspectorProfile inspector, LocalDate date) {
        if (inspector == null || date == null) return false;

        // Count how many bookings the inspector already has on that date
        long assignedBookings = bookingRepository.countByInspectorAndAppointmentDate(inspector, date);

        final int MAX_BOOKINGS_PER_DAY = 8; // Configurable

        return assignedBookings < MAX_BOOKINGS_PER_DAY;
    }


    public List<BookingResponseDTO> getPendingAssignments() {
        return bookingRepository.findByStatus(BookingStatus.PENDING_ASSIGNMENT)
                .stream()
                .map(b -> {
                    BookingResponseDTO dto = modelMapper.map(b, BookingResponseDTO.class);
                    dto.setInspectorName(b.getInspector() != null ?
                            b.getInspector().getUser().getFirstName() + " " + b.getInspector().getUser().getLastName() : null);
                    dto.setStatus(b.getStatus());
                    return dto;
                }).collect(Collectors.toList());
    }

    public List<BookingInspectionDTO> getAllBookingInspections() {
        return bookingRepository.findAllWithDetails()
                .stream()
                .map(b -> {
                    BookingInspectionDTO dto = BookingInspectionDTO.builder()
                            .inspectionId(b.getId())
                            .type(b.getServiceType().name()) // FACILITY / MOBILE
                            .customerName(b.getCustomer().getFirstName() + " " + b.getCustomer().getLastName())
                            .customerEmail(b.getCustomer().getEmail())
                            .customerPhone(b.getCustomer().getPhone())
                            .vehicleNumber(b.getBookingVehicle().getBrand() + " " + b.getBookingVehicle().getModel()) // or VIN if needed
                            .vehicleModel(b.getBookingVehicle().getModel())
                            .location(b.getServiceType() == ServiceType.FACILITY
                                    ? b.getInspectionCenter().getName()
                                    : b.getServiceAddress().getStreetAddress() + ", " + b.getServiceAddress().getCity())
                            .appointmentDateTime(b.getAppointmentDate() + " " + b.getTimeSlot())
                            .status(b.getStatus().name())
                            .assignedInspector(b.getInspector() != null
                                    ? b.getInspector().getUser().getFirstName() + " " + b.getInspector().getUser().getLastName()
                                    : null)
                            .assignable(b.getServiceType() == ServiceType.MOBILE && b.getInspector() == null)
                            .build();
                    return dto;
                }).collect(Collectors.toList());
    }

    public BookingDetailsDTO getBookingDetailsForInspection(Long bookingId) {
        Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);

        if (bookingOpt.isPresent()) {
            Booking booking = bookingOpt.get();

            return new BookingDetailsDTO(
                    booking.getId(),
                    booking.getCustomer().getFirstName()+" "+booking.getCustomer().getLastName(),
                    booking.getCustomer().getEmail(),
                    booking.getBookingVehicle().getBrand(),
                    booking.getBookingVehicle().getModel(),
                    booking.getBookingVehicle().getYear(),
                    booking.getInspectionType().name(),
                    booking.getAppointmentDate().toString(),
                    booking.getStatus().name()
            );
        }
        return null;
    }
}
