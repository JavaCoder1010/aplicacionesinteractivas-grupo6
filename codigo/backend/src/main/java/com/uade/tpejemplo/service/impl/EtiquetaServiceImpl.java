package com.uade.tpejemplo.service.impl;

import com.uade.tpejemplo.dto.request.EtiquetaRequest;
import com.uade.tpejemplo.dto.response.ClienteEtiquetaResponse;
import com.uade.tpejemplo.dto.response.ClienteResponse;
import com.uade.tpejemplo.dto.response.EtiquetaResponse;
import com.uade.tpejemplo.exception.BusinessException;
import com.uade.tpejemplo.exception.ResourceNotFoundException;
import com.uade.tpejemplo.model.Cliente;
import com.uade.tpejemplo.model.ClienteEtiqueta;
import com.uade.tpejemplo.model.Etiqueta;
import com.uade.tpejemplo.model.Usuario;
import com.uade.tpejemplo.repository.ClienteEtiquetaRepository;
import com.uade.tpejemplo.repository.ClienteRepository;
import com.uade.tpejemplo.repository.EtiquetaRepository;
import com.uade.tpejemplo.repository.UsuarioRepository;
import com.uade.tpejemplo.service.EtiquetaService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EtiquetaServiceImpl implements EtiquetaService {

    private final EtiquetaRepository etiquetaRepository;
    private final ClienteRepository clienteRepository;
    private final ClienteEtiquetaRepository clienteEtiquetaRepository;
    private final UsuarioRepository usuarioRepository;

    public EtiquetaServiceImpl(EtiquetaRepository etiquetaRepository,
                               ClienteRepository clienteRepository,
                               ClienteEtiquetaRepository clienteEtiquetaRepository,
                               UsuarioRepository usuarioRepository) {
        this.etiquetaRepository = etiquetaRepository;
        this.clienteRepository = clienteRepository;
        this.clienteEtiquetaRepository = clienteEtiquetaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    // -------------------------------------------------------
    // CRUD de etiquetas
    // -------------------------------------------------------

    @Override
    @Transactional
    public EtiquetaResponse crear(EtiquetaRequest request) {
        // Regla: nombre único
        if (etiquetaRepository.existsByNombre(request.getNombre())) {
            throw new BusinessException("Ya existe una etiqueta con nombre: " + request.getNombre());
        }
        Etiqueta etiqueta = new Etiqueta(
            null,
            request.getNombre(),
            request.getDescripcion(),
            request.getColor(),
            null,   // fechaCreacion se asigna en @PrePersist
            null    // clienteEtiquetas — no se inicializa aquí
        );
        etiquetaRepository.save(etiqueta);
        return toResponse(etiqueta);
    }

    @Override
    public List<EtiquetaResponse> listarTodas() {
        return etiquetaRepository.findAll().stream()
            .map(this::toResponse)
            .toList();
    }

    @Override
    public EtiquetaResponse buscarPorId(Long id) {
        Etiqueta etiqueta = findEtiquetaOrThrow(id);
        return toResponse(etiqueta);
    }

    @Override
    @Transactional
    public EtiquetaResponse modificar(Long id, EtiquetaRequest request) {
        Etiqueta etiqueta = findEtiquetaOrThrow(id);

        // Si el nombre cambia, verificar que no exista otra con ese nombre
        if (!etiqueta.getNombre().equals(request.getNombre()) && etiquetaRepository.existsByNombre(request.getNombre())) {
            throw new BusinessException("Ya existe una etiqueta con nombre: " + request.getNombre());
        }

        etiqueta.setNombre(request.getNombre());
        etiqueta.setDescripcion(request.getDescripcion());
        etiqueta.setColor(request.getColor());
        etiquetaRepository.save(etiqueta);
        return toResponse(etiqueta);
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        Etiqueta etiqueta = findEtiquetaOrThrow(id);

        // Regla: no se puede eliminar si tiene clientes asignados
        if (clienteEtiquetaRepository.existsByEtiqueta(etiqueta)) {
            throw new BusinessException(
                "No se puede eliminar la etiqueta '" + etiqueta.getNombre() + "' porque tiene clientes asignados"
            );
        }
        etiquetaRepository.delete(etiqueta);
    }

    // -------------------------------------------------------
    // Asignación cliente <-> etiqueta
    // -------------------------------------------------------

    @Override
    @Transactional
    public void asignarACliente(String cuit, Long etiquetaId, String usernameAsignador) {
        Cliente cliente = clienteRepository.findByCuit(cuit)
            .orElseThrow(() -> new ResourceNotFoundException("Cliente", "CUIT", cuit));
        Etiqueta etiqueta = findEtiquetaOrThrow(etiquetaId);
        Usuario asignador = usuarioRepository.findByUsername(usernameAsignador)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario", "username", usernameAsignador));

        // Regla: no se puede asignar la misma etiqueta dos veces al mismo cliente
        if (clienteEtiquetaRepository.existsByClienteAndEtiqueta(cliente, etiqueta)) {
            throw new BusinessException(
                "El cliente " + cuit + " ya tiene asignada la etiqueta '" + etiqueta.getNombre() + "'"
            );
        }

        ClienteEtiqueta asignacion = new ClienteEtiqueta(null, cliente, etiqueta, null, asignador);
        clienteEtiquetaRepository.save(asignacion);
    }

    @Override
    @Transactional
    public void quitarDeCliente(String cuit, Long etiquetaId) {
        Cliente cliente = clienteRepository.findByCuit(cuit)
            .orElseThrow(() -> new ResourceNotFoundException("Cliente", "CUIT", cuit));
        Etiqueta etiqueta = findEtiquetaOrThrow(etiquetaId);

        ClienteEtiqueta asignacion = clienteEtiquetaRepository.findByClienteAndEtiqueta(cliente, etiqueta)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Asignación", "cliente/etiqueta", cuit + "/" + etiquetaId
            ));
        clienteEtiquetaRepository.delete(asignacion);
    }

    @Override
    public List<ClienteEtiquetaResponse> obtenerEtiquetasDeCliente(String cuit) {
        Cliente cliente = clienteRepository.findByCuit(cuit)
            .orElseThrow(() -> new ResourceNotFoundException("Cliente", "CUIT", cuit));

        return clienteEtiquetaRepository.findByCliente(cliente).stream()
            .map(ce -> new ClienteEtiquetaResponse(
                toResponse(ce.getEtiqueta()),
                ce.getFechaAsignacion(),
                ce.getAsignadoPor().getUsername()
            ))
            .toList();
    }

    @Override
    public List<ClienteResponse> obtenerClientesPorEtiqueta(Long etiquetaId) {
        Etiqueta etiqueta = findEtiquetaOrThrow(etiquetaId);

        return clienteEtiquetaRepository.findByEtiqueta(etiqueta).stream()
            .map(ce -> new ClienteResponse(
                ce.getCliente().getCuit(),
                ce.getCliente().getNombre(),
                ce.getCliente().getRazonSocial(),
                ce.getCliente().getEmail(),
                ce.getCliente().getTelefono()
            ))
            .toList();
    }

    // -------------------------------------------------------
    // Helpers privados
    // -------------------------------------------------------

    private Etiqueta findEtiquetaOrThrow(Long id) {
        return etiquetaRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Etiqueta", "id", id.toString()));
    }

    private EtiquetaResponse toResponse(Etiqueta etiqueta) {
        return new EtiquetaResponse(
            etiqueta.getId(),
            etiqueta.getNombre(),
            etiqueta.getDescripcion(),
            etiqueta.getColor(),
            etiqueta.getFechaCreacion()
        );
    }
}
