package lk.ijse.autocert.exception;

public class TimeSlotFullException extends RuntimeException {
    public TimeSlotFullException(String message) {
        super(message);
    }
    public TimeSlotFullException() {
        super("Selected time slot is fully booked. Please choose another slot.");
    }
}
