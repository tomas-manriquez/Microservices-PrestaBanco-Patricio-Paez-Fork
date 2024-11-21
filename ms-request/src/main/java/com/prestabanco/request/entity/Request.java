package com.prestabanco.request.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Request {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idRequest;
    private int status; // 1 Rejected 2 Evaluation by executive 3 Accepted 4 Eliminated by customer 5 Delivering loan
    private int idCustomer;
    private int idLoan;
}
