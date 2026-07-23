package com.quicklink.controller;

import com.quicklink.service.QuickLinkService;
import com.quicklink.service.RedisService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RedirectController {
    private final QuickLinkService service;
    private final RedisService redisService;

    public RedirectController(QuickLinkService service, RedisService redisService) {
        this.service = service;
        this.redisService = redisService;
    }

    @GetMapping("/{code}")
    public ResponseEntity<Void> redirect(@PathVariable String code) {
        String redisUrl = redisService.getUrl(code);
        if (redisUrl != null) {
            return ResponseEntity.status(HttpStatus.FOUND)
                    .header(HttpHeaders.LOCATION, redisUrl)
                    .build();
        }
        return service.lookupActive(code)
                .map(url -> {
                    service.registerHit(url);
                    redisService.saveUrl(code, url.getTargetUrl());
                    return ResponseEntity.status(HttpStatus.FOUND)
                            .header(HttpHeaders.LOCATION, url.getTargetUrl())
                            .<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}

