package com.prestabanco.executive.models;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExecutiveLoginRequest {
    private String email;
    private String password;
}
