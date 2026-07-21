package com.quicklink.service;

import com.quicklink.repository.QuickLinkRepository;
import com.quicklink.utils.Base62;
import org.springframework.stereotype.Service;

@Service
public class QuickCodeService {
    private static final int default_length = 7;
    private final QuickLinkRepository repository;

    public QuickCodeService(QuickLinkRepository repository) {
        this.repository = repository;
    }

    public String generateUniqueCode() {
        for (int i = 0; i < 10; i++) {
            String candidate = Base62.randomCode(default_length);
            if (!repository.existsByCode(candidate)) {
                return candidate;
            }
        }
        throw new IllegalArgumentException("Failed to generate unique code");
    }

    public String validateCustomAlias(String alias) {
        if (alias == null || alias.isBlank()) return null;
        if (!alias.matches("^[A-Za-z0-9_]{3,32}$")) {
            throw new IllegalArgumentException("Alias must be 3-32 characters");
        }
        if (repository.existsByCode(alias)) {
            throw new IllegalArgumentException("Alias already exists");
        }
        return alias;
    }
}
