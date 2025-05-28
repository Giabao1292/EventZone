package com.example.backend.controller;

import com.example.backend.dto.response.ResponseData;
import com.example.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("{id}")
    public ResponseData<String> getUser(@PathVariable Long id) {
        return new ResponseData(HttpStatus.OK.value(), "User with id " + id + " found", "Get User");
    }


}
