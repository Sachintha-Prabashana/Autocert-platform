package lk.ijse.autocert.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ApiResponse {
    private int code;
    private String message;
    private Object data;
}
