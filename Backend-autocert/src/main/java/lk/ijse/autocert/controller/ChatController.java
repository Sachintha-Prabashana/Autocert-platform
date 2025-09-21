package lk.ijse.autocert.controller;

import lk.ijse.autocert.dto.ChatMessageDTO;
import lk.ijse.autocert.service.impl.ChatMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatRestController {

    private final ChatMessageService chatMessageService;

    // Get chat history for a vehicle between buyer & seller
    @GetMapping("/{vehicleId}/{userId}/{otherUserId}")
    public ResponseEntity<List<ChatMessageDTO>> getMessages(
            @PathVariable Long vehicleId,
            @PathVariable Long userId,
            @PathVariable Long otherUserId
    ) {
        List<ChatMessageDTO> conversation =
                chatMessageService.getConversation(vehicleId, userId, otherUserId);
        return ResponseEntity.ok(conversation);
    }
}
