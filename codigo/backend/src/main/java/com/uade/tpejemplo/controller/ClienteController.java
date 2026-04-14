package com.uade.tpejemplo.controller;

import com.uade.tpejemplo.dto.request.ClienteRequest;
import com.uade.tpejemplo.dto.response.ClienteEtiquetaResponse;
import com.uade.tpejemplo.dto.response.ClienteResponse;
import com.uade.tpejemplo.service.ClienteService;
import com.uade.tpejemplo.service.EtiquetaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    private final ClienteService clienteService;
    private final EtiquetaService etiquetaService;

    public ClienteController(ClienteService clienteService, EtiquetaService etiquetaService) {
        this.clienteService = clienteService;
        this.etiquetaService = etiquetaService;
    }

    @PostMapping
    public ResponseEntity<ClienteResponse> crear(@Valid @RequestBody ClienteRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(clienteService.crear(request));
    }

    @GetMapping
    public ResponseEntity<List<ClienteResponse>> listarTodos(
            @RequestParam(required = false) String etiqueta) {
        return ResponseEntity.ok(clienteService.listarTodos(etiqueta));
    }

    @GetMapping("/{cuit}")
    public ResponseEntity<ClienteResponse> buscarPorCuit(@PathVariable String cuit) {
        return ResponseEntity.ok(clienteService.buscarPorCuit(cuit));
    }

    @PutMapping("/{cuit}")
    public ResponseEntity<ClienteResponse> modificar(
            @PathVariable String cuit,
            @Valid @RequestBody ClienteRequest request) {
        return ResponseEntity.ok(clienteService.modificar(cuit, request));
    }

    @DeleteMapping("/{cuit}")
    public ResponseEntity<Void> eliminar(@PathVariable String cuit) {
        clienteService.eliminar(cuit);
        return ResponseEntity.noContent().build();
    }

    // ---- Endpoints de asignación de etiquetas ----

    @PostMapping("/{cuit}/etiquetas/{etiquetaId}")
    public ResponseEntity<Void> asignarEtiqueta(
            @PathVariable String cuit,
            @PathVariable Long etiquetaId,
            Authentication authentication) {
        etiquetaService.asignarACliente(cuit, etiquetaId, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/{cuit}/etiquetas/{etiquetaId}")
    public ResponseEntity<Void> quitarEtiqueta(
            @PathVariable String cuit,
            @PathVariable Long etiquetaId) {
        etiquetaService.quitarDeCliente(cuit, etiquetaId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{cuit}/etiquetas")
    public ResponseEntity<List<ClienteEtiquetaResponse>> obtenerEtiquetas(@PathVariable String cuit) {
        return ResponseEntity.ok(etiquetaService.obtenerEtiquetasDeCliente(cuit));
    }
}
