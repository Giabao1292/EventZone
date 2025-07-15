package com.example.backend.service;

import com.example.backend.dto.response.LayoutGenerateResponse;
import com.example.backend.dto.response.SeatResponse;
import com.example.backend.dto.response.SeatTypeResponse;
import com.example.backend.dto.response.ZoneResponse;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AIService {

    private final RestTemplate restTemplate;
    private final ObjectMapper mapper;

    @Value("${openrouter.api_url}")
    private String apiUrl;

    @Value("${openrouter.secret_key}")
    private String apiKey;

    public LayoutGenerateResponse callOpenRouter(String prompt) throws IOException {
        String context = Files.readString(Path.of("src/main/resources/docs/layout_guide.txt"));
        String fullPrompt = context + "\n\nRequest: " + prompt;
        ObjectNode body = mapper.createObjectNode();
        body.put("model", "mistralai/mixtral-8x7b-instruct");
        body.put("max_tokens", 5000);
        ArrayNode messages = mapper.createArrayNode();
        ObjectNode userMsg = mapper.createObjectNode();
        userMsg.put("role", "user");
        userMsg.put("content", fullPrompt);
        messages.add(userMsg);
        body.set("messages", messages);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);
        headers.add("HTTP-Referer", "https://localhost:5173");
        headers.add("X-Title", "seat-layout-generator");
        HttpEntity<String> req = new HttpEntity<>(body.toString(), headers);
        ResponseEntity<String> resp = restTemplate.postForEntity(apiUrl, req, String.class);
        if (!resp.getStatusCode().is2xxSuccessful() || resp.getBody() == null) {
            throw new IllegalStateException("OpenRouter error: " + resp.getStatusCode());
        }
        String aiContent = mapper.readTree(resp.getBody())
                .path("choices").path(0).path("message").path("content").asText();
        int start = aiContent.indexOf('{');         // vị trí '{' đầu tiên
        int end = aiContent.lastIndexOf('}');     // vị trí '}' cuối cùng
        if (start < 0 || end < start) {
            throw new IllegalStateException("Không tìm thấy JSON seats/seatTypes trong phản hồi AI");
        }
        String jsonFragment = aiContent.substring(start, end + 1);
        ObjectMapper relaxed = mapper.copy()
                .enable(JsonParser.Feature.ALLOW_COMMENTS)
                .enable(JsonParser.Feature.ALLOW_TRAILING_COMMA);
        String cleaned = jsonFragment
                .replace("\n", "")
                .replace("\t", "")
                .trim();
        JsonNode jsonNode = relaxed.readTree(cleaned);
        List<SeatResponse> seats = relaxed.convertValue(
                jsonNode.get("seats"),
                new TypeReference<List<SeatResponse>>() {
                });

        List<SeatTypeResponse> seatTypes = relaxed.convertValue(
                jsonNode.get("seatTypes"),
                new TypeReference<List<SeatTypeResponse>>() {
                });
        List<ZoneResponse> zones = relaxed.convertValue(
                jsonNode.get("zones"),
                new TypeReference<List<ZoneResponse>>() {
                } );
        LayoutGenerateResponse dto = new LayoutGenerateResponse();
        dto.setSeats(seats);
        dto.setSeatTypes(seatTypes);
        dto.setContent("🎨 Đây là layout bạn yêu cầu! Nếu vẫn chưa đúng ý, bạn có thể điều chỉnh prompt và thử lại. Mỗi lần thử là một bước gần hơn tới kết quả hoàn hảo.");
        return dto;
    }
}
