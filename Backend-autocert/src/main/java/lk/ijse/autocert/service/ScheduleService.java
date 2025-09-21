package lk.ijse.autocert.service;

import lk.ijse.autocert.dto.TodayScheduleDTO;

import java.util.List;

public interface ScheduleService {
    List<TodayScheduleDTO> getTodaySchedule() ;
}
