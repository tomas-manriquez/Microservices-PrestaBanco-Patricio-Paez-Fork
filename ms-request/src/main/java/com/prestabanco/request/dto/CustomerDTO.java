package com.prestabanco.request.dto;

import lombok.Data;

@Data
public class CustomerDTO {
    private int idCustomer;
    private String name;
    private int age;
    private boolean minCashOnAccount;
    private boolean consistentSaveHistory;
    private boolean periodicDeposits;
    private boolean relationYearsAndBalance;
    private boolean recentWithdraws;
    private boolean latePayments;
}
