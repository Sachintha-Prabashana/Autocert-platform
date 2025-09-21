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
    private Integer mileage; // <-- added from DTO

    @OneToOne(mappedBy = "bookingVehicle", cascade = CascadeType.ALL)
    private Booking booking;



}
