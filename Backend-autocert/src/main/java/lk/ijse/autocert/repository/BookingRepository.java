package lk.ijse.autocert.repository;

import jakarta.persistence.LockModeType;
import lk.ijse.autocert.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
//     Count how many bookings exist for a specific center, date, and time slot
//    long countByAppointmentDateAndTimeSlotAndInspectionCenter(
//            LocalDate appointmentDate,
//            TimeSlot timeSlot,
//            InspectionCenter inspectionCenter
//    );

    long countByAppointmentDateAndTimeSlotAndInspectionCenter(LocalDate date, TimeSlot slot, InspectionCenter center);

    long countByInspectorAndStatus(InspectorProfile inspector, BookingStatus status);

    List<Booking> findByStatus(BookingStatus status);

    List<Booking> findByInspector(User inspector);
    List<Booking> findByInspector_User(User inspectorUser);

    @Query("SELECT b FROM Booking b WHERE DATE(b.appointmentDate) = CURRENT_DATE")
    List<Booking> findTodayBookings();

    @Query("SELECT b FROM Booking b " +
            "JOIN FETCH b.customer c " +
            "JOIN FETCH b.bookingVehicle v " +
            "LEFT JOIN FETCH b.inspector i " +
            "LEFT JOIN FETCH i.user iu " +
            "LEFT JOIN FETCH b.inspectionCenter ic")
    List<Booking> findAllWithDetails();


    @Query("SELECT COUNT(b) FROM Booking b " +
            "WHERE b.inspector = :inspector " +
            "AND b.appointmentDate = :date")
    int countByInspectorAndDate(@Param("inspector") InspectorProfile inspector,
                                @Param("date") LocalDate date);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.inspector = :inspector AND b.appointmentDate = :date")
    long countByInspectorAndAppointmentDate(@Param("inspector") InspectorProfile inspector, @Param("date") LocalDate date);



}
