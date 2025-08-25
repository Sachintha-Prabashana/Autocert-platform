package lk.ijse.autocert.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Vehicle {
/*
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;       // For sale/inspection listing
    private String brand;
    private String model;
    private int year;
    private double price;       // Only relevant for SALE
    private String description;
    private LocalDate listedDate;

    @Enumerated(EnumType.STRING)
    private VehiclePurpose purpose; // SALE or INSPECTION

    @Enumerated(EnumType.STRING)
    private VehicleStatus status;   // PENDING_INSPECTION, APPROVED, SOLD...

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    @OneToMany(mappedBy = "vehicle", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<VehicleFile> files;

    @OneToMany(mappedBy = "vehicle", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Booking> bookings;

    @OneToMany(mappedBy = "vehicle", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Inspection> inspections;

    @OneToMany(mappedBy = "vehicle", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Payment> payments;*/

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;       // For sale listing
    private String brand;
    private String model;
    private int year;
    private double price;       // Relevant only for SALE
    private String description;
    private LocalDate listedDate;

    @Enumerated(EnumType.STRING)
    private VehiclePurpose purpose; // SALE only here

    @Enumerated(EnumType.STRING)
    private VehicleStatus status;   // AVAILABLE, SOLD, etc.

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    @OneToMany(mappedBy = "vehicle", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<VehicleFile> files;
}
