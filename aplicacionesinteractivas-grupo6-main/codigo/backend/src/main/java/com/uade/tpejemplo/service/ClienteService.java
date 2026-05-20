package com.uade.tpejemplo.service;

import com.uade.tpejemplo.dto.request.ClienteRequest;
import com.uade.tpejemplo.dto.response.ClienteResponse;

import java.util.List;

public interface ClienteService {

    ClienteResponse crear(ClienteRequest request);

    ClienteResponse buscarPorCuit(String cuit);

    List<ClienteResponse> listarTodos(String etiqueta);  // etiqueta puede ser null (sin filtro)

    ClienteResponse modificar(String cuit, ClienteRequest request);

    void eliminar(String cuit);
}
