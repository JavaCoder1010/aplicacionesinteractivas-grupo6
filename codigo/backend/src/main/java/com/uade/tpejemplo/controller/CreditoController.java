package com.uade.tpejemplo.controller;

import com.uade.tpejemplo.dto.request.CreditoRequest;
import com.uade.tpejemplo.dto.response.CreditoResponse;
import com.uade.tpejemplo.service.CreditoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/creditos")
public class CreditoController {

    private final CreditoService creditoService;

    public CreditoController(CreditoService creditoService) {
        this.creditoService = creditoService;
    }

    @PostMapping
    public ResponseEntity<CreditoResponse> crear(@Valid @RequestBody CreditoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(creditoService.crear(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CreditoResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(creditoService.buscarPorId(id));
    }

    @GetMapping("/cliente/{cuit}")
    public ResponseEntity<List<CreditoResponse>> listarPorCliente(@PathVariable String cuit) {
        return ResponseEntity.ok(creditoService.listarPorCliente(cuit));
    }
}
