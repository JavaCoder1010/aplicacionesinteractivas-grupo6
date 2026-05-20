package com.uade.tpejemplo.repository;

import com.uade.tpejemplo.model.Cliente;
import com.uade.tpejemplo.model.ClienteEtiqueta;
import com.uade.tpejemplo.model.Etiqueta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ClienteEtiquetaRepository extends JpaRepository<ClienteEtiqueta, Long> {

    // Verifica si un cliente ya tiene asignada una etiqueta (regla de negocio: no duplicados)
    boolean existsByClienteAndEtiqueta(Cliente cliente, Etiqueta etiqueta);

    // Obtiene todas las asignaciones de un cliente (para listar sus etiquetas)
    List<ClienteEtiqueta> findByCliente(Cliente cliente);

    // Obtiene todas las asignaciones de una etiqueta (para listar sus clientes)
    List<ClienteEtiqueta> findByEtiqueta(Etiqueta etiqueta);

    // Busca una asignación específica para poder eliminarla
    Optional<ClienteEtiqueta> findByClienteAndEtiqueta(Cliente cliente, Etiqueta etiqueta);

    // Verifica si un cliente tiene al menos una etiqueta (para regla de eliminación)
    boolean existsByCliente(Cliente cliente);

    // Verifica si una etiqueta tiene al menos un cliente asignado (para regla de eliminación)
    boolean existsByEtiqueta(Etiqueta etiqueta);
}
