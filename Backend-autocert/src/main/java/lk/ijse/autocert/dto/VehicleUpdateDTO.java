package lk.ijse.autocert.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VehicleUpdateDTO {
    private String brand;
    private String model;
    private int year;
    private int mileage;
    private String description;
    private double price;   // ✅ new field
    private String contactPhone;
}
