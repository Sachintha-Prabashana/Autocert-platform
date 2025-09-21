package lk.ijse.autocert.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InspectorProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "inspector_specializations",
            joinColumns = @JoinColumn(name = "inspector_id")
    )
    @Column(name = "specialization")
    private List<String> specializations;


    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference
    private User user;

    @ManyToOne
    @JoinColumn(name = "center_id", nullable = false)
    private InspectionCenter inspectionCenter;

    //booking relate na

    @OneToMany(mappedBy = "inspector")
    private List<Booking> bookings; // ✅ All bookings assigned to this inspector
}
