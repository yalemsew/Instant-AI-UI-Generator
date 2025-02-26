package com.example.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

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
                    String fullResponse = choices.get(0).get("message").toString();

                    // Extract AI text response
                    String content = extractContent(fullResponse);
                    // Extract HTML
                    String html = extractHTML(fullResponse);
                    // Extract CSS
                    String css = extractCSS(fullResponse);

                    messages.add(Map.of("role", "assistant", "content", content));

                    return Map.of(
                            "content", content,  // AI-generated response text
                            "html", html,        // Extracted HTML
                            "css", css           // Extracted CSS
                    );
                });
    }

    // Extract AI response content without HTML/CSS
    private String extractContent(String text) {
        return text.replaceAll("<style>.*?</style>", "")  // Remove CSS
                .replaceAll("<.*?>", "")              // Remove HTML tags
                .trim();
    }

    // Extracts clean HTML while handling inline styles
    // Extracts clean HTML while handling Markdown formatting
    private String extractHTML(String text) {
        // Remove Markdown artifacts (```html, ```)
        text = text.replace("```html", "").replace("```", "").trim();

        // Regex to find common UI elements (button, input, div, form, p, etc.)
        Pattern pattern = Pattern.compile("(?s)(<button.*?</button>|<input.*?>|<form.*?</form>|<div.*?</div>|<span.*?</span>|<p.*?</p>|<h[1-6].*?</h[1-6]>)");
        Matcher matcher = pattern.matcher(text);

        // Extract the first matched HTML component
        return matcher.find() ? matcher.group(1) : "";
    }

    // Extracts only the CSS styles while removing Markdown artifacts and inline comments
    private String extractCSS(String text) {
        Pattern pattern = Pattern.compile("(?s)<style>(.*?)</style>");
        Matcher matcher = pattern.matcher(text);
        if (matcher.find()) {
            String rawCSS = matcher.group(1);

            // Remove Markdown artifacts (```css, ```)
            rawCSS = rawCSS.replace("```css", "").replace("```", "").trim();

            // Remove inline comments /* ... */
            rawCSS = rawCSS.replaceAll("/\\*.*?\\*/", "").trim();

            // Normalize spacing and indentation
            rawCSS = rawCSS.replaceAll("\\n\\s*", "\n").trim();

            return rawCSS;
        }
        return "";
    }


}