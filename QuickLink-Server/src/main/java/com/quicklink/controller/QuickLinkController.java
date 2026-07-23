package com.quicklink.controller;

import com.quicklink.dto.CreateQuickLinkRequest;
import com.quicklink.model.QuickLink;
import com.quicklink.service.QRCodeService;
import com.quicklink.service.QuickLinkService;
import com.quicklink.service.RedisService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/quicklinks")
public class QuickLinkController {

    private final QuickLinkService quickLinkService;

    public QuickLinkController(QuickLinkService quickLinkService,RedisService redisService) {
        this.quickLinkService = quickLinkService;
    }

    @PostMapping
    public ResponseEntity<QuickLink> registerQuickLink(@Valid @RequestBody CreateQuickLinkRequest request){
        QuickLink result = quickLinkService.create(request);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{code}")
    public ResponseEntity<QuickLink> getQuickLink(@PathVariable String code){
        return quickLinkService.lookupActive(code)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
