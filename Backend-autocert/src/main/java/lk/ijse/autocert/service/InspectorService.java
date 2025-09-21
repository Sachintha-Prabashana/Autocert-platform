package lk.ijse.autocert.service;

import lk.ijse.autocert.dto.InspectionAssignmentDTO;
import lk.ijse.autocert.dto.InspectorRequestDTO;
import lk.ijse.autocert.dto.InspectorResponseDTO;
import lk.ijse.autocert.dto.InspectorWorkloadDTO;
import lk.ijse.autocert.entity.User;

import java.util.List;

public interface InspectorService {
    InspectorResponseDTO addInspector(InspectorRequestDTO dto);
    List<InspectorResponseDTO> getAllInspectors();

    void deleteInspector(Long id);

    List<InspectionAssignmentDTO> getAssignmentsForInspector(User inspector);

    List<InspectorWorkloadDTO> getInspectorsWithWorkload(String date);

}
