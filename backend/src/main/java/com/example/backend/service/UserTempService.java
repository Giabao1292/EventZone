package com.example.backend.service;

import com.example.backend.dto.request.RegisterRequest;
import com.example.backend.model.UserTemp;

public interface UserTempService {
    UserTemp saveUser(RegisterRequest registerRequest);
}
