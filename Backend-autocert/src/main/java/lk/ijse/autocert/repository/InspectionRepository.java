package lk.ijse.autocert.repository;

import lk.ijse.autocert.dto.InspectionHistoryDTO;
import lk.ijse.autocert.entity.Inspection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InspectionRepository extends JpaRepository<Inspection,Long> {

    @Query("""
        SELECT new lk.ijse.autocert.dto.InspectionHistoryDTO(
            i.id,
            CONCAT(u.firstName, ' ', u.lastName),
            v.brand,
            v.model,
            v.year,
            i.type,
            i.inspectionDate,
            i.result
        )
        FROM Inspection i
        JOIN i.booking b
        JOIN b.customer u
        JOIN b.bookingVehicle v
        WHERE i.result IS NOT NULL
        """)
    List<InspectionHistoryDTO> findAllCompletedInspections();

}
