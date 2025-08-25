package lk.ijse.autocert.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Inspection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime inspectionDate;

    @Enumerated(EnumType.STRING)
    private VehicleStatus result; // APPROVED, REJECTED

    @Enumerated(EnumType.STRING)
    private InspectionType type; // New field

    private String report; // inspector’s remarks

    @ManyToOne
    @JoinColumn(name = "inspector_id")
    private User inspector;

    @ManyToOne
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    @OneToOne
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @OneToOne
    @JoinColumn(name = "booking_vehicle_id", nullable = false)
    private BookingVehicle bookingVehicle;
}
