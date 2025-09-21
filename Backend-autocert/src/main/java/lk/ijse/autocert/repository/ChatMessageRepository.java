package lk.ijse.autocert.repository;

import lk.ijse.autocert.dto.ChatMessageDTO;
import lk.ijse.autocert.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    // Get conversations for a user
    @Query("SELECT new lk.ijse.autocert.dto.ChatMessageDTO(" +
            "cm.vehicleId, " +
            "CASE WHEN cm.senderId = :userId THEN cm.receiverId ELSE cm.senderId END, " +
            "CONCAT(v.year, ' ', v.make, ' ', v.model), " +
            "CASE WHEN cm.senderId = :userId THEN CONCAT(u2.firstName, ' ', u2.lastName) ELSE CONCAT(u1.firstName, ' ', u1.lastName) END, " +
            "cm.content, " +
            "cm.timestamp, " +
            "SUM(CASE WHEN cm.receiverId = :userId AND cm.isRead = false THEN 1 ELSE 0 END)) " +
            "FROM ChatMessage cm " +
            "LEFT JOIN Vehicle v ON cm.vehicleId = v.id " +
            "LEFT JOIN User u1 ON cm.senderId = u1.id " +
            "LEFT JOIN User u2 ON cm.receiverId = u2.id " +
            "WHERE cm.senderId = :userId OR cm.receiverId = :userId " +
            "GROUP BY cm.vehicleId, " +
            "CASE WHEN cm.senderId = :userId THEN cm.receiverId ELSE cm.senderId END, " +
            "v.year, v.make, v.model, " +
            "CASE WHEN cm.senderId = :userId THEN CONCAT(u2.firstName, ' ', u2.lastName) ELSE CONCAT(u1.firstName, ' ', u1.lastName) END, " +
            "cm.content, " +
            "cm.timestamp " +
            "ORDER BY cm.timestamp DESC")
    List<ChatMessageDTO> findConversationsByUserId(@Param("userId") Long userId);


    // Get messages between two users for a specific vehicle
    @Query("SELECT cm FROM ChatMessage cm " +
            "WHERE cm.vehicleId = :vehicleId " +
            "AND ((cm.senderId = :userId1 AND cm.receiverId = :userId2) OR (cm.senderId = :userId2 AND cm.receiverId = :userId1)) " +
            "ORDER BY cm.timestamp ASC")
    List<ChatMessage> findMessages(@Param("vehicleId") Long vehicleId,
                                   @Param("userId1") Long userId1,
                                   @Param("userId2") Long userId2);

    // Count unread messages for a user
    @Query("SELECT COUNT(cm) FROM ChatMessage cm WHERE cm.receiverId = :userId AND cm.isRead = false")
    Long countUnreadMessages(@Param("userId") Long userId);

    // Mark messages as read
    @Modifying
    @Query("UPDATE ChatMessage cm SET cm.isRead = true " +
            "WHERE cm.receiverId = :userId AND cm.senderId = :senderId AND cm.vehicleId = :vehicleId")
    void markMessagesAsRead(@Param("userId") Long userId,
                            @Param("senderId") Long senderId,
                            @Param("vehicleId") Long vehicleId);

}
