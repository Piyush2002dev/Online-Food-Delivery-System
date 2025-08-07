package com.delivery.delivery_service.exception;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired; // Still used for WebApplicationContext
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
// Removed TestConfiguration and its imports as we're no longer using it to define DummyController as a bean
// Removed SecurityFilterChain imports as this specific test setup will bypass the main app's security config
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders; // Retained for explicit MockMvc setup
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.WebApplicationContext; // Still used for webAppContextSetup if desired

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Integration tests for {@link GlobalExceptionHandler} using Spring Boot's test capabilities.
 * This setup loads a full Spring application context, ensuring that {@code @ControllerAdvice}
 * components like {@link GlobalExceptionHandler} are active and correctly intercept exceptions
 * thrown by the controller.
 *
 * A {@code DummyController} is explicitly registered with MockMvc in the {@code @BeforeEach} method
 * to ensure its endpoints are properly mapped within the test context, allowing for direct
 * testing of the exception handling logic without relying on service layer mocks.
 *
 * This approach is recommended for testing global exception handlers as it closely mimics the
 * production environment and works well with code coverage tools.
 */
@SpringBootTest // Loads the full Spring application context
@AutoConfigureMockMvc // Auto-configures MockMvc, but we will override its setup for explicit controller registration
public class GlobalExceptionHandlerTest {

    private MockMvc mockMvc; // Will be manually set up in @BeforeEach

    // DummyController and GlobalExceptionHandler instances to be used in MockMvcBuilders.standaloneSetup
    // Note: We instantiate these directly. Spring's context will still have its own beans,
    // but MockMvc in standalone setup will use these specific instances.
    private DummyController dummyController = new DummyController();
    private GlobalExceptionHandler globalExceptionHandler = new GlobalExceptionHandler();

    /**
     * A dummy controller to expose endpoints that directly throw various custom exceptions.
     * This allows direct testing of the GlobalExceptionHandler's response to specific exceptions.
     */
    @RestController
    static class DummyController {
        @GetMapping("/test-not-found")
        public void throwNotFound() {
            throw new ResourceNotFoundException("Resource not found");
        }

        @GetMapping("/test-duplicate")
        public void throwDuplicate() {
            throw new DuplicateAssignmentException("Duplicate assignment");
        }

        @GetMapping("/test-invalid-status")
        public void throwInvalidStatus() {
            throw new InvalidStatusException("Invalid status");
        }

        @GetMapping("/test-invalid-order")
        public void throwInvalidOrder() {
            throw new InvalidOrderIdException("Invalid order ID");
        }

        @GetMapping("/test-invalid-agent")
        public void throwInvalidAgent() {
            throw new InvalidAgentIdException("Invalid agent ID");
        }

        @GetMapping("/test-unknown")
        public void throwUnknown() {
            throw new RuntimeException("Something went wrong");
        }
    }

    @BeforeEach
    void setUp() {
        // Manually set up MockMvc to target the specific DummyController and GlobalExceptionHandler.
        // This ensures Spring's mapping for these specific endpoints within this test.
        this.mockMvc = MockMvcBuilders
                .standaloneSetup(dummyController) // Register the specific DummyController instance
                .setControllerAdvice(globalExceptionHandler) // Register the specific GlobalExceptionHandler instance
                .build();
    }

    /**
     * Tests the handling of {@link ResourceNotFoundException} by {@link GlobalExceptionHandler}.
     */
    @Test
    void testResourceNotFoundException() throws Exception {
        mockMvc.perform(get("/test-not-found").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Resource not found"))
                .andExpect(jsonPath("$.error").value("Not Found"));
    }

    /**
     * Tests the handling of {@link DuplicateAssignmentException} by {@link GlobalExceptionHandler}.
     */
    @Test
    void testDuplicateAssignmentException() throws Exception {
        mockMvc.perform(get("/test-duplicate").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("Duplicate assignment"))
                .andExpect(jsonPath("$.error").value("Conflict"));
    }

    /**
     * Tests the handling of {@link InvalidStatusException} by {@link GlobalExceptionHandler}.
     */
    @Test
    void testInvalidStatusException() throws Exception {
        mockMvc.perform(get("/test-invalid-status").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Invalid status"))
                .andExpect(jsonPath("$.error").value("Bad Request"));
    }

    /**
     * Tests the handling of {@link InvalidOrderIdException} by {@link GlobalExceptionHandler}.
     */
    @Test
    void testInvalidOrderIdException() throws Exception {
        mockMvc.perform(get("/test-invalid-order").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Invalid order ID"))
                .andExpect(jsonPath("$.error").value("Bad Request"));
    }

    /**
     * Tests the handling of {@link InvalidAgentIdException} by {@link GlobalExceptionHandler}.
     */
    @Test
    void testInvalidAgentIdException() throws Exception {
        mockMvc.perform(get("/test-invalid-agent").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Invalid agent ID"))
                .andExpect(jsonPath("$.error").value("Bad Request"));
    }

    /**
     * Tests the handling of any uncaught {@link Exception} by {@link GlobalExceptionHandler}.
     */
    @Test
    void testUnknownException() throws Exception {
        mockMvc.perform(get("/test-unknown").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.message").value("An unexpected error occurred: Something went wrong"))
                .andExpect(jsonPath("$.error").value("Internal Server Error"));
    }
}
