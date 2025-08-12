package lk.ijse.autocert.service.impl;

import lk.ijse.autocert.service.FileStorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class FileStorageServiceImpl implements FileStorageService {

    // Base directory where files will be saved
    private final Path fileStorageLocation;

    // Inject the directory path from application.properties or default to "uploads"
    public FileStorageServiceImpl(@Value("${file.upload-dir:uploads}") String uploadDir) {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (IOException ex) {
            throw new RuntimeException("Could not create upload directory", ex);
        }
    }

    @Override
    public String storeFile(MultipartFile file) {
        // Normalize file name
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());

        // Generate a unique file name to avoid collisions
        String fileExtension = "";

        int extIndex = originalFileName.lastIndexOf(".");
        if (extIndex > 0) {
            fileExtension = originalFileName.substring(extIndex);
        }
        String fileName = UUID.randomUUID().toString() + fileExtension;

        try {
            // Check for invalid characters in filename
            if (fileName.contains("..")) {
                throw new RuntimeException("Invalid path sequence in file name: " + fileName);
            }

            // Copy file to the target location (overwrite if exists)
            Path targetLocation = this.fileStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Return relative path or URL to the saved file (customize as needed)
            return "/uploads/" + fileName;

        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + fileName + ". Please try again!", ex);
        }
    }
}
