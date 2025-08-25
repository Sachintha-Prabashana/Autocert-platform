package lk.ijse.autocert.entity;

import lombok.Getter;

@Getter
public enum InspectionType {
    BASIC(5000.00),
    COMPREHENSIVE(10000.00),
    PRE_PURCHASE(7500.00);

    private final double price;

    InspectionType(double price) {
        this.price = price;
    }

}
