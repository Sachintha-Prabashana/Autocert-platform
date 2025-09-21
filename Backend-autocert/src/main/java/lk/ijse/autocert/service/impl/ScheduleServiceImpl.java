package lk.ijse.autocert.service.impl;

import lk.ijse.autocert.dto.TodayScheduleDTO;
import lk.ijse.autocert.entity.ServiceType;
import lk.ijse.autocert.repository.BookingRepository;
import lk.ijse.autocert.service.ScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ScheduleServiceImpl implements ScheduleService {
    private final BookingRepository bookingRepository;

    @Override
    public List<TodayScheduleDTO> getTodaySchedule() {
        return bookingRepository.findTodayBookings()
                .stream()
                .map(b -> {
                    // 1️⃣ Format location based on service type
                    String location;
                    if (b.getServiceType() == ServiceType.MOBILE && b.getServiceAddress() != null) {
                        location = b.getServiceAddress().getStreetAddress()
                                + (b.getServiceAddress().getStreetAddressLine2() != null ? ", " + b.getServiceAddress().getStreetAddressLine2() : "")
                                + ", " + b.getServiceAddress().getCity()
                                + ", " + b.getServiceAddress().getStateProvince()
                                + (b.getServiceAddress().getPostalCode() != null ? ", " + b.getServiceAddress().getPostalCode() : "");
                    } else if (b.getServiceType() == ServiceType.FACILITY && b.getInspectionCenter() != null) {
                        location = b.getInspectionCenter().getName();
                    } else {
                        location = "N/A";
                    }

                    // 2️⃣ Format time nicely (if stored as LocalTime)
                    String formattedTime = b.getTimeSlot() != null ? b.getTimeSlot().toString() : "N/A";
                    // You can use DateTimeFormatter for nicer formatting:
                    // DateTimeFormatter formatter = DateTimeFormatter.ofPattern("hh:mm a");
                    // formattedTime = b.getTimeSlot().format(formatter);

                    // 3️⃣ Map status to user-friendly text
                    String status;
                    switch (b.getStatus()) {
                        case PENDING_ASSIGNMENT:
                            status = "SCHEDULED";
                            break;
                        case ASSIGNED:
                            status = "SCHEDULED";
                            break;
                        case IN_PROGRESS:
                            status = "IN_PROGRESS";
                            break;
                        case COMPLETED:
                            status = "COMPLETED";
                            break;
                        default:
                            status = b.getStatus().name();
                    }

                    // 4️⃣ Build DTO
                    return TodayScheduleDTO.builder()
                            .time(formattedTime)
                            .bookingId(b.getId())
                            .customerName(b.getCustomer().getFirstName() + " " + b.getCustomer().getLastName())
                            .vehicle(b.getBookingVehicle().getBrand() + " " + b.getBookingVehicle().getModel() + " " + b.getBookingVehicle().getYear())
                            .inspectionType(b.getInspectionType().name())
                            .serviceType(b.getServiceType().name())
                            .location(location)
                            .status(status)
                            .build();
                })
                .toList();
    }

}
