package com.quicklink.repository;

import com.quicklink.model.QuickLink;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;

@Repository
public interface QuickLinkRepository extends JpaRepository<QuickLink, Long> {
    Optional<QuickLink> findByCode(String code);
    boolean existsByCode(String code);

    @Transactional
    @Modifying
    @Query("delete from QuickLink q where q.expiresAt < :now")
    int deleteQuickLinkByExpiresAt(Instant now);
}
