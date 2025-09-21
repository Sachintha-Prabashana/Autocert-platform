package lk.ijse.autocert.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    @Value("${cloudinary.upload-preset:}")
    private String uploadPreset;

    // Constructor for Cloudinary initialization
    public CloudinaryService(@Value("${cloudinary.cloud-name}") String cloudName,
                             @Value("${cloudinary.api-key}") String apiKey,
                             @Value("${cloudinary.api-secret}") String apiSecret) {
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret
        ));
    }

    /**
     * Uploads a PDF file to Cloudinary under 'inspection-reports' folder.
     * @param file MultipartFile PDF to upload
     * @return secure URL of uploaded PDF
     * @throws IOException
     */
    public String uploadPdf(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File must not be null or empty");
        }

        // Upload as 'raw' for PDF
        Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(),
                ObjectUtils.asMap(
                        "resource_type", "raw",            // required for PDF/ZIP
                        "use_filename", true,              // preserve original file name
                        "unique_filename", false,          // optional: avoid Cloudinary renaming
                        "folder", "inspection-reports",    // folder structure
                        "overwrite", true                  // overwrite if file exists
                ));

        System.out.println("Cloudinary upload result: " + uploadResult);

        // Return secure URL
        return uploadResult.get("secure_url").toString();
    }
}
