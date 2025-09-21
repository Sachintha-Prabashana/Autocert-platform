package lk.ijse.autocert.dto;

import lk.ijse.autocert.entity.MessageStatus;
import lombok.*;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatMessageDTO {
    private Long vehicleId;
    private Long otherUserId;
    private String vehicleTitle;
    private String otherUserName;
    private String lastMessage;
    private LocalDateTime lastTimestamp;
    private Long unreadCount;
}
