package lk.ijse.autocert.service.impl;

import lk.ijse.autocert.dto.ChatContactDTO;
import lk.ijse.autocert.repository.UserRepository;
import lk.ijse.autocert.util.OnlineUserTracker;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl {
    private final UserRepository userRepository;
    private final OnlineUserTracker onlineUserTracker;

    public List<ChatContactDTO> getAllUsersExcluding(String currentEmail) {
        return userRepository.findAll().stream()
                .filter(u -> !u.getEmail().equals(currentEmail)) // exclude logged-in user
                .filter(u -> u.getRole().equals(("CUSTOMER"))) // only customers
                .map(u -> new ChatContactDTO(
                        u.getId(),
                        u.getFirstName() + " " + u.getLastName(),
                        u.getRole(),
                        onlineUserTracker.isOnline(u.getEmail()) // online status
                ))
                .toList();
    }
}
