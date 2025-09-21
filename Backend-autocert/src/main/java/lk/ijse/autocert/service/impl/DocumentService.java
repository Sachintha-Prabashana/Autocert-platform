package lk.ijse.autocert.service;

import lk.ijse.autocert.dto.DocumentDTO;
import lk.ijse.autocert.entity.Document;
import lk.ijse.autocert.entity.DocumentType;
import lk.ijse.autocert.entity.User;
import lk.ijse.autocert.repository.DocumentRepository;
import lk.ijse.autocert.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DocumentService {

    private final ImgbbService imgbbService;
    private final DocumentRepository documentRepo;
    private final UserRepository userRepo;
    private final ModelMapper modelMapper;

    /**
     * Upload a document to Imgbb and save it in the DB
     */
    public DocumentDTO uploadToImgBB(Long ownerId, DocumentType type, MultipartFile file)
            throws IOException, InterruptedException {

        // Fetch user
        User owner = userRepo.findById(ownerId)
                .orElseThrow(() -> new IllegalArgumentException("Owner not found"));

        // Upload to Imgbb
        String url = imgbbService.uploadFile(file);

        // Save document
        Document doc = Document.builder()
                .documentType(type)
                .originalFilename(file.getOriginalFilename())
                .contentType(file.getContentType())
                .sizeBytes(file.getSize())
                .fileUrl(url)
                .owner(owner)
                .build();

        documentRepo.save(doc);

        // Map entity to DTO using ModelMapper
        return modelMapper.map(doc, DocumentDTO.class);
    }

    /**
     * Fetch all documents by owner
     */
    public List<DocumentDTO> getDocumentsByOwner(Long ownerId) {
        User owner = userRepo.findById(ownerId)
                .orElseThrow(() -> new IllegalArgumentException("Owner not found"));

        List<Document> documents = documentRepo.findByOwner(owner);

        // Map list of entities to list of DTOs using ModelMapper
        return documents.stream()
                .map(doc -> modelMapper.map(doc, DocumentDTO.class))
                .collect(Collectors.toList());
    }
}
