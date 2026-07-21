package com.quicklink.service;

import com.quicklink.dto.CreateQuickLinkRequest;
import com.quicklink.model.QuickLink;
import com.quicklink.model.User;
import com.quicklink.repository.QuickLinkRepository;
import com.quicklink.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URISyntaxException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

@Service
public class QuickLinkService {
    private final QuickLinkRepository repository;
    private final QuickCodeService codeService;
    private final UserRepository userRepository;

    public QuickLinkService(QuickLinkRepository repository, QuickCodeService codeService, UserRepository userRepository) {
        this.repository = repository;
        this.codeService = codeService;
        this.userRepository = userRepository;
    }

    public QuickLink create(CreateQuickLinkRequest request) {
        String target = normalizeUrl(request.getUrl());

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = null;
        if (authentication != null && authentication.isAuthenticated() && !authentication.getPrincipal().equals("anonymousUser")) {
            String username = (String) authentication.getPrincipal();
            currentUser = userRepository.findByUsername(username).orElse(null);
        }

        String code;
        if (request.getAlias() != null) {
            if (currentUser == null) {
                throw new IllegalArgumentException("Authentication required to request a custom alias");
            }
            code = codeService.validateCustomAlias(request.getAlias());
        } else {
            code = codeService.generateUniqueCode();
        }

        int expiryDays = (request.getExpiryDays() != null && request.getExpiryDays() > 0) ? request.getExpiryDays() : 1;
        Instant expiresAt = Instant.now().plus(expiryDays, ChronoUnit.DAYS);
        QuickLink quickLink = new QuickLink(code, target, expiresAt);
        quickLink.setUser(currentUser);
        return repository.save(quickLink);
    }

    public Optional<QuickLink> lookupActive(String code) {
        return repository.findByCode(code)
                .filter(url -> url.getExpiresAt() == null || url.getExpiresAt().isAfter(Instant.now()));
    }

    @Async
    @Transactional
    public void registerHit(QuickLink quickLink) {
        quickLink.setHits(quickLink.getHits() + 1);
        quickLink.setLastAccessedAt(Instant.now());
        repository.save(quickLink);
    }

    private String normalizeUrl(String input) {
        try {
            URI uri = new URI(input.trim());
            if (uri.getScheme() == null) {
                uri = new URI("https://" + input.trim());
            }
            if (!uri.getScheme().equalsIgnoreCase("http") &&
                    !uri.getScheme().equalsIgnoreCase("https")) {
                throw new IllegalArgumentException("Only http or https schemes are supported");
            }
            return uri.normalize().toString();
        } catch (URISyntaxException e) {
            throw new IllegalArgumentException(e);
        }
    }
}
