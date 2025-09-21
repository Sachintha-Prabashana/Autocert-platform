package lk.ijse.autocert.dto;

import lk.ijse.autocert.entity.VehicleStatus;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class MyListingDTO {
    private Long id;
    private String make;
    private String model;
    private int year;
    private double price;
    private VehicleStatus status;   // APPROVED, PENDING, REJECTED, SOLD
    private LocalDateTime createdAt;
    private List<String> images;     // URLs or paths of uploaded images
}
