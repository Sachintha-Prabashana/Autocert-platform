package lk.ijse.autocert.repository;

import lk.ijse.autocert.entity.BookingVehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BookingVehicleRepository extends JpaRepository<BookingVehicle, Long> {
}
