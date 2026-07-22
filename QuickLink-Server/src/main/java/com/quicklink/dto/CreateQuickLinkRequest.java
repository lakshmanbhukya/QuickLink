package com.quicklink.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateQuickLinkRequest {

    @NotBlank(message = "URL is required")
    @Size(max = 2048, message = "URL is too long")
    private String url;

    @Size(min = 3, max = 32, message = "Alias must be between 3 and 32 characters")
    private String alias;

    private Integer expiryDays;
}
