package lk.ijse.autocert.service.impl;

import jakarta.persistence.EntityNotFoundException;
import lk.ijse.autocert.dto.*;
import lk.ijse.autocert.entity.User;
import lk.ijse.autocert.entity.Vehicle;
import lk.ijse.autocert.entity.VehicleStatus;
import lk.ijse.autocert.repository.UserRepository;
import lk.ijse.autocert.repository.VehicleRepository;
import lk.ijse.autocert.service.VehicleService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    @Override
    @Transactional
    public VehicleResponseDTO saveVehicle(VehicleRequestDTO dto, Long sellerId) {
        User seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new EntityNotFoundException("Seller not found"));


        Vehicle vehicle = Vehicle.builder()
                .province(dto.getProvince())
                .district(dto.getDistrict())
                .city(dto.getCity())
                .make(dto.getMake())
                .model(dto.getModel())
                .year(dto.getYear())
                .mileage(dto.getMileage())
                .vehicleCondition(dto.getCondition())
                .bodyType(dto.getBodyType())
                .engine(dto.getEngine())
                .transmission(dto.getTransmission())
                .fuelType(dto.getFuelType())
                .color(dto.getColor())
                .features(dto.getFeatures())
                .photos(dto.getPhotos())
                .price(dto.getPrice())
                .negotiable(dto.isNegotiable())
                .contactName(dto.getContactName())
                .contactPhone(dto.getContactPhone())
                .description(dto.getDescription())
                .status(VehicleStatus.PENDING_APPROVAL)
                .owner(seller)
                .build();

        Vehicle savedVehicle = vehicleRepository.save(vehicle);
        return modelMapper.map(savedVehicle, VehicleResponseDTO.class);
    }
    @Override
    public VehicleResponseDTO approveVehicle(Long vehicleId) {
        Vehicle vehicle = getVehicle(vehicleId);

        // ✅ Only allow approving vehicles that are still pending
        if (!vehicle.getStatus().equals(VehicleStatus.PENDING_APPROVAL)) {
            throw new IllegalStateException("Only vehicles with PENDING_APPROVAL status can be approved.");
        }

        vehicle.setStatus(VehicleStatus.APPROVED);
        vehicle.setUpdatedAt(LocalDateTime.now());

        return modelMapper.map(vehicleRepository.save(vehicle), VehicleResponseDTO.class);
    }


    @Override
    public VehicleResponseDTO changeStatus(Long vehicleId, String status) {
        Vehicle vehicle = getVehicle(vehicleId);
        vehicle.setStatus(VehicleStatus.valueOf(status.toUpperCase()));
        vehicle.setUpdatedAt(LocalDateTime.now());
        return modelMapper.map(vehicleRepository.save(vehicle), VehicleResponseDTO.class);
    }

    @Override
    public List<VehicleResponseDTO> getAllPendingVehicles() {
        return vehicleRepository.findByStatus(VehicleStatus.PENDING_APPROVAL)
                .stream()
                .map(vehicle -> modelMapper.map(vehicle, VehicleResponseDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<PendingVehicleDTO> getPendingVehicles() {
        return vehicleRepository.findByStatus(VehicleStatus.PENDING_APPROVAL)
                .stream()
                .map(vehicle -> PendingVehicleDTO.builder()
                        .id(vehicle.getId())
                        .make(vehicle.getMake())
                        .model(vehicle.getModel())
                        .year(vehicle.getYear())
                        .images(vehicle.getPhotos()) // assuming this is a List<String>
                        .price(vehicle.getPrice())
                        .postedDate(vehicle.getCreatedAt()) // or vehicle.getPostedDate()
                        .postedBy(
                                vehicle.getOwner() != null
                                        ? (vehicle.getOwner().getFirstName() + " " + vehicle.getOwner().getLastName())
                                        : "Unknown"
                        )
                        .build()
                )
                .collect(Collectors.toList());
    }

    public VehicleResponseDTO getApprovedVehicleById(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElse(null);

        if (vehicle == null) {
            return null;
        }

        return modelMapper.map(vehicle, VehicleResponseDTO.class);


         // same mapping you use for getAllApprovedVehicles()
//        return mapToResponseDTO(vehicle);
    }

    @Override
    public List<MyListingDTO> getUserVehicles(Long userId) {
        return vehicleRepository.findByOwnerId(userId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    @Override
    public List<VehicleResponseDTO> getAllApprovedVehicles() {
        return vehicleRepository.findByStatus(VehicleStatus.APPROVED)
                .stream()
                .map(vehicle -> VehicleResponseDTO.builder()
                        .id(vehicle.getId())
                        .province(vehicle.getProvince())
                        .district(vehicle.getDistrict())
                        .city(vehicle.getCity())
                        .make(vehicle.getMake())
                        .model(vehicle.getModel())
                        .year(vehicle.getYear())
                        .mileage(vehicle.getMileage())
                        .condition(vehicle.getVehicleCondition())
                        .bodyType(vehicle.getBodyType())
                        .engine(vehicle.getEngine())
                        .transmission(vehicle.getTransmission())
                        .fuelType(vehicle.getFuelType())
                        .color(vehicle.getColor())
                        .features(vehicle.getFeatures())   // assuming it's already List<String>
                        .photos(vehicle.getPhotos())       // assuming it's already List<String>
                        .price(vehicle.getPrice())
                        .negotiable(vehicle.isNegotiable())
                        .contactName(vehicle.getContactName())
                        .contactPhone(vehicle.getContactPhone())
                        .description(vehicle.getDescription())
                        .status(vehicle.getStatus())
                        .createdAt(vehicle.getCreatedAt())
                        .updatedAt(vehicle.getUpdatedAt())
                        .build())
                .collect(Collectors.toList());
    }


    @Override
    public List<VehicleResponseDTO> getAllVehiclesByOwner(Long ownerId) {
        return vehicleRepository.findByOwnerId(ownerId)
                .stream()
                .map(vehicle -> modelMapper.map(vehicle, VehicleResponseDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public VehicleResponseDTO getVehicleById(Long id) {
        return modelMapper.map(getVehicle(id), VehicleResponseDTO.class);
    }

    @Override
    public VehicleResponseDTO rejectVehicle(Long vehicleId) {
        Vehicle vehicle = getVehicle(vehicleId);
        vehicle.setStatus(VehicleStatus.REJECTED);
        Vehicle updated = vehicleRepository.save(vehicle);
        return modelMapper.map(updated, VehicleResponseDTO.class);
    }

    private Vehicle getVehicle(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Vehicle not found"));
    }

    // Map Vehicle -> MyListingDTO
    private MyListingDTO convertToDTO(Vehicle vehicle) {
        MyListingDTO dto = new MyListingDTO();
        dto.setId(vehicle.getId());
        dto.setMake(vehicle.getMake());
        dto.setModel(vehicle.getModel());
        dto.setYear(vehicle.getYear());
        dto.setPrice(vehicle.getPrice());
        dto.setStatus(vehicle.getStatus());
        dto.setCreatedAt(vehicle.getCreatedAt());
        dto.setImages(vehicle.getPhotos()); // assuming getPhotos() returns List<String>
        return dto;
    }

    @Override
    public boolean deleteUserVehicle(Long vehicleId, Long userId) {
        Optional<Vehicle> vehicleOpt = vehicleRepository.findById(vehicleId);
        if (vehicleOpt.isPresent() && vehicleOpt.get().getOwner().getId().equals(userId)) {
            vehicleRepository.delete(vehicleOpt.get());
            return true;
        }
        return false;
    }

    @Override
    public boolean updateUserVehicle(Long vehicleId, Long userId, VehicleUpdateDTO updateDTO) {
        Optional<Vehicle> vehicleOpt = vehicleRepository.findById(vehicleId);
        Optional<User> userOpt = userRepository.findById(userId);

        if (vehicleOpt.isPresent() && userOpt.isPresent()) {
            Vehicle vehicle = vehicleOpt.get();

            // ✅ Check if the logged-in user is the owner
            if (!vehicle.getOwner().getId().equals(userId)) {
                return false; // Not authorized
            }

            // ✅ Update allowed fields
            vehicle.setMake(updateDTO.getBrand());
            vehicle.setModel(updateDTO.getModel());
            vehicle.setYear(updateDTO.getYear());
            vehicle.setMileage(updateDTO.getMileage());
            vehicle.setDescription(updateDTO.getDescription());
            vehicle.setPrice(updateDTO.getPrice());
            vehicle.setContactPhone(updateDTO.getContactPhone());

            vehicleRepository.save(vehicle);
            return true;
        }
        return false;
    }

    @Override
    public VehicleUpdateDTO getVehicleByIdUpdate(Long vehicleId) {
        Optional<Vehicle> vehicleOpt = vehicleRepository.findById(vehicleId);
        if (vehicleOpt.isEmpty()) {
            return null; // or throw exception
        }
        Vehicle v = vehicleOpt.get();
        return new VehicleUpdateDTO(
                v.getMake(),
                v.getModel(),
                v.getYear(),
                v.getMileage(),
                v.getDescription(),
                v.getPrice(),
                v.getContactPhone()
        );
    }
}
