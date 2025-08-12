package lk.ijse.autocert.service;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    String storeFile(MultipartFile file);
}
