package com.uade.tpejemplo.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class EtiquetaResponse {

    private Long id;
    private String nombre;
    private String descripcion;
    private String color;
    private LocalDateTime fechaCreacion;
}
