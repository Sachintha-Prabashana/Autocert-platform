package lk.ijse.autocert.entity;

import lombok.Getter;

@Getter
public enum TimeSlot {
    NINE_AM("09:00 AM"),
    TEN_THIRTY_AM("10:30 AM"),
    TWELVE_PM("12:00 PM"),
    THREE_PM("03:00 PM"),
    FOUR_THIRTY_PM("04:30 PM");

    private final String label;

    TimeSlot(String label) {
        this.label = label;
    }

    // Convert string label to enum
    public static TimeSlot fromLabel(String label) {
        for (TimeSlot ts : values()) {
            if (ts.label.equals(label)) {
                return ts;
            }
        }
        throw new IllegalArgumentException("Invalid time slot: " + label);
    }
}
