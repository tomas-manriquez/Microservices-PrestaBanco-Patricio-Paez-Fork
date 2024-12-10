package com.prestabanco.executive.models;

import lombok.Data;

@Data
public class ExecutiveRequest {

    private String email;
    private String password;
    private String name;
    private String firstName;
    private String lastName;
}
