package lk.ijse.autocert.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BookingVehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String brand;
    private String model;
    private int year;
    private String description;

    @OneToOne(mappedBy = "bookingVehicle", cascade = CascadeType.ALL)
    private Booking booking;

    @OneToOne(mappedBy = "bookingVehicle", cascade = CascadeType.ALL)
    private Inspection inspection;   // <-- Link back
}
