package lk.ijse.autocert.repository;

import lk.ijse.autocert.entity.InspectorProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InspectorProfileRepository extends JpaRepository<InspectorProfile,Long> {
}
