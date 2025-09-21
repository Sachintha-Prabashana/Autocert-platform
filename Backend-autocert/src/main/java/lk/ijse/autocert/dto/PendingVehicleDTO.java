package lk.ijse.autocert.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PendingVehicleDTO {
    private Long id;                 // Vehicle ID
    private String make;             // Vehicle make
    private String model;            // Vehicle model
    private int year;                // Vehicle year
    private List<String> images;     // URLs or paths of uploaded images
    private String postedBy;         // Name or email of the user who posted
    private double price;            // Vehicle price
    private LocalDateTime postedDate; // Date when vehicle was posted
}