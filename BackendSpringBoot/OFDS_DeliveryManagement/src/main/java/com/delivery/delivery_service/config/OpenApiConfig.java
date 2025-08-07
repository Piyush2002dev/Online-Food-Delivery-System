package com.delivery.delivery_service.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    /**
     * Defines a custom OpenAPI bean to provide metadata for the API documentation.
     * This information is rendered at the top of the Swagger UI page.
     *
     * @return An {@link OpenAPI} object populated with API details.
     */

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Delivery Service API")
                        .version("1.0")
                        .description("API documentation for the delivery microservice")
                        .contact(new Contact()
                                .name("Ajay K")
                                .email("ajaykumaravelu07@gmail.com")));
    }
}