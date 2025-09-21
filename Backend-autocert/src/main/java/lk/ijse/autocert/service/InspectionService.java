package lk.ijse.autocert.service;

import lk.ijse.autocert.dto.InspectionDTO;
import lk.ijse.autocert.dto.InspectionHistoryDTO;

import java.util.List;

public interface InspectionService {
    boolean saveInspectionAndSendEmail(String loggedInUser, InspectionDTO dto) throws Exception ;
    List<InspectionHistoryDTO> getAllCompletedInspections();

}

