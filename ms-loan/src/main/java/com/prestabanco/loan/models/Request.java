package com.prestabanco.loan.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Request {
    private int id;
    private int status; // 1: Rejected, 2: Evaluation, 3: Accepted, etc.
    private Long idLoan;
}
