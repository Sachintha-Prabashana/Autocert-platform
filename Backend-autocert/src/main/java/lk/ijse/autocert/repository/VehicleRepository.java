package lk.ijse.autocert.repository;

import lk.ijse.autocert.entity.Vehicle;
import lk.ijse.autocert.entity.VehicleStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    List<Vehicle> findByOwnerId(Long ownerId);


    List<Vehicle> findByStatus(VehicleStatus status);
}
