package com.example.backend.service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class OpenAIService {

    private static final Logger logger = LoggerFactory.getLogger(OpenAIService.class);

    @Value("${openai.api.key}")
    private String apiKey;

    private final WebClient webClient;

    public OpenAIService() {
        this.webClient = WebClient.builder()
                .baseUrl("https://api.openai.com/v1/chat/completions")
                .defaultHeader("Content-Type", "application/json")
                .build();
    }

    public Mono<String> getChatResponse(String message) {
        logger.debug("API Key: {}", apiKey); // Ensure this is removed or masked in production

        return webClient.post()
                .header("Authorization", "Bearer " + apiKey)
                .bodyValue(Map.of(
                        "model", "gpt-4o-mini",
                        "messages", new Object[]{Map.of("role", "user", "content", message)},
                        "temperature", 0.7
                ))
                .retrieve()
                .bodyToMono(String.class);
    }
}