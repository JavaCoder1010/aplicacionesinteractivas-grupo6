package com.uade.tpejemplo.dto.request;

import lombok.Data;

/**
 * DTO para actualizar los permisos de un usuario.
 * Preparado para Entrega 3 — aún no se usa en Entrega 1.
 *
 * TODO: Entrega 3 — conectar con AdminController y UsuarioServiceImpl
 */
@Data
public class PermisosRequest {

    private boolean puedeAnularCredito;

    private boolean puedeAnularCobranza;
}
