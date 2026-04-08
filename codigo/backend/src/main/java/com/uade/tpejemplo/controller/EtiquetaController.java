package com.uade.tpejemplo.controller;

import com.uade.tpejemplo.dto.request.EtiquetaRequest;
import com.uade.tpejemplo.dto.response.ClienteResponse;
import com.uade.tpejemplo.dto.response.EtiquetaResponse;
import com.uade.tpejemplo.service.EtiquetaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/etiquetas")
@RequiredArgsConstructor
public class EtiquetaController {

    private final EtiquetaService etiquetaService;

    @PostMapping
    public ResponseEntity<EtiquetaResponse> crear(@Valid @RequestBody EtiquetaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(etiquetaService.crear(request));
    }

    @GetMapping
    public ResponseEntity<List<EtiquetaResponse>> listarTodas() {
        return ResponseEntity.ok(etiquetaService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EtiquetaResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(etiquetaService.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EtiquetaResponse> modificar(
            @PathVariable Long id,
            @Valid @RequestBody EtiquetaRequest request) {
        return ResponseEntity.ok(etiquetaService.modificar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        etiquetaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    // Consulta inversa: clientes que tienen esta etiqueta
    @GetMapping("/{id}/clientes")
    public ResponseEntity<List<ClienteResponse>> obtenerClientes(@PathVariable Long id) {
        return ResponseEntity.ok(etiquetaService.obtenerClientesPorEtiqueta(id));
    }
}
