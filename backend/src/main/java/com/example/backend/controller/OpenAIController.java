package com.example.backend.controller;

import com.example.backend.service.OpenAIService;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:3000") // Allow frontend access
public class OpenAIController {

    private final OpenAIService openAIService;

    public OpenAIController(OpenAIService openAIService) {
        this.openAIService = openAIService;
    }

    @PostMapping
    public Mono<String> chat(@RequestHeader(value = "sessionId", required = false) String sessionId,
                             @RequestBody Map<String, String> request) {
        if (sessionId == null || sessionId.isEmpty()) {
            sessionId = UUID.randomUUID().toString(); // Generate a new session ID if not provided
        }
        String userMessage = request.get("message");
        return openAIService.getChatResponse(sessionId, userMessage);
    }
}