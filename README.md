# QuickLink
> **Sub-50ms Single-Region URL Shortener & QR Code**  
> Built with **Spring Boot 3**, **React 18**, **Neon Serverless PostgreSQL**, and **Upstash Serverless Redis**.

---

### Tech Stack & Badges

![Java](https://img.shields.io/badge/Java_17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot_3.3-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/Neon_PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Upstash_Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![JWT](https://img.shields.io/badge/JWT_Auth-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)
![OpenAPI](https://img.shields.io/badge/OpenAPI_3-85EA2D?style=for-the-badge&logo=openapi-initiative&logoColor=black)

---

## System Architecture & Latency Topology

Co-locating compute and persistence services inside **AWS Singapore (`ap-southeast-1`)** eliminates cross-continental network penalties, achieving ultra-fast redirection latency across APAC:

```mermaid
flowchart TD
    subgraph Client ["Client Layer"]
        User["🌐 User / Browser"]
        Vercel["⚡ Vercel React SPA (Client)"]
    end

    subgraph AWS_SG ["AWS Singapore (ap-southeast-1)"]
        Render["🚀 Render Spring Boot 3 Engine"]
        Redis[("⚡ Upstash Redis Cache<br/>(Sub-1ms Lookups)")]
        DB[("🐘 Neon PostgreSQL<br/>(1-2ms Relational DB)")]
    end

    User -->|SPA Interactivity| Vercel
    User -->|GET /{code} Redirect| Render
    
    Render -->|1. Primary Cache Check| Redis
    Render -.->|Cache Miss Fallback| DB
    Render -->|2. Async Hit Log & Write-Back| Redis
```

### ⏱️ Precise RTT Performance Metrics

| Request Step | Routing Path | RTT Latency | Engineering Details |
|---|---|---|---|
| **Network Transit** | India User ➔ Singapore Server (Render) | **45ms – 60ms** | Undersea fiber cable propagation delay |
| **Cache Hit (Warm)** | Render ➔ Upstash Redis | **< 2ms** | Intra-datacenter AWS AZ peering |
| **DB Read (Cold)** | Render ➔ Neon PostgreSQL | **2ms – 4ms** | Same-region low-latency TCP connection |
| **Total Cache Hit RTT** | End-to-End Latency | **~47ms – 62ms** | Instantaneous HTTP 302 redirection |

---

### Core Engineering Highlights

##### 1.  Base62 Collision-Free Key Generation
##### 2.  Resilient Multi-Tier Caching
##### 3. Real-Time QR Code Generation Engine
##### 4. `@Scheduled` a cron job that purges expired links from DB
---

##  Author
- **Author**: [Lakshman Bhukya](https://github.com/lakshmanbhukya) | [LinkedIn](https://linkedin.com/in/lakshmanbhukya)
