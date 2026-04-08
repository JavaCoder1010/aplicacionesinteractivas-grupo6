package com.uade.tpejemplo.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * Response para una asignación de etiqueta a un cliente.
 * Incluye la etiqueta completa, la fecha de asignación y el username de quien asignó.
 */
@Data
@AllArgsConstructor
public class ClienteEtiquetaResponse {

    private EtiquetaResponse etiqueta;
    private LocalDateTime fechaAsignacion;
    private String asignadoPor;  // username del usuario que realizó la asignación
}
