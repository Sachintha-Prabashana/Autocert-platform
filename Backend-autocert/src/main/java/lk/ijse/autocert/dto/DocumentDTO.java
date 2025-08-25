package lk.ijse.autocert.dto;

import lk.ijse.autocert.entity.DocumentType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DocumentDTO {
    private Long id;
    private DocumentType documentType;
    private String originalFilename;
    private String contentType;
    private long sizeBytes;
    private String fileUrl;
}