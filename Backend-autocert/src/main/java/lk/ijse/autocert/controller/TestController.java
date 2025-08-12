package lk.ijse.autocert.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public String adminAccess() {
        return "Admin Access Granted";
    }

    @GetMapping("/customer")
    @PreAuthorize("hasRole('CUSTOMER')")
    public String customerAccess() {
        return "Customer Access Granted";
    }
}
