package lk.ijse.autocert.controller;

import lk.ijse.autocert.dto.ChatMessageDTO;
import lk.ijse.autocert.entity.ChatMessage;
import lk.ijse.autocert.service.UserService;
import lk.ijse.autocert.service.impl.ChatMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatMessageService chatService;
    private final UserService userService;

    /**
     * Get all conversations for the logged-in user
     */
    @GetMapping("/conversations")
    public ResponseEntity<List<ChatMessageDTO>> getConversations(
            @AuthenticationPrincipal User principal) {
        try {
            String email = principal.getUsername(); // logged-in email/username
            Long userId = userService.findUserIdByEmail(email);

            List<ChatMessageDTO> conversations = chatService.getConversations(userId);
            return ResponseEntity.ok(conversations);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get all messages between the logged-in user and another user for a specific vehicle
     */
    @GetMapping("/messages/{vehicleId}/{otherUserId}")
    public ResponseEntity<List<ChatMessage>> getMessages(
            @PathVariable Long vehicleId,
            @PathVariable Long otherUserId,
            @AuthenticationPrincipal User principal) {
        try {
            Long userId = userService.findUserIdByEmail(principal.getUsername());
            List<ChatMessage> messages = chatService.getMessages(vehicleId, userId, otherUserId);
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Send a text message
     */
    @PostMapping("/send")
    public ResponseEntity<ChatMessage> sendMessage(
            @RequestBody ChatMessage message,
            @AuthenticationPrincipal User principal) {
        try {
            Long userId = userService.findUserIdByEmail(principal.getUsername());
            message.setSenderId(userId);
            ChatMessage savedMessage = chatService.sendMessage(message);
            return ResponseEntity.ok(savedMessage);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Send an image message
     */
    @PostMapping("/send-image")
    public ResponseEntity<?> sendImage(
            @RequestParam("vehicleId") Long vehicleId,
            @RequestParam("receiverId") Long receiverId,
            @RequestParam(value = "content", required = false) String content,
            @RequestParam("image") MultipartFile image,
            @AuthenticationPrincipal User principal) {
        try {
            Long senderId = userService.findUserIdByEmail(principal.getUsername());
            chatService.handleImageUpload(image, vehicleId, senderId, receiverId, content);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get unread message count for the logged-in user
     */
    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadCount(@AuthenticationPrincipal User principal) {
        try {
            Long userId = userService.findUserIdByEmail(principal.getUsername());
            Long count = chatService.getUnreadMessageCount(userId);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
