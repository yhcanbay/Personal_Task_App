package com.yhcanbay.taskApp.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.yhcanbay.taskApp.dto.AvailabilityDto;
import com.yhcanbay.taskApp.dto.SettingsDto;
import com.yhcanbay.taskApp.dto.SubjectDto;
import com.yhcanbay.taskApp.entity.SettingsEntity;
import com.yhcanbay.taskApp.repository.SettingsRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SettingsService {

	private static final Long SETTINGS_ID = 1L;
	private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

	private final SettingsRepository settingsRepository;

	public SettingsService(SettingsRepository settingsRepository) {
		this.settingsRepository = settingsRepository;
	}

	public SettingsDto getSettings() {
		return settingsRepository.findById(SETTINGS_ID)
				.map(entity -> deserialize(entity.getPayload(), SettingsDto.class))
				.orElseGet(this::buildDefaultSettings);
	}

	public SettingsDto save(SettingsDto settingsDto) {
		SettingsEntity entity = new SettingsEntity(SETTINGS_ID, serialize(settingsDto));
		return deserialize(settingsRepository.save(entity).getPayload(), SettingsDto.class);
	}

	private SettingsDto buildDefaultSettings() {
		return new SettingsDto(
				List.of(new AvailabilityDto("09:00", "18:00")),
				6,
				45,
				10,
				"system",
				List.of(
						new SubjectDto("math", "Matematik", "#FF5733"),
						new SubjectDto("physics", "Fizik", "#33FF57")
				)
		);
	}

	private String serialize(Object value) {
		try {
			return OBJECT_MAPPER.writeValueAsString(value);
		} catch (JsonProcessingException exception) {
			throw new IllegalStateException("Settings JSON'e cevrilemedi.", exception);
		}
	}

	private <T> T deserialize(String payload, Class<T> type) {
		try {
			return OBJECT_MAPPER.readValue(payload, type);
		} catch (JsonProcessingException exception) {
			throw new IllegalStateException("Settings JSON'dan okunamadi.", exception);
		}
	}
}
