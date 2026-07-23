package com.quicklink.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@Slf4j
public class RedisService {

    private final StringRedisTemplate redisTemplate;

    public RedisService(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public void saveUrl(String shortCode, String longUrl) {
        try {
            redisTemplate.opsForValue().set(shortCode, longUrl, 30, TimeUnit.MINUTES);
        } catch (Exception e) {
            log.warn("Redis cache save skipped for code {}: {}", shortCode, e.getMessage());
        }
    }

    public String getUrl(String shortCode) {
        try {
            return redisTemplate.opsForValue().get(shortCode);
        } catch (Exception e) {
            log.warn("Redis cache lookup skipped for code {}: {}", shortCode, e.getMessage());
            return null;
        }
    }
}
