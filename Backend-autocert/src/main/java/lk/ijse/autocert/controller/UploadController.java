package lk.ijse.autocert.controller;

import lk.ijse.autocert.service.impl.CloudinaryService;
import lk.ijse.autocert.service.impl.ImgbbService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UploadController {

    private final ImgbbService imgbbService;
    private final CloudinaryService cloudinaryService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadPhotos(@RequestParam("image") List<MultipartFile> images) {
        try {
            List<String> urls = new ArrayList<>();
            for (MultipartFile file : images) {
                if (!file.isEmpty()) {
                    String url = imgbbService.uploadFile(file);
                    urls.add(url);
                }
            }
            return ResponseEntity.ok(urls); // Returns list of URLs
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to upload images: " + e.getMessage());
        }
    }

    @PostMapping("/upload-pdf")
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            // Upload PDF to Cloudinary
            String url = cloudinaryService.uploadPdf(file);

            // Return public URL
            Map<String, String> response = Map.of("url", url);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                    "url", "",
                    "error", "Failed to upload PDF: " + e.getMessage()
            ));
        }
    }
}
