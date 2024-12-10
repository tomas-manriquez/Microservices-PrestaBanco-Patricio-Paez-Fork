package com.prestabanco.customer.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserPutRequest {

    private String name;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private int age;

    private boolean working;
    private int workingYears;
    private boolean independentWorker;

    private boolean latePayments;
    private int amountOfLatePayments;

    private boolean minCashOnAccount;
    private boolean consistentSaveHistory;
    private boolean periodicDeposits;
    private boolean relationYearsAndBalance;
    private boolean recentWithdraws;

}
