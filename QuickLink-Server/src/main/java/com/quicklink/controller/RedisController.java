package com.quicklink.controller;

import com.quicklink.service.RedisService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("api/redis")
public class RedisController {

    private final RedisService redisService;
    public RedisController(RedisService redisService) {
        this.redisService = redisService;
    }
    @PostMapping
    public ResponseEntity<String> createRecord(@RequestBody Map<String,String> payload){
        String shortCode = payload.get("shortCode");
        String longUrl = payload.get("longUrl");
        redisService.saveUrl(shortCode, longUrl);
        return ResponseEntity.ok("success");
    }
    @GetMapping("/{code}")
    public ResponseEntity<String> getRecord(@PathVariable String code){
        return ResponseEntity.ok().body(redisService.getUrl(code));
    }
}
