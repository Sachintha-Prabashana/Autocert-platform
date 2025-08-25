package lk.ijse.autocert.repository;

import lk.ijse.autocert.entity.Document;
import lk.ijse.autocert.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findAllByOwnerIdAndIsVisibleToInspectorTrue(Long ownerId);
    List<Document> findByOwner(User owner);
}
