package com.yhcanbay.taskApp.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "weekly_schedules")
public class WeeklyScheduleEntity {

	@Id
	private Long id;

	@Column(nullable = false, columnDefinition = "TEXT")
	private String payload;

	protected WeeklyScheduleEntity() {
	}

	public WeeklyScheduleEntity(Long id, String payload) {
		this.id = id;
		this.payload = payload;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getPayload() {
		return payload;
	}

	public void setPayload(String payload) {
		this.payload = payload;
	}
}
