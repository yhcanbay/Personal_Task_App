package com.yhcanbay.taskApp.repository;

import com.yhcanbay.taskApp.entity.WeeklyScheduleEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WeeklyScheduleRepository extends JpaRepository<WeeklyScheduleEntity, Long> {
}
