package com.prestabanco.customer.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
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
