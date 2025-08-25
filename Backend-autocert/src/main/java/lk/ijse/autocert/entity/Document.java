package lk.ijse.autocert.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private DocumentType documentType; // VRC, Insurance, Owner ID, Previous Report

    private String originalFilename;
    private String contentType;
    private long sizeBytes;
    private String fileUrl;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    private boolean isVisibleToInspector = true; // inspector can see if true
}
