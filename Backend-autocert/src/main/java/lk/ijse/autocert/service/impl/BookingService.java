package lk.ijse.autocert.service.impl;

import lk.ijse.autocert.dto.BookingRequestDTO;
import lk.ijse.autocert.dto.BookingResponseDTO;
import lk.ijse.autocert.entity.*;
import lk.ijse.autocert.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ModelMapper modelMapper;

    public BookingResponseDTO createBooking(BookingRequestDTO dto, User customer) {

        // 1. Map BookingRequestDTO to BookingVehicle
        BookingVehicle bookingVehicle = BookingVehicle.builder()
                .brand(dto.getBrand())
                .model(dto.getModel())
                .year(dto.getYear())
                .description(dto.getDescription())
                .build();

        // 2. Create Booking
        Booking booking = Booking.builder()
                .appointmentDate(dto.getAppointmentDate())
                .status(BookingStatus.PENDING)
                .inspectionType(dto.getInspectionType())
                .customer(customer)
                .bookingVehicle(bookingVehicle)
                .build();

        // Bi-directional link
        bookingVehicle.setBooking(booking);

        // 3. Save booking (cascades BookingVehicle)
        Booking savedBooking = bookingRepository.save(booking);

        // 4. Map to BookingResponseDTO manually
        BookingResponseDTO responseDTO = new BookingResponseDTO();
        responseDTO.setBookingId(savedBooking.getId());
        responseDTO.setAppointmentDate(savedBooking.getAppointmentDate());
        responseDTO.setStatus(savedBooking.getStatus().name());

        // BookingVehicle fields
        BookingVehicle bv = savedBooking.getBookingVehicle();
        responseDTO.setVehicleId(bv.getId());
        responseDTO.setBrand(bv.getBrand());
        responseDTO.setModel(bv.getModel());
        responseDTO.setYear(bv.getYear());
        responseDTO.setDescription(bv.getDescription());

        // Inspection info
        responseDTO.setInspectionType(savedBooking.getInspectionType().name());
        responseDTO.setInspectionPrice(savedBooking.getInspectionType().getPrice());

        return responseDTO;
    }
}
