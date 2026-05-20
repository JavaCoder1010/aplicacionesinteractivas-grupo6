package com.uade.tpejemplo.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Tabla asociativa entre Cliente y Etiqueta con atributos propios.
 * Se usa entidad intermedia explícita (no @ManyToMany directo) porque
 * la relación registra quién asignó la etiqueta y cuándo.
 *
 * Restricción de unicidad: un cliente no puede tener la misma etiqueta dos veces.
 */
@Entity
@Table(
    name = "cliente_etiqueta",
    uniqueConstraints = @UniqueConstraint(
        name = "uk_cliente_etiqueta",
        columnNames = {"cliente_cuit", "etiqueta_id"}
    )
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClienteEtiqueta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_cuit", nullable = false)
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "etiqueta_id", nullable = false)
    private Etiqueta etiqueta;

    @Column(name = "fecha_asignacion", nullable = false)
    private LocalDateTime fechaAsignacion;

    // FK al usuario que realizó la asignación
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario asignadoPor;

    @PrePersist
    public void prePersist() {
        this.fechaAsignacion = LocalDateTime.now();
    }
}
