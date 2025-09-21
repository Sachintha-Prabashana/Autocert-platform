package lk.ijse.autocert.entity;

import jakarta.persistence.Embeddable;
import lombok.*;


@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceAddress {
    private String streetAddress;
    private String streetAddressLine2;
    private String city;
    private String stateProvince;
    private String postalCode;


}