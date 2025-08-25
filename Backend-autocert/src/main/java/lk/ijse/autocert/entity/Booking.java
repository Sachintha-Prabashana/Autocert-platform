package lk.ijse.autocert.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Date & time chosen for the inspection
    private LocalDate appointmentDate;

    @Enumerated(EnumType.STRING)
    private BookingStatus status; // PENDING, CONFIRMED, COMPLETED, CANCELLED

    @Enumerated(EnumType.STRING)
    private InspectionType inspectionType; // <-- New field

    // The owner who made the booking
    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private User customer;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "booking_vehicle_id", nullable = false)
    private BookingVehicle bookingVehicle;

    @OneToOne(mappedBy = "booking", cascade = CascadeType.ALL)
    private Inspection inspection;   // <-- Link back

}
