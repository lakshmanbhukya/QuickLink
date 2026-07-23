package com.quicklink.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

    private static SecretKey secretKey;
    private static final long EXPIRATION_TIME = 86400000; // 24 hours in ms
    private final Algorithm algorithm;

    public JwtUtil(@Value("${app.jwt.secret:defaultQuickLinkSecretKey2026Secure256BitKey!}") String secret) {
        String effectiveSecret = (secret != null && !secret.isBlank()) ? secret : "defaultQuickLinkSecretKey2026Secure256BitKey!";
        this.algorithm = Algorithm.HMAC256(effectiveSecret);
    }

    public String generateToken(String username) {
        return JWT.create()
                .withSubject(username)
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .sign(algorithm);
    }

    public String validateTokenAndGetUsername(String token) {
        try {
            DecodedJWT decodedJWT = JWT.require(algorithm)
                    .build()
                    .verify(token);
            return decodedJWT.getSubject();
        } catch (Exception e) {
            return null;
        }
    }
}
