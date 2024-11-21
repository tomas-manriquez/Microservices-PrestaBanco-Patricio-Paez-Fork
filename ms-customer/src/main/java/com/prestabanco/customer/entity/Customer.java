package com.prestabanco.customer.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idCustomer;
    private String email;
    private String password;

    @Column(unique = true, nullable = false, name = "rut")
    private String rut;
    private String name;
    private String dadSurname;
    private String motherSurname;

    // Needed information for loans
    private int age; // approved if < 68
    private boolean working; // 0 Not working | 1 Has job
    private int workingYears; // Only if working | Needed 1-2 years to be approved
    private boolean independentWorker; // 0 Not independent | 1 independent

    private boolean latePayments; // DICOM's latePayments register
    private int amountOfLatePayments;

    // To be implemented
    private boolean minCashOnAccount; // R7.1
    private boolean consistentSaveHistory; // R7.2
    private boolean periodicDeposits; // R7.3
    private boolean relationYearsAndBalance; // R7.4
    private boolean recentWithdraws; // R7.5
}
