package lk.ijse.autocert.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String password; // Will be encrypted
    private String phone;
    private String profileImageUrl; // URL to image (readable by frontend)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Role role = Role.CUSTOMER; // ✅ Default set here; // e.g., ADMIN, CUSTOMER, INSPECTOR.

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonManagedReference
    private InspectorProfile inspectorProfile; // if role=INSPECTOR

    // Relationships
    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Vehicle> vehicles;

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Booking> bookings;

    @OneToMany(mappedBy = "inspector", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Inspection> inspections;

    @OneToMany(mappedBy = "payer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Payment> payments;

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Document> documents;
}
