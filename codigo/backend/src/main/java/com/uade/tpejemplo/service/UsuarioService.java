package com.uade.tpejemplo.service;

import java.util.List;

import com.uade.tpejemplo.dto.request.PermisosRequest;
import com.uade.tpejemplo.dto.response.UsuarioResponse;

public interface UsuarioService {

    List<UsuarioResponse> listarTodos();

    UsuarioResponse modificarPermisos(Long id, PermisosRequest request);
}