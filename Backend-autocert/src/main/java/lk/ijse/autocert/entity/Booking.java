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
    @Column(length = 30, nullable = false)
    private BookingStatus status; // PENDING, CONFIRMED, COMPLETED, CANCELLED

    @Enumerated(EnumType.STRING)
    private InspectionType inspectionType; // <-- New field

    @Enumerated(EnumType.STRING)
    private TimeSlot timeSlot; // <-- added

    @ManyToOne
    @JoinColumn(name = "center_id", nullable = true) // allow null for MOBILE
    private InspectionCenter inspectionCenter;


    @Enumerated(EnumType.STRING)
    private ServiceType serviceType; // MOBILE or FACILITY

    @Embedded
    private ServiceAddress serviceAddress; // For mobile service

    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private User customer;

    // 🔹 Assigned inspector (set after confirmation)
    @ManyToOne
    @JoinColumn(name = "inspector_id")
    private InspectorProfile inspector;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "booking_vehicle_id", nullable = false)
    private BookingVehicle bookingVehicle;

    @OneToOne(mappedBy = "booking", cascade = CascadeType.ALL)
    private Inspection inspection;   // <-- Link back

    // ✅ Automatically set when booking is created
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

}
