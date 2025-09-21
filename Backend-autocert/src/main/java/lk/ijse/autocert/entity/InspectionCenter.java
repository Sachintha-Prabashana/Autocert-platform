package lk.ijse.autocert.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalTime;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InspectionCenter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String address;
    private String contactNumber;

    private LocalTime openTime;
    private LocalTime closeTime;

    // One center has multiple inspectors
    @OneToMany(mappedBy = "inspectionCenter", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<InspectorProfile> inspectors;

    //booking ek relate kre na

    @OneToMany(mappedBy = "inspectionCenter")
    private List<Booking> bookings;  // ✅ All bookings made for this center
}
