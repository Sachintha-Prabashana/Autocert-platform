package lk.ijse.autocert.dto;

import lk.ijse.autocert.entity.InspectionType;
import lk.ijse.autocert.entity.TimeSlot;
import lk.ijse.autocert.entity.ServiceType;
import lombok.Data;

import java.time.LocalDate;

@Data
public class BookingRequestDTO {

    // ================= VEHICLE DETAILS =================
    private String brand;
    private String model;
    private int year;
    private String description;
    private Integer mileage;

    // ================= BOOKING DETAILS =================
    private String centerName;              // Selected center (dropdown in HTML)
    private LocalDate appointmentDate;      // yyyy-MM-dd
    private TimeSlot timeSlot;
    private InspectionType inspectionType;  // ENUM: SAFETY, COMPREHENSIVE, PRE_PURCHASE
    private ServiceType serviceType;        // ENUM: MOBILE, FACILITY

    // ================= ADDRESS (only if MOBILE) =================
    private String streetAddress;
    private String streetAddressLine2;
    private String city;
    private String stateProvince;
    private String postalCode;
}
