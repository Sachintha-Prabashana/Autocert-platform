package lk.ijse.autocert.service;

import lk.ijse.autocert.dto.CenterDTO;
import lk.ijse.autocert.dto.InspectionCenterDTO;
import lk.ijse.autocert.entity.InspectionCenter;

import java.util.List;

public interface InspectionCenterService {
    InspectionCenterDTO saveCenter(InspectionCenterDTO dto);
    List<InspectionCenterDTO> getAllCenters();
    InspectionCenterDTO getCenterByName(String name);
    InspectionCenterDTO getCenterById(Long id);

    List<CenterDTO> getAllCenterNames();
}
