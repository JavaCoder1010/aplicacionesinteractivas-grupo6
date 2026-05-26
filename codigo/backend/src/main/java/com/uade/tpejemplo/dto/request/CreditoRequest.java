package com.uade.tpejemplo.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CreditoRequest {

    @NotBlank(message = "El CUIT del cliente es obligatorio")
    private String cuitCliente;

    @NotNull(message = "La deuda original es obligatoria")
    @Positive(message = "La deuda original debe ser mayor a cero")
    private BigDecimal deudaOriginal;

    @NotNull(message = "La fecha es obligatoria")
    private LocalDate fecha;


    @NotNull(message = "La cantidad de cuotas es obligatoria")
    @Min(value = 1, message = "Debe tener al menos 1 cuota")
    private Integer cantidadCuotas;
}
