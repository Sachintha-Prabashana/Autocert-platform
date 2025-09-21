package lk.ijse.autocert.controller;

import lk.ijse.autocert.dto.DocumentDTO;
import lk.ijse.autocert.dto.ApiResponse;
import lk.ijse.autocert.entity.DocumentType;
import lk.ijse.autocert.service.impl.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;

    // Customer uploads document
    @PostMapping("/upload")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse> uploadDocument(
            @RequestParam Long ownerId,
            @RequestParam DocumentType type,
            @RequestPart("file") MultipartFile file
    ) throws IOException, InterruptedException {

        DocumentDTO docDto = documentService.uploadToImgBB(ownerId, type, file);
        return ResponseEntity.ok(new ApiResponse(200, "Document uploaded successfully", docDto));
    }
/*
    // Customer views all their documents
    @GetMapping("/my-documents")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse> getMyDocuments(@RequestParam Long id ) {
        List<DocumentDTO> docs = documentService.getDocumentsByOwner(id);
        return ResponseEntity.ok(new ApiResponse(200, "Documents retrieved successfully", docs));
    }*/

    // Inspector views documents for a specific customer
    @GetMapping("/inspection/{ownerId}")
    @PreAuthorize("hasRole('INSPECTOR')")
    public ResponseEntity<ApiResponse> getDocumentsForInspection(@PathVariable Long ownerId) {
        List<DocumentDTO> docs = documentService.getDocumentsByOwner(ownerId);
        return ResponseEntity.ok(new ApiResponse(200, "Documents retrieved for inspection", docs));
    }
}
