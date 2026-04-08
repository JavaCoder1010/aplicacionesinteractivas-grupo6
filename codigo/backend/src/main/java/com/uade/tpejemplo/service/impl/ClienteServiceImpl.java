package com.uade.tpejemplo.service.impl;

import com.uade.tpejemplo.dto.request.ClienteRequest;
import com.uade.tpejemplo.dto.response.ClienteResponse;
import com.uade.tpejemplo.exception.BusinessException;
import com.uade.tpejemplo.exception.ResourceNotFoundException;
import com.uade.tpejemplo.model.Cliente;
import com.uade.tpejemplo.repository.ClienteEtiquetaRepository;
import com.uade.tpejemplo.repository.ClienteRepository;
import com.uade.tpejemplo.service.ClienteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClienteServiceImpl implements ClienteService {

    private final ClienteRepository clienteRepository;
    private final ClienteEtiquetaRepository clienteEtiquetaRepository;

    @Override
    @Transactional
    public ClienteResponse crear(ClienteRequest request) {
        // Regla: CUIT único
        if (clienteRepository.existsByCuit(request.getCuit())) {
            throw new BusinessException("Ya existe un cliente con CUIT: " + request.getCuit());
        }
        // Regla: email único
        if (clienteRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Ya existe un cliente con email: " + request.getEmail());
        }
        Cliente cliente = new Cliente(
            request.getCuit(),
            request.getNombre(),
            request.getRazonSocial(),
            request.getEmail(),
            request.getTelefono(),
            null,
            null
        );
        clienteRepository.save(cliente);
        return toResponse(cliente);
    }

    @Override
    public ClienteResponse buscarPorCuit(String cuit) {
        Cliente cliente = clienteRepository.findByCuit(cuit)
            .orElseThrow(() -> new ResourceNotFoundException("Cliente", "CUIT", cuit));
        return toResponse(cliente);
    }

    @Override
    public List<ClienteResponse> listarTodos(String etiqueta) {
        List<Cliente> clientes;
        if (etiqueta != null && !etiqueta.isBlank()) {
            // Filtro por nombre de etiqueta
            clientes = clienteRepository.findByEtiquetaNombre(etiqueta);
        } else {
            clientes = clienteRepository.findAll();
        }
        return clientes.stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional
    public ClienteResponse modificar(String cuit, ClienteRequest request) {
        Cliente cliente = clienteRepository.findByCuit(cuit)
            .orElseThrow(() -> new ResourceNotFoundException("Cliente", "CUIT", cuit));

        // Si el email cambia, verificar que no esté en uso por otro cliente
        if (!cliente.getEmail().equals(request.getEmail()) && clienteRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Ya existe un cliente con email: " + request.getEmail());
        }

        cliente.setNombre(request.getNombre());
        cliente.setRazonSocial(request.getRazonSocial());
        cliente.setEmail(request.getEmail());
        cliente.setTelefono(request.getTelefono());
        clienteRepository.save(cliente);
        return toResponse(cliente);
    }

    @Override
    @Transactional
    public void eliminar(String cuit) {
        Cliente cliente = clienteRepository.findByCuit(cuit)
            .orElseThrow(() -> new ResourceNotFoundException("Cliente", "CUIT", cuit));

        // Regla: no se puede eliminar si tiene etiquetas asignadas
        if (clienteEtiquetaRepository.existsByCliente(cliente)) {
            throw new BusinessException(
                "No se puede eliminar el cliente " + cuit + " porque tiene etiquetas asignadas"
            );
        }
        clienteRepository.delete(cliente);
    }

    private ClienteResponse toResponse(Cliente cliente) {
        return new ClienteResponse(
            cliente.getCuit(),
            cliente.getNombre(),
            cliente.getRazonSocial(),
            cliente.getEmail(),
            cliente.getTelefono()
        );
    }
}
