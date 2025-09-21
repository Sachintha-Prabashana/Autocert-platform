package lk.ijse.autocert.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "vehicles")

public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Step 1: Location
    private String province;
    private String district;
    private String city;

    // Step 2: Basic Info
    private String make;
    private String model;
    private int year;
    private int mileage;

    @Enumerated(EnumType.STRING)
    private ConditionType vehicleCondition; // e.g., Excellent, Good
    @Enumerated(EnumType.STRING)
    private BodyType bodyType;  // Sedan, SUV, etc.

    // Step 3: Technical Details
    private String engine;
    @Enumerated(EnumType.STRING)
    private TransmissionType transmission; // Manual, Automatic, CVT
    @Enumerated(EnumType.STRING)
    private FuelType fuelType; // Petrol, Diesel, Electric, Hybrid
    private String color;

    // Step 4: Features
    @ElementCollection
    @CollectionTable(name = "vehicle_features", joinColumns = @JoinColumn(name = "vehicle_id"))
    @Column(name = "feature")
    private List<String> features;

    // Step 5: Photos
    @ElementCollection
    @CollectionTable(name = "vehicle_photos", joinColumns = @JoinColumn(name = "vehicle_id"))
    @Column(name = "photo_url")
    private List<String> photos; // Store URLs or filenames

    // Step 6: Contact & Price
    private double price;
    private boolean negotiable;
    private String contactName;
    private String contactPhone;

    @Column(length = 2000)
    private String description;

    // Optional: Status of listing
    @Enumerated(EnumType.STRING)
    private VehicleStatus status; // Pending, Approved, Rejected

    // Seller (User who listed the vehicle)
    @ManyToOne
    @JoinColumn(name = "seller_id", nullable = false)
    private User owner;

    // Timestamps
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = createdAt;
        if (status == null) {
            status = VehicleStatus.PENDING_APPROVAL;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
