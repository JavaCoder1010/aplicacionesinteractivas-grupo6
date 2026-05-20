package com.uade.tpejemplo.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ClienteResponse {

    private String cuit;
    private String nombre;
    private String razonSocial;
    private String email;
    private String telefono;
}
