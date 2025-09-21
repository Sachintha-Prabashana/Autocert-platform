package lk.ijse.autocert.service;

import lk.ijse.autocert.dto.*;
import lk.ijse.autocert.entity.Vehicle;
import lk.ijse.autocert.entity.VehicleStatus;

import java.util.List;
import java.util.stream.Collectors;

public interface VehicleService {
    VehicleResponseDTO saveVehicle(VehicleRequestDTO dto, Long sellerId);
    VehicleResponseDTO approveVehicle(Long vehicleId);
    VehicleResponseDTO changeStatus(Long vehicleId, String status);
    List<VehicleResponseDTO> getAllApprovedVehicles();
    List<VehicleResponseDTO> getAllVehiclesByOwner(Long ownerId);
    VehicleResponseDTO getVehicleById(Long id);
    public VehicleResponseDTO rejectVehicle(Long vehicleId) ;
    public List<VehicleResponseDTO> getAllPendingVehicles() ;

    List<PendingVehicleDTO> getPendingVehicles();

    VehicleResponseDTO getApprovedVehicleById(Long id);

    List<MyListingDTO> getUserVehicles(Long userId);
     boolean deleteUserVehicle(Long vehicleId, Long userId) ;

    boolean updateUserVehicle(Long vehicleId, Long userId, VehicleUpdateDTO updateDTO);

    VehicleUpdateDTO getVehicleByIdUpdate(Long vehicleId);
}
