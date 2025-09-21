package lk.ijse.autocert.repository;

import lk.ijse.autocert.entity.Role;
import lk.ijse.autocert.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;


import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    @Query("SELECT u FROM User u JOIN u.inspectorProfile ip " +
            "WHERE u.role = 'INSPECTOR' AND ip.inspectionCenter.id = :centerId")
    List<User> findInspectorsByCenter(Long centerId);

    List<User> findByRole(Role role);
    List<User> findByRoleIn(List<Role> roles);

}
