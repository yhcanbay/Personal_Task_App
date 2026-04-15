package com.yhcanbay.taskApp.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.yhcanbay.taskApp.dto.WeeklyScheduleDto;
import com.yhcanbay.taskApp.entity.WeeklyScheduleEntity;
import com.yhcanbay.taskApp.repository.WeeklyScheduleRepository;
import org.springframework.stereotype.Service;

@Service
public class WeeklyScheduleService {

	private static final Long WEEKLY_SCHEDULE_ID = 1L;
	private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

	private final WeeklyScheduleRepository weeklyScheduleRepository;

	public WeeklyScheduleService(WeeklyScheduleRepository weeklyScheduleRepository) {
		this.weeklyScheduleRepository = weeklyScheduleRepository;
	}

	public WeeklyScheduleDto getWeeklySchedule() {
		return weeklyScheduleRepository.findById(WEEKLY_SCHEDULE_ID)
				.map(entity -> deserialize(entity.getPayload(), WeeklyScheduleDto.class))
				.orElseGet(WeeklyScheduleDto::empty);
	}

	public WeeklyScheduleDto save(WeeklyScheduleDto weeklyScheduleDto) {
		WeeklyScheduleEntity entity = new WeeklyScheduleEntity(WEEKLY_SCHEDULE_ID, serialize(weeklyScheduleDto));
		return deserialize(weeklyScheduleRepository.save(entity).getPayload(), WeeklyScheduleDto.class);
	}

	private String serialize(Object value) {
		try {
			return OBJECT_MAPPER.writeValueAsString(value);
		} catch (JsonProcessingException exception) {
			throw new IllegalStateException("Weekly schedule JSON'e cevrilemedi.", exception);
		}
	}

	private <T> T deserialize(String payload, Class<T> type) {
		try {
			return OBJECT_MAPPER.readValue(payload, type);
		} catch (JsonProcessingException exception) {
			throw new IllegalStateException("Weekly schedule JSON'dan okunamadi.", exception);
		}
	}
}
