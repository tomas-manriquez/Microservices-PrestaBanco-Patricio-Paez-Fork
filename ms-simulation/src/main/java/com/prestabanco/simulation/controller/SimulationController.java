package com.prestabanco.simulation.controller;

import com.prestabanco.simulation.models.LoanSimulationRequest;
import com.prestabanco.simulation.models.TotalCostRequest;
import com.prestabanco.simulation.service.SimulationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/simulation")
public class SimulationController {

    private final SimulationService simulationService;

    public SimulationController(SimulationService simulationService) {
        this.simulationService = simulationService;
    }

    @PostMapping("/loan")
    public ResponseEntity<Map<String, Object>> calculateLoan(@RequestBody LoanSimulationRequest request) {
        return ResponseEntity.ok(simulationService.calculateLoan(request));
    }

    @PostMapping("/total-cost")
    public ResponseEntity<Map<String, Object>> calculateTotalCost(@RequestBody TotalCostRequest request) {
        return ResponseEntity.ok(simulationService.calculateTotalCost(request));
    }
}
