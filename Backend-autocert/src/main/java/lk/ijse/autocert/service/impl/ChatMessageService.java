package lk.ijse.autocert.service.impl;

import lk.ijse.autocert.dto.ChatMessageDTO;
import lk.ijse.autocert.entity.ChatMessage;
import lk.ijse.autocert.entity.MessageStatus;
import lk.ijse.autocert.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;
    private final SimpMessagingTemplate messagingTemplate;

    // ---------------- CONVERSATIONS ----------------
    public List<ChatMessageDTO> getConversations(Long userId) {
        return chatMessageRepository.findConversationsByUserId(userId);
    }

    @Transactional
    public List<ChatMessage> getMessages(Long vehicleId, Long userId1, Long userId2) {
        if (vehicleId == null || userId1 == null || userId2 == null) {
            return List.of(); // avoid null pointer exception
        }

        List<ChatMessage> messages = chatMessageRepository.findMessages(vehicleId, userId1, userId2);

        if (!messages.isEmpty()) {
            // Only mark messages as read if there are unread messages
            chatMessageRepository.markMessagesAsRead(userId1, userId2, vehicleId);
        }

        return messages;
    }

    // ---------------- SEND MESSAGE ----------------
    public ChatMessage sendMessage(ChatMessage message) {
        message.setTimestamp(LocalDateTime.now());
        message.setIsRead(false);

        ChatMessage savedMessage = chatMessageRepository.save(message);

        // Notify recipient via WebSocket
        messagingTemplate.convertAndSendToUser(
                message.getReceiverId().toString(),
                "/queue/messages",
                savedMessage
        );

        return savedMessage;
    }

    // ---------------- SEND IMAGE ----------------
    public void handleImageUpload(MultipartFile image, Long vehicleId, Long senderId, Long receiverId, String content) {
        try {
            String imageUrl = uploadImageToStorage(image);

            ChatMessage message = new ChatMessage();
            message.setVehicleId(vehicleId);
            message.setSenderId(senderId);
            message.setReceiverId(receiverId);
            message.setContent(content);
            message.setImageUrl(imageUrl);
            message.setTimestamp(LocalDateTime.now());
            message.setIsRead(false);

            ChatMessage savedMessage = chatMessageRepository.save(message);

            // Notify recipient via WebSocket
            messagingTemplate.convertAndSendToUser(
                    receiverId.toString(),
                    "/queue/messages",
                    savedMessage
            );

        } catch (IOException e) {
            throw new RuntimeException("Failed to upload image", e);
        }
    }

    private String uploadImageToStorage(MultipartFile image) throws IOException {
        String fileName = UUID.randomUUID() + "_" + image.getOriginalFilename();
        Path uploadPath = Paths.get("uploads/chat-images");
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return "/uploads/chat-images/" + fileName;
    }

    // ---------------- UNREAD COUNT ----------------
    public Long getUnreadMessageCount(Long userId) {
        return chatMessageRepository.countUnreadMessages(userId);
    }
}
