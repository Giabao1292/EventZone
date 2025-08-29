package com.example.backend.controller;

import com.example.backend.dto.response.LayoutGenerateResponse;
import com.example.backend.dto.response.ResponseData;
import com.example.backend.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    @Autowired
    private AIService aiService;

    @PostMapping("/generate-layout")
    public ResponseData<LayoutGenerateResponse> chatWithAI(
            @RequestBody String prompt) {
        try {
            LayoutGenerateResponse dto = aiService.callOpenRouter(prompt);
            return new ResponseData<>(HttpStatus.OK.value(), "Generate layout successfully", dto);
        } catch (Exception ex) {
            return new ResponseData<>(HttpStatus.BAD_REQUEST.value(),"AI error: " + ex.getMessage());
        }
    }
}
