package com.uade.tpejemplo.repository;

import com.uade.tpejemplo.model.Etiqueta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EtiquetaRepository extends JpaRepository<Etiqueta, Long> {

    Optional<Etiqueta> findByNombre(String nombre);

    boolean existsByNombre(String nombre);
}
