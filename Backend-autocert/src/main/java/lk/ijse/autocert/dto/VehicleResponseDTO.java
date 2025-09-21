package lk.ijse.autocert.dto;

import lk.ijse.autocert.entity.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VehicleResponseDTO {

    private Long id;  // vehicle id
    private String province;
    private String district;
    private String city;
    private String make;
    private String model;
    private int year;
    private int mileage;
    private ConditionType condition;
    private BodyType bodyType;
    private String engine;
    private TransmissionType transmission;
    private FuelType fuelType;
    private String color;
    private List<String> features;
    private List<String> photos;
    private double price;
    private boolean negotiable;

    private Long ownerId;
    private String contactName;
    private String contactPhone;


    private String description;
    private VehicleStatus status;

   /* // Owner info
    private Long ownerId;
    private String ownerName;*/

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
