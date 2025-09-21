package lk.ijse.autocert.service.impl;

import lk.ijse.autocert.dto.CenterDTO;
import lk.ijse.autocert.dto.InspectionCenterDTO;
import lk.ijse.autocert.entity.InspectionCenter;
import lk.ijse.autocert.repository.InspectionCenterRepository;
import lk.ijse.autocert.service.InspectionCenterService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InspectionCenterServiceImpl implements InspectionCenterService {
    private final InspectionCenterRepository inspectionCenterRepository;
    private final ModelMapper modelMapper;


    @Override
    public InspectionCenterDTO saveCenter(InspectionCenterDTO dto) {
        InspectionCenter center = new InspectionCenter();
        center.setName(dto.getName());
        center.setAddress(dto.getAddress());
        center.setContactNumber(dto.getContactNumber());

        // Parse openTime and closeTime from String to LocalTime
        if (dto.getOpenTime() != null && !dto.getOpenTime().isEmpty()) {
            center.setOpenTime(LocalTime.parse(dto.getOpenTime()));
        }
        if (dto.getCloseTime() != null && !dto.getCloseTime().isEmpty()) {
            center.setCloseTime(LocalTime.parse(dto.getCloseTime()));
        }

        InspectionCenter saved = inspectionCenterRepository.save(center);

        // Manually map back to DTO
        InspectionCenterDTO response = new InspectionCenterDTO();
        response.setId(saved.getId());
        response.setName(saved.getName());
        response.setAddress(saved.getAddress());
        response.setContactNumber(saved.getContactNumber());
        response.setOpenTime(saved.getOpenTime() != null ? saved.getOpenTime().toString() : null);
        response.setCloseTime(saved.getCloseTime() != null ? saved.getCloseTime().toString() : null);

        return response;
    }


    @Override
    public List<InspectionCenterDTO> getAllCenters() {
        return inspectionCenterRepository.findAll()
                .stream()
                .map(center -> {
                    InspectionCenterDTO dto = new InspectionCenterDTO();
                    dto.setId(center.getId());
                    dto.setName(center.getName());
                    dto.setAddress(center.getAddress());
                    dto.setContactNumber(center.getContactNumber());
                    dto.setOpenTime(center.getOpenTime() != null ? center.getOpenTime().toString() : null);
                    dto.setCloseTime(center.getCloseTime() != null ? center.getCloseTime().toString() : null);
                    return dto;
                })
                .collect(Collectors.toList());
    }


    @Override
    public InspectionCenterDTO getCenterByName(String name) {
        InspectionCenter center = inspectionCenterRepository.findByName(name)
                .orElseThrow(() -> new RuntimeException("Center not found with name: " + name));
        return modelMapper.map(center, InspectionCenterDTO.class);
    }

    @Override
    public InspectionCenterDTO getCenterById(Long id) {
        InspectionCenter center = inspectionCenterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Center not found with ID: " + id));
        return modelMapper.map(center, InspectionCenterDTO.class);
    }

    @Override
    public List<CenterDTO> getAllCenterNames() {
        return inspectionCenterRepository.findAll()
                .stream()
                .map(center -> new CenterDTO(center.getId(), center.getName()))
                .collect(Collectors.toList());
    }
}
