package lk.ijse.autocert.controller;

import lk.ijse.autocert.entity.TimeSlot;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/timeslots")
@RequiredArgsConstructor
public class TimeSlotController {

    @GetMapping
    public ResponseEntity<List<String>> getAllTimeSlots() {
        List<String> slots = Arrays.stream(TimeSlot.values())
                .map(TimeSlot::getLabel)
                .toList();
        return ResponseEntity.ok(slots);
    }
}
