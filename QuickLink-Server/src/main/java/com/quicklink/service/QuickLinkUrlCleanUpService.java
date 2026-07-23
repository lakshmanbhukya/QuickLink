
package com.quicklink.service;

import com.quicklink.repository.QuickLinkRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@Slf4j
public class QuickLinkUrlCleanUpService {
    private final QuickLinkRepository repository;

    public QuickLinkUrlCleanUpService(QuickLinkRepository repository) {
        this.repository = repository;
    }

    @Scheduled(cron = "@midnight")
    public void cleanUp(){
        try {
            log.info("Executing QuickLinkUrlCleanUpService.cleanUp");
            int deletedCount = repository.deleteQuickLinkByExpiresAt(Instant.now());
            log.info("cleanUp executed successfully, deleted {} expired links", deletedCount);
        } catch (Exception e) {
            log.error("Error during scheduled URL cleanup: {}", e.getMessage(), e);
        }
    }

}
