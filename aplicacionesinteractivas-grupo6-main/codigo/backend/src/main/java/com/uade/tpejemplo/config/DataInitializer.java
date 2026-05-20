package com.uade.tpejemplo.config;

import com.uade.tpejemplo.model.Rol;
import com.uade.tpejemplo.model.Usuario;
import com.uade.tpejemplo.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @SuppressWarnings("null")
    @Bean
    CommandLineRunner initAdmin(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {
            String usernameAdmin = "admin";

            if (!usuarioRepository.existsByUsername(usernameAdmin)) {
                Usuario admin = Usuario.builder()
                    .username(usernameAdmin)
                    .password(passwordEncoder.encode("admin123"))
                    .rol(Rol.ADMIN)
                    .puedeAnularCredito(true)
                    .puedeAnularCobranza(true)
                    .build();

                usuarioRepository.save(admin);
            }
        };
    }
}