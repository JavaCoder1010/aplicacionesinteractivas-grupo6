package com.uade.tpejemplo.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "etiquetas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Etiqueta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 50)
    @Column(name = "nombre", nullable = false, unique = true, length = 50)
    private String nombre;

    @NotBlank
    @Size(max = 50)
    @Column(name = "examen", nullable = false, unique = true, length = 50)
    private String examen;

    @Size(max = 255)
    @Column(name = "descripcion", length = 255)
    private String descripcion;  // nullable

    @NotBlank
    @Size(max = 7)
    @Column(name = "color", nullable = false, length = 7)
    private String color;  // color hex obligatorio, ej: "#E63946"

    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion;

    @OneToMany(mappedBy = "etiqueta", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ClienteEtiqueta> clienteEtiquetas = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        this.fechaCreacion = LocalDateTime.now();
    }
}
