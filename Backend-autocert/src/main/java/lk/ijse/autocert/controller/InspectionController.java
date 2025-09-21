package lk.ijse.autocert.controller;

import lk.ijse.autocert.dto.BookingInspectionDTO;
import lk.ijse.autocert.dto.InspectionHistoryDTO;
import lk.ijse.autocert.service.InspectionService;
import lk.ijse.autocert.service.impl.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/inspections")
public class InspectionController {

    private final BookingService bookingService; // service that has getAllBookingInspections()
     private final InspectionService inspectionService; // service that has getInspectionHistory()


    @GetMapping
    public ResponseEntity<List<BookingInspectionDTO>> getAllInspections() {
        try {
            List<BookingInspectionDTO> inspections = bookingService.getAllBookingInspections();
            return ResponseEntity.ok(inspections);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/history")
    public List<InspectionHistoryDTO> getInspectionHistory() {
        try{
            return inspectionService.getAllCompletedInspections();

        } catch (Exception e){
            throw new RuntimeException("Failed to fetch inspection history", e);
        }
    }
}