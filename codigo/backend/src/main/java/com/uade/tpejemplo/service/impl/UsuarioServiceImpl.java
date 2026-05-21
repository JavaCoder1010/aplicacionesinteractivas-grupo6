package com.uade.tpejemplo.service.impl;
import com.uade.tpejemplo.model.Usuario;

import java.util.List;

import org.springframework.stereotype.Service;

import com.uade.tpejemplo.dto.request.PermisosRequest;
import com.uade.tpejemplo.dto.response.UsuarioResponse;
import com.uade.tpejemplo.exception.ResourceNotFoundException;
import com.uade.tpejemplo.repository.UsuarioRepository;
import com.uade.tpejemplo.service.UsuarioService;

import jakarta.transaction.Transactional;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioServiceImpl(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public List<UsuarioResponse> listarTodos() {
        return usuarioRepository.findAll().stream()
            .map(this::toResponse)
            .toList();
    }

    @Override
    @Transactional
    public UsuarioResponse modificarPermisos(Long id, PermisosRequest request) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario", "id", id));

        usuario.setPuedeAnularCredito(request.isPuedeAnularCredito());
        usuario.setPuedeAnularCobranza(request.isPuedeAnularCobranza());

        usuarioRepository.save(usuario);
        return toResponse(usuario);
    }

    private UsuarioResponse toResponse(Usuario usuario) {
        return new UsuarioResponse(
            usuario.getId(),
            usuario.getUsername(),
            usuario.getRol().name(),
            usuario.isPuedeAnularCredito(),
            usuario.isPuedeAnularCobranza()
        );
    }
}