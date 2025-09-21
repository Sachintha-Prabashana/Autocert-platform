package lk.ijse.autocert.service.impl;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
@Service
public class ImgbbService {
    @Value("${imgbb.api.key}")
    private String apiKey;

    public String uploadFile(MultipartFile file) {
        try {
            // Convert file to Base64
            String base64 = Base64.getEncoder().encodeToString(file.getBytes());
            String data = "image=" + URLEncoder.encode(base64, StandardCharsets.UTF_8);

            // Create HTTP request
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.imgbb.com/1/upload?key=" + apiKey))
                    .POST(HttpRequest.BodyPublishers.ofString(data))
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .build();

            HttpClient client = HttpClient.newHttpClient();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            JSONObject json = new JSONObject(response.body());
            if (!json.getBoolean("success")) {
                throw new RuntimeException("ImgBB upload failed: " + json.toString());
            }

            return json.getJSONObject("data").getString("url");

        } catch (IOException | InterruptedException e) {
            throw new RuntimeException("Failed to upload file", e);
        }
    }
}
