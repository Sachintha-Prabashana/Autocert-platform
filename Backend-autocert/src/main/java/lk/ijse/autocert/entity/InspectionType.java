package lk.ijse.autocert.entity;

import lombok.Getter;

@Getter
public enum InspectionType {
    SAFETY(5000),
    COMPREHENSIVE(10000),
    PRE_PURCHASE(7500),
    DIAGNOSTIC(6000);

    private final int price;

    InspectionType(int price) {
        this.price = price;
    }

}
