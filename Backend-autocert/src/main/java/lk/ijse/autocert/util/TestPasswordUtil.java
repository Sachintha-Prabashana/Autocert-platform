package lk.ijse.autocert.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class TestPasswordUtil {
    public static void main(String[] args) {
        // Plain text password you want to encode
        String plainPassword = "admin123";

        // Encode using BCrypt (same as Spring Security uses)
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String encodedPassword = encoder.encode(plainPassword);

        // Output the encoded password
        System.out.println("Encoded password for '" + plainPassword + "':");
        System.out.println(encodedPassword);
    }
}



