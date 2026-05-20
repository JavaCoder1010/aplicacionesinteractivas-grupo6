package com.uade.tpejemplo.service;

import com.uade.tpejemplo.dto.request.EtiquetaRequest;
import com.uade.tpejemplo.dto.response.ClienteEtiquetaResponse;
import com.uade.tpejemplo.dto.response.ClienteResponse;
import com.uade.tpejemplo.dto.response.EtiquetaResponse;

import java.util.List;

public interface EtiquetaService {

    // --- CRUD de etiquetas ---

    EtiquetaResponse crear(EtiquetaRequest request);

    List<EtiquetaResponse> listarTodas();

    EtiquetaResponse buscarPorId(Long id);

    EtiquetaResponse modificar(Long id, EtiquetaRequest request);

    void eliminar(Long id);

    // --- Asignación cliente <-> etiqueta ---

    void asignarACliente(String cuit, Long etiquetaId, String usernameAsignador);

    void quitarDeCliente(String cuit, Long etiquetaId);

    List<ClienteEtiquetaResponse> obtenerEtiquetasDeCliente(String cuit);

    List<ClienteResponse> obtenerClientesPorEtiqueta(Long etiquetaId);
}
