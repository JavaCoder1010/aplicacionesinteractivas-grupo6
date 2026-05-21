package com.uade.tpejemplo.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Response para datos de usuario.
 * Preparado para Entrega 3 (gestor de permisos — solo ADMIN).
 *
 * TODO: Entrega 3 — agregar campos puedeAnularCredito y puedeAnularCobranza
 *   private boolean puedeAnularCredito;
 *   private boolean puedeAnularCobranza;
 */
@Data
@AllArgsConstructor
public class UsuarioResponse {

    private Long id;
    private String username;
    private String rol;
    private boolean puedeAnularCredito;
    private boolean puedeAnularCobranza;

    // TODO: Entrega 3 — descomentar cuando se agreguen los campos a Usuario.java
    
}
