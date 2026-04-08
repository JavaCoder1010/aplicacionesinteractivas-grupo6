package com.uade.tpejemplo.repository;

import com.uade.tpejemplo.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, String> {

    Optional<Cliente> findByCuit(String cuit);

    boolean existsByCuit(String cuit);

    boolean existsByEmail(String email);

    // Filtro por nombre de etiqueta para GET /api/clientes?etiqueta={nombre}
    @Query("SELECT DISTINCT ce.cliente FROM ClienteEtiqueta ce WHERE ce.etiqueta.nombre = :nombreEtiqueta")
    List<Cliente> findByEtiquetaNombre(@Param("nombreEtiqueta") String nombreEtiqueta);
}
