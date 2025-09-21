package lk.ijse.autocert.dto;

import lk.ijse.autocert.entity.*;
import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VehicleRequestDTO {
//    private Long ownerId;

    // Step 1: Location
    private String province;
    private String district;
    private String city;

    // Step 2: Basic Info
    private String make;
    private String model;
    private int year;
    private int mileage;
    private ConditionType condition;
    private BodyType bodyType;

    // Step 3: Technical Details
    private String engine;
    private TransmissionType transmission;
    private FuelType fuelType;
    private String color;

    // Step 4: Features
    private List<String> features;

    // Step 5: Photos
    private List<String> photos;

    // Step 6: Contact & Price
    private double price;
    private boolean negotiable;
    private String contactName;
    private String contactPhone;

    private String description;
}
