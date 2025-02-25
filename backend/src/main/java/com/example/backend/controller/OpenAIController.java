package com.example.backend.controller;


import com.example.backend.service.OpenAIService;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:3000") // Allow frontend access
public class OpenAIController {

    private final OpenAIService openAIService;

    public OpenAIController(OpenAIService openAIService) {
        this.openAIService = openAIService;
    }

    @PostMapping
    public Mono<String> chat(@RequestBody Map<String, String> request) {
        String userMessage = request.get("message");
        return openAIService.getChatResponse(userMessage);
    }
}


