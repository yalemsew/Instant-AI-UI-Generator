package com.example.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import java.util.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class OpenAIService {

    private static final Logger logger = LoggerFactory.getLogger(OpenAIService.class);

    @Value("${openai.api.key}")
    private String apiKey;

    private final WebClient webClient;
    private final Map<String, List<Map<String, String>>> chatHistories = new HashMap<>();

    public OpenAIService() {
        this.webClient = WebClient.builder()
                .baseUrl("https://api.openai.com/v1/chat/completions")
                .defaultHeader("Content-Type", "application/json")
                .build();
    }

    public Mono<Map<String, String>> getChatResponse(String sessionId, String message) {
        chatHistories.putIfAbsent(sessionId, new ArrayList<>());
        List<Map<String, String>> messages = chatHistories.get(sessionId);

        messages.add(Map.of("role", "user", "content", message));

        return webClient.post()
                .header("Authorization", "Bearer " + apiKey)
                .bodyValue(Map.of(
                        "model", "gpt-4o-mini",
                        "messages", messages,
                        "temperature", 0.7
                ))
                .retrieve()
                .bodyToMono(Map.class)
                .map(response -> {
                    List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
                    Map<String, Object> messageObj = (Map<String, Object>) choices.get(0).get("message");
                    String content = messageObj.get("content").toString();

                    messages.add(Map.of("role", "assistant", "content", content));

                    // Return only a key-value JSON response { "content": "response text" }
                    return Map.of("content", content);
                });
    }
    public void clearChatHistory(String sessionId) {
        chatHistories.remove(sessionId);
    }

}