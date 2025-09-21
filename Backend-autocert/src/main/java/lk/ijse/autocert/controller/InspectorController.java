package lk.ijse.autocert.controller;

import lk.ijse.autocert.dto.*;
import lk.ijse.autocert.entity.User;
import lk.ijse.autocert.service.InspectorService;
import lk.ijse.autocert.service.UserService;
import lk.ijse.autocert.service.impl.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/inspectors")
@RequiredArgsConstructor
public class InspectorController {

    private final InspectorService inspectorService;
    private final UserService userService;
    private final BookingService bookingService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<InspectorResponseDTO> addInspector(@RequestBody InspectorRequestDTO dto) {
        return ResponseEntity.ok(inspectorService.addInspector(dto));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<InspectorResponseDTO>> getAllInspectors() {
        List<InspectorResponseDTO> inspectors = inspectorService.getAllInspectors();
        return ResponseEntity.ok(inspectors);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteInspector(@PathVariable Long id) {
        try {
            inspectorService.deleteInspector(id);
            ApiResponse response = new ApiResponse(200, "Inspector deleted successfully", null, "ADMIN");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            ApiResponse response = new ApiResponse(404, e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(500, "Failed to delete inspector", null, "ADMIN");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    @GetMapping("/assignments")
    public List<InspectionAssignmentDTO> getAssignments(@AuthenticationPrincipal org.springframework.security.core.userdetails.User principalUser) {

        // Convert Spring Security user to your User entity
        User inspector = userService.getUserEntityByEmail(principalUser.getUsername());

        return inspectorService.getAssignmentsForInspector(inspector);
    }

    @GetMapping("/workload")
    public ResponseEntity<List<InspectorWorkloadDTO>> getInspectorsWorkload(@RequestParam String date) {
        return ResponseEntity.ok(inspectorService.getInspectorsWithWorkload(date));
    }

    @PostMapping("/{bookingId}/assign-inspector")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> assignInspectorToBooking(
            @PathVariable Long bookingId,
            @RequestBody InspectorAssignmentDTO assignmentDTO) {


            assignmentDTO.setBookingId(bookingId);

            boolean isAssigned = bookingService.assignInspector(assignmentDTO);

            if (isAssigned) {
                return ResponseEntity.ok().body(
                        new ApiResponse(200, "Inspector assigned successfully" , assignmentDTO)
                );
            } else {
                return ResponseEntity.badRequest().body(
                        new ApiResponse(400, "Failed to assign inspector. Inspector might be unavailable.", null)
                );
            }

    }




}
