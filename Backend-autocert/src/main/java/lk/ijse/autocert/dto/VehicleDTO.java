package lk.ijse.autocert.dto;

import lombok.Data;

@Data
public class VehicleDTO {
    private String title;
    private String brand;
    private String model;
    private int year;
    private double price;
    private String description;
}
