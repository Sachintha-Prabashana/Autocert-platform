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

    private String vehicleDetails; // e.g., "Toyota Camry 2020"

    @Enumerated(EnumType.STRING)
    private ResultStatus result;

    @Enumerated(EnumType.STRING)
    private InspectionType type; // New field

    @Column(length = 1000)
    private String reportUrl; // Store either file path or a link to the PDF

    @ManyToOne
    @JoinColumn(name = "inspector_id")
    private User inspector;

    @OneToOne
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

}
