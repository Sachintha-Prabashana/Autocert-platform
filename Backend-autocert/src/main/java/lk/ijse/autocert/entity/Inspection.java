package lk.ijse.autocertbackend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

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

    private LocalDate inspectionDate;

    @Enumerated(EnumType.STRING)
    private InspectionResult result;

    private String remarks;

    @ManyToOne
    @JoinColumn(name = "inspector_id")
    private User inspector;

    @ManyToOne
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;
}
