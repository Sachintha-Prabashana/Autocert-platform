package lk.ijse.autocert.repository;

import lk.ijse.autocert.entity.InspectionCenter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InspectionCenterRepository extends JpaRepository<InspectionCenter,Long> {
    Optional<InspectionCenter> findByName(String name);

    @Query("SELECT c.name FROM InspectionCenter c")
    List<String> findAllCenterNames();

}
