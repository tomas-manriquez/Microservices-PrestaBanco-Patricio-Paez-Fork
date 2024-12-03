package com.prestabanco.request.clients;

import com.prestabanco.request.dto.CustomerDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "ms-customer")
public interface CustomersFeignClient {
    @GetMapping("api/customer/dto/{id}")
    CustomerDTO getCustomerById(@PathVariable("id") int id);
}

