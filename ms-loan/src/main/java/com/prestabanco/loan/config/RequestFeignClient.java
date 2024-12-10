package com.prestabanco.loan.config;

import com.prestabanco.loan.models.Request;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "ms-request", path = "/api/request")
public interface RequestFeignClient {

    @PostMapping("/")
    Request createRequest(@RequestBody Request request);
}

