package com.yhcanbay.taskApp.repository;

import com.yhcanbay.taskApp.entity.SettingsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SettingsRepository extends JpaRepository<SettingsEntity, Long> {
}
