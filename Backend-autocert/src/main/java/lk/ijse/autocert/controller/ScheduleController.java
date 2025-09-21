package lk.ijse.autocert.controller;

import lk.ijse.autocert.dto.TodayScheduleDTO;
import lk.ijse.autocert.service.ScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/inspector/schedule")
@RequiredArgsConstructor
public class ScheduleController {

    private final ScheduleService scheduleService;

    @GetMapping("/today")
    public ResponseEntity<List<TodayScheduleDTO>> getTodaySchedule() {
        return ResponseEntity.ok(scheduleService.getTodaySchedule());
    }
}
