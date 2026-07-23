package com.quicklink.controller;

import com.google.zxing.WriterException;
import com.quicklink.service.QRCodeService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/quicklink/qrcode")
public class QRCodeController {

    private final QRCodeService qrCodeService;

    public QRCodeController(QRCodeService qrCodeService) {
        this.qrCodeService = qrCodeService;
    }
    @GetMapping(produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> getQRCode(
            @RequestParam String url,
            @RequestParam(defaultValue = "250") int height,
            @RequestParam(defaultValue = "250") int width
    ){
        try {
            int boundedWidth = Math.min(Math.max(width, 50), 1000);
            int boundedHeight = Math.min(Math.max(height, 50), 1000);
            byte[] code = qrCodeService.generateQrCode(url, boundedWidth, boundedHeight);
            HttpHeaders httpheaders = new HttpHeaders();
            httpheaders.setContentType(MediaType.IMAGE_PNG);
            return new ResponseEntity<>(code, httpheaders, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
